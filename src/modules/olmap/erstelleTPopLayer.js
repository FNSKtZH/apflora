// nimmt drei Variablen entgegen:
// tpopListe: Die Liste der darzustellenden Teilpopulationen
// tpopidMarkiert: die ID der zu markierenden TPop
// visible: Ob das Layer sichtbar sein soll

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                   = require('jquery'),
    _                                   = require('underscore'),
    ol                                  = require('ol'),
    styleTPop                           = require('./styleTPop'),
    erstelleMarkerFuerTPopLayer         = require('./erstelleMarkerFuerTPopLayer'),
    addSelectFeaturesInSelectableLayers = require('./addSelectFeaturesInSelectableLayers'),
    pruefeObPopTpopGewaehltWurden       = require('./pruefeObPopTpopGewaehltWurden');

module.exports = function (tpopListe, tpopidMarkiert, visible, beobZuordnen) {
    var tpopLayerErstellt = $.Deferred(),
        tpopLayer,
        markers = [],
        marker,
        selectedFeatures;

    if (window.apf.olMap.map.olmapSelectInteraction && tpopidMarkiert) {
        selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray();
    } else if (tpopidMarkiert) {
        addSelectFeaturesInSelectableLayers();
        selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray();
    }

    visible = (visible === true);

    _.each(tpopListe, function (tpop) {
        // marker erstellen...
        marker = erstelleMarkerFuerTPopLayer(tpop);

        // ...und in Array speichern
        markers.push(marker);

        // markierte in window.apf.olMap.map.olmapSelectInteraction ergänzen
        if (tpopidMarkiert && tpopidMarkiert.indexOf(tpop.TPopId) !== -1) {
            selectedFeatures.push(marker);
        }
    });

    // layer für Marker erstellen
    tpopLayer = new ol.layer.Vector({
        title: 'Teilpopulationen',
        source: new ol.source.Vector({
            features: markers
        }),
        style: function (feature, resolution) {
            return styleTPop(feature, resolution);
        }
    });
    tpopLayer.set('visible', visible);
    tpopLayer.set('kategorie', 'AP Flora');

    // ...und der Karte hinzufügen
    window.apf.olMap.map.addLayer(tpopLayer);
    // globale Variable erstellen, dasmit das Layer direkt entfernt werden kann
    window.apf.olMap.tpopLayer = tpopLayer;

    if (selectedFeatures && selectedFeatures.length > 0 && !beobZuordnen) {
        setTimeout(function () {
            pruefeObPopTpopGewaehltWurden();
        }, 100);
        // Schaltfläche olMapAuswaehlen aktivieren
        $('#olMapAuswaehlen')
            .prop('checked', true)
            .button()
            .button("refresh");
    }

    tpopLayerErstellt.resolve();
    return tpopLayerErstellt.promise();
};