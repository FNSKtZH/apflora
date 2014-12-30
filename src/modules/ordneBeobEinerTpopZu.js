/*
 * aktualisiert die Daten beim Zuordnen von Beobachtungen zu Teilpopulationen
 * wenn diese Funktion nicht von move_node aufgerufen wird,
 * verschiebt sie zuerst einen allfälligen Node der Beobachtung
 * wenn von der olMap ausgelöst, erhält sie einen olmapCallback
 * der die Darstellung auf der Karte aktualisiert
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

function aktualisiereGlobaleVariable (tpopId) {
    if (window.apf.beob) {
        window.apf.beob.zuordnung = window.apf.beob.zuordnung || {};
        window.apf.beob.zuordnung.TPopId = tpopId;
    }
    
}

module.exports = function (beobId, tpopId, beobTpopId, olmapCallback, jstreeCallback) {
    var $beobNode;

    $beobNode = $('#beob' + beobId);

    console.log('beobId: ', beobId);
    console.log('tpopId: ', tpopId);
    console.log('beobTpopId: ', beobTpopId);
    console.log('olmapCallback: ', olmapCallback);
    console.log('window.apf.olmapCallback: ', window.apf.olmapCallback);
    console.log('jstreeCallback: ', jstreeCallback);

    // prüfen, ob die Funktion von move_node aufgerufen wird. Falls nein:
    // prüfen, ob für die Beobachtung ein node existiert
    if (!jstreeCallback && $beobNode.length) {
        // es gibt einen node für diese Beob
        // zuerst diesen node verschieben
        // move_node ruft dann wieder diese Funktion auf, mit jstreeCallback
        // olmapCallback zwischenspeichern
        window.apf.olmapCallback = olmapCallback;
        $('#tree').jstree('move_node', '#beob' + beobId, '#tpopOrdnerBeobZugeordnet' + tpopId, 'first');
        return;
    }

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
            if (window.apf.olmapCallback) {
                olmapCallback = window.apf.olmapCallback;
                delete window.apf.olmapCallback;
            }
            if (olmapCallback)  { olmapCallback(); }
            // wenn kein olmapCallback aber olmap offen, 
            if (!olmapCallback && window.apf.olMap.beobZuordnungsLayerFeatures && $("#olMap").is(':visible')) {
                // vermutlich sollte das beobzuordnungs-Layer nachgeführt werden
                var newBeobZuordGeometry,
                    beobZuordnungFeature,
                    beobX = window.apf.beob.COORDONNEE_FED_E,
                    beobY = window.apf.beob.COORDONNEE_FED_N,
                    tpopX,
                    tpopY;

                // koordinaten der tpop holen
                $.ajax({
                    type: 'get',
                    url: 'api/v1/insert/apflora/tabelle=tpop/feld=TPopId/wertNumber=' + tpopId
                }).done(function (data) {
                    if (data && data[0]) {
                        data = data[0];
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
                if (window.apf.olmapCallback) {
                    olmapCallback = window.apf.olmapCallback;
                    delete window.apf.olmapCallback;
                }
                if (olmapCallback)  { olmapCallback(); }
                // globale Variable aktualisieren
                aktualisiereGlobaleVariable(tpopId);
            }).fail(function () {
                melde('Fehler: die Beobachtung konnte nicht zugeordnet werden');
            });
        }).fail(function () {
            melde('Fehler: die Beobachtung konnte nicht zugeordnet werden');
        });
    }
};