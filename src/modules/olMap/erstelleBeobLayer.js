// übernimmt drei Variablen: beobliste ist das Objekt mit den zugeordneten Beobachtungen
// beobidMarkiert der Array mit den ausgewählten Pop
// visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                   = require('jquery'),
    _                                   = require('underscore'),
    ol                                  = require('ol'),
    stylePop                            = require('./stylePop'),
    beobContent                         = require('../../templates/olmapPopupBeob'),
    addSelectFeaturesInSelectableLayers = require('./addSelectFeaturesInSelectableLayers'),
    pruefeObPopTpopGewaehltWurden       = require('./pruefeObPopTpopGewaehltWurden');

module.exports = function (beobArray, beobidMarkiert, visible) {
    var beobLayerErstellt = $.Deferred(),
        markers = [],
        marker,
        myLabel,
        myName,
        popupContent,
        beobLayer,
        selectedFeatures;

    if (window.apf.olMap.map && window.apf.olMap.map.olmapSelectInteraction && beobidMarkiert) {
        selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray();
    } else if (beobidMarkiert) {
        addSelectFeaturesInSelectableLayers();
        selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray();
    }

    visible = (visible === true);

    _.each(beobArray, function (beob) {
        myName       = beob.DESC_LOCALITE || '(kein Name)';
        popupContent = beobContent(beob);

        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        myLabel = (beob.Datum ? beob.Datum.toString() : '?');

        // marker erstellen...
        marker = new ol.Feature({
            geometry: new ol.geom.Point([beob.X, beob.Y]),
            popNr:        myLabel,
            popName:      myName,
            name:         myLabel, // noch benötigt? TODO: entfernen
            popupContent: popupContent,
            popupTitle:   myName,
            // Koordinaten werden gebraucht, damit das popup richtig platziert werden kann
            xkoord:       beob.X,
            ykoord:       beob.Y,
            myTyp:        'beob',
            myId:         beob.NO_NOTE
        });

        // marker in Array speichern
        markers.push(marker);

        // markierte in window.apf.olMap.map.olmapSelectInteraction ergänzen
        if (beobidMarkiert && beobidMarkiert.indexOf(beob.PopId) !== -1) {
            selectedFeatures.push(marker);
        }
    });

    // layer für Marker erstellen
    beobLayer = new ol.layer.Vector({
        title:      'Beobachtungen',
        selectable: true,
        source: new ol.source.Vector({
            features: markers
        }),
        style: function (feature, resolution) {
            return stylePop(feature, resolution);
        }
    });
    beobLayer.set('visible', visible);
    beobLayer.set('kategorie', 'AP Flora');
    window.apf.olMap.map.addLayer(beobLayer);

    beobLayerErstellt.resolve();
    return beobLayerErstellt.promise();
};