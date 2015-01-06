/*
 * aktualisiert die Daten beim Zuordnen von Beobachtungen zu Teilpopulationen
 * wenn diese Funktion nicht von move_node aufgerufen wird,
 * verschiebt sie zuerst einen allfälligen Node der Beobachtung
 * wenn von der olMap ausgelöst, erhält sie einen olmapCallback
 * der die Darstellung auf der Karte aktualisiert
 *
 * beobStatus markiert, ob die Beobachtung folgendermassen sein soll:
 * - schon zugewiesen (zugeordnet)
 * - noch nicht beurteilt (nicht_beurteilt)
 * - nicht zuzuordnen (nicht_zuzuordnen)
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

function aktualisiereGlobaleVariable (tpopId) {
    if (window.apf.beob) {
        if (tpopId) {
            window.apf.beob.zuordnung = window.apf.beob.zuordnung || {};
            window.apf.beob.zuordnung.TPopId = tpopId;
        } else {
            if (window.apf.beob.zuordnung && window.apf.beob.zuordnung.TPopId) { delete window.apf.beob.zuordnung.TPopId; }
        }
    }
}

function aktualisiereZuordnungInOlmap (beobId, tpopId) {
    var newBeobZuordGeometry,
        beobZuordnungFeature,
        beobX = window.apf.beob.COORDONNEE_FED_E,
        beobY = window.apf.beob.COORDONNEE_FED_N,
        tpopX,
        tpopY;

    // koordinaten der tpop holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tpop/feld=TPopId/wertNumber=' + tpopId
    }).done(function (data) {
        if (data && data[0]) {
            data  = data[0];
            tpopX = data.TPopXKoord;
            tpopY = data.TPopYKoord;

            newBeobZuordGeometry = new ol.geom.LineString([[beobX, beobY], [tpopX, tpopY]]);
            // beob zuordnen
            beobZuordnungFeature = _.find(window.apf.olMap.beobZuordnungsLayerFeatures, function(feature) {
                return feature.get('myId') == beobId;
            });
            // beobZuordnung anpassen
            beobZuordnungFeature.setGeometry(newBeobZuordGeometry);
        }
    });
}

module.exports = function (beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback) {
    var $beobNode,
        $beobNichtBeurteilt;

    $beobNode = $('#beob' + beobId);

    // prüfen, ob die Funktion von move_node aufgerufen wird. Falls nein:
    // prüfen, ob für die Beobachtung ein node existiert
    if (!jstreeCallback && $beobNode.length) {
        // es gibt einen node für diese Beob
        // zuerst diesen node verschieben
        // move_node ruft dann wieder diese Funktion auf, mit jstreeCallback

        // allfälligen olmapCallback zwischenspeichern
        if (olmapCallback) {
            window.apf.olmapCallback = olmapCallback;
        }

        switch (beobStatus) {
        case 'nicht_beurteilt':
            $beobNichtBeurteilt = $('#beobNichtBeurteilt');
            if ($beobNichtBeurteilt.prop('checked') === true) {
                $('#tree').jstree('move_node', '#beob' + beobId, '#apOrdnerBeobNichtBeurteilt' + localStorage.apId, 'first');
            } else {
                // es bringt nichts, diesen Haken zu entfernen
                // stattdessen soll ein anderer Wert gewählt werden
                $beobNichtBeurteilt.prop('checked', true);
            }
            // globale Variable anpassen, falls nötig
            aktualisiereGlobaleVariable();
            break;
        case 'nicht_zuordnen':
            if ($('#beobNichtZuordnen').prop('checked') === true) {
                $('#tree').jstree('move_node', '#beob' + beobId, '#apOrdnerBeobNichtZuzuordnen' + localStorage.apId, 'first');
            } else {
                $('#tree').jstree('move_node', '#beob' + beobId, '#apOrdnerBeobNichtBeurteilt' + localStorage.apId, 'first');
            }
            // globale Variable anpassen, falls nötig
            aktualisiereGlobaleVariable();
            break;
        case 'zugeordnet':
            $('#tree').jstree('move_node', '#beob' + beobId, '#tpopOrdnerBeobZugeordnet' + tpopId, 'first');
            break;
        }
        return;
    }

    // allfälligen zwischengespeicherten olmapCallback wiederherstellen
    if (window.apf.olmapCallback) {
        olmapCallback = window.apf.olmapCallback;
        delete window.apf.olmapCallback;
    }

    switch (beobStatus) {
    case 'nicht_beurteilt':
        $.ajax({
            type: 'delete',
            url: 'api/v1/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + beobId
        }).done(function () {
            // tree aktualisieren, falls von move_node ausgelöst
            if (jstreeCallback) { jstreeCallback(); }
            // olMap aktualisieren, falls von ihr ausgelöst
            if (olmapCallback)  { olmapCallback(); }
            // wenn kein olmapCallback aber olmap offen
            if (!olmapCallback && window.apf.olMap.beobZuordnungsLayerFeatures && $("#olMap").is(':visible')) {
                // vermutlich sollte das beobzuordnungs-Layer nachgeführt werden
                // und zwar soll die BeobZuordnung bleiben, aber nur ein Punkt sein
                var newBeobZuordGeometry,
                    beobZuordnungFeature,
                    beobX = window.apf.beob.COORDONNEE_FED_E,
                    beobY = window.apf.beob.COORDONNEE_FED_N;

                newBeobZuordGeometry = new ol.geom.LineString([[beobX, beobY], [beobX, beobY]]);
                // beob zuordnen
                beobZuordnungFeature = _.find(window.apf.olMap.beobZuordnungsLayerFeatures, function(feature) {
                    return feature.get('myId') == beobId;
                });

                // beobZuordnung anpassen
                beobZuordnungFeature.setGeometry(newBeobZuordGeometry);
            }
            // globale Variable aktualisieren
            aktualisiereGlobaleVariable();
        }).fail(function () {
            melde("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
        });
        break;
    case 'nicht_zuordnen':
        $.ajax({
            type: 'post',
            url: 'api/v1/update/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + beobId + '/feld=beobNichtZuordnen/wert=1/user=' + encodeURIComponent(sessionStorage.user)
        }).done(function () {
            // TPopId null setzen
            $.ajax({
                type: 'post',
                url: 'api/v1/update/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + beobId + '/feld=TPopId/wert=/user=' + encodeURIComponent(sessionStorage.user)
            }).done(function () {
                // tree aktualisieren, falls von move_node ausgelöst
                if (jstreeCallback) { jstreeCallback(); }
                // olMap aktualisieren, falls von ihr ausgelöst
                if (olmapCallback)  { olmapCallback(); }
                // wenn kein olmapCallback aber olmap offen
                if (!olmapCallback && window.apf.olMap.beobZuordnungsLayerFeatures && $("#olMap").is(':visible')) {
                    // vermutlich sollte das beobzuordnungs-Layer nachgeführt werden
                    // und zwar soll die BeobZuordnung bleiben, aber nur ein Punkt sein
                    var newBeobZuordGeometry,
                        beobZuordnungFeature,
                        beobX = window.apf.beob.COORDONNEE_FED_E,
                        beobY = window.apf.beob.COORDONNEE_FED_N;

                    newBeobZuordGeometry = new ol.geom.LineString([[beobX, beobY], [beobX, beobY]]);
                    // beob zuordnen
                    beobZuordnungFeature = _.find(window.apf.olMap.beobZuordnungsLayerFeatures, function(feature) {
                        return feature.get('myId') == beobId;
                    });

                    // beobZuordnung anpassen
                    beobZuordnungFeature.setGeometry(newBeobZuordGeometry);
                }
                // globale Variable aktualisieren
                aktualisiereGlobaleVariable();
            }).fail(function () {
                console.log("fehler beim Leeren von TPopId");
            });
        }).fail(function () {
            melde("Fehler: Die Beobachtung wurde nicht verschoben");
        });
        break;
    case 'zugeordnet':
        // Daten aktualisieren
        if (beobTpopId) {
            // die Beobachtung war schon einer TPop zugeordnet
            // es gibt schon einen Datensatz in Tabelle beobzuordnung
            // er muss nur noch aktualisiert werden
            $.ajax({
                type: 'post',
                url: 'api/v1/update/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + beobId + '/feld=TPopId/wert=' + tpopId + '/user=' + encodeURIComponent(sessionStorage.user)
            }).done(function () {
                // tree aktualisieren, falls von move_node ausgelöst
                if (jstreeCallback) { jstreeCallback(); }
                // olMap aktualisieren, falls von ihr ausgelöst
                if (olmapCallback)  { olmapCallback(); }
                // wenn kein olmapCallback aber olmap offen
                if (!olmapCallback && window.apf.olMap.beobZuordnungsLayerFeatures && $("#olMap").is(':visible')) {
                    // vermutlich sollte das beobzuordnungs-Layer nachgeführt werden
                    aktualisiereZuordnungInOlmap(beobId, tpopId);
                }
                // globale Variable aktualisieren
                aktualisiereGlobaleVariable(tpopId);
            }).fail(function () {
                melde('Fehler: die Beobachtung konnte nicht zugeordnet werden');
            });
        } else {
            // die Beobachtung war noch keiner TPop zugeordnet
            // es gibt noch keinen Datensatz in Tabelle beobzuordnung
            // er muss inserted werden
            $.ajax({
                type: 'post',
                url: 'api/v1/insert/apflora/tabelle=beobzuordnung/feld=NO_NOTE/wert=' + beobId + '/user=' + encodeURIComponent(sessionStorage.user)
            }).done(function () {
                // jetzt aktualisieren
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + beobId + '/feld=TPopId/wert=' + tpopId + '/user=' + encodeURIComponent(sessionStorage.user)
                }).done(function () {
                    // tree aktualisieren, falls von move_node ausgelöst
                    if (jstreeCallback) { jstreeCallback(); }
                    // olMap aktualisieren, falls von ihr ausgelöst
                    if (olmapCallback)  { olmapCallback(); }
                    // wenn kein olmapCallback aber olmap offen
                    if (!olmapCallback && window.apf.olMap.beobZuordnungsLayerFeatures && $("#olMap").is(':visible')) {
                        // vermutlich sollte das beobzuordnungs-Layer nachgeführt werden
                        aktualisiereZuordnungInOlmap(beobId, tpopId);
                    }
                    // globale Variable aktualisieren
                    aktualisiereGlobaleVariable(tpopId);
                }).fail(function () {
                    melde('Fehler: die Beobachtung konnte nicht zugeordnet werden');
                });
            }).fail(function () {
                melde('Fehler: die Beobachtung konnte nicht zugeordnet werden');
            });
        }
        break;
    }
};