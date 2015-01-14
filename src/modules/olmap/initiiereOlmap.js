/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                 = require('jquery'),
    ol                                = require('ol'),
    ga                                = require('ga'),
    initiiereLayertree                = require('./initiiereLayertree'),
    createLayers                      = require('./createLayers'),
    addDragAndDropGeofiles            = require('./addDragAndDropGeofiles'),
    blendeOlmapExportieren            = require('./blendeOlmapExportieren'),
    entferneAlleApfloraLayer          = require('./entferneAlleApfloraLayer'),
    addShowFeatureInfoOnClick         = require('./addShowFeatureInfoOnClick'),
    changeCursorOverFeature           = require('./changeCursorOverFeature'),
    addMousePositionControl           = require('./addMousePositionControl'),
    addFullScreenControl              = require('./addFullScreenControl'),
    entferneModifyInteractionFuerTpop = require('./entferneModifyInteractionFuerTpop');

module.exports = function () {
    console.log('initiiereOlmap');

    // allfällige Apflora-Ebenen entfernen
    entferneAlleApfloraLayer();
    // allfällige Modify-Interaktion entfernen
    entferneModifyInteractionFuerTpop();

    // Karte nur aufbauen, wenn dies nicht schon passiert ist
    // TODO: ol.View2D wird ol:View
    // hat aber im Test Fehler provoziert
    if (!window.apf.olMap.map) {
        //window.apf.olMap.map = new ga.Map({
        window.apf.olMap.map = new ol.Map({
            target: 'olMapDiv',
            layers: [ga.layer.create('ch.swisstopo.pixelkarte-farbe')],
            // 14.1.2015: provisorisch ausgeschaltet, wegen Fehler
            //layers: createLayers(),
            view: new ol.View({
                //resolution: 4,
                center: [693000, 253000]
            })
        });

        console.log('initiiereOlmap 2');

        // diverse features und Fähigkeiten ergänzen
        // provisorisch ausgeschaltet wegen Fehler, 14.1.2014
        addDragAndDropGeofiles();
        addShowFeatureInfoOnClick();
        changeCursorOverFeature();
        initiiereLayertree();
        addMousePositionControl();    // assertion failed
        addFullScreenControl();

        window.apf.olMap.map.on('change:size', function () {
            // steuern, ob das Export-Tool sichtbar ist
            // wenn es bei hoher Pixelzahl sichtbar ist, gibt es Probleme
            blendeOlmapExportieren();
        });
    }
};