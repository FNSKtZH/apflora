'use strict'

var ol = require('ol')
var ga = require('ga')
var initiiereLayertree = require('./initiiereLayertree')
var createLayers = require('./createLayers')
var addDragAndDropGeofiles = require('./addDragAndDropGeofiles')
var blendeOlmapExportieren = require('./blendeOlmapExportieren')
var entferneAlleApfloraLayer = require('./entferneAlleApfloraLayer')
var addShowFeatureInfoOnClick = require('./addShowFeatureInfoOnClick')
var changeCursorOverFeature = require('./changeCursorOverFeature')
var addMousePositionControl = require('./addMousePositionControl')
var addFullScreenControl = require('./addFullScreenControl')
var entferneModifyInteractionFuerTpop = require('./entferneModifyInteractionFuerTpop')

module.exports = function () {
  // allfällige Apflora-Ebenen entfernen
  entferneAlleApfloraLayer()
  // allfällige Modify-Interaktion entfernen
  entferneModifyInteractionFuerTpop()

  // Karte nur aufbauen, wenn dies nicht schon passiert ist
  // TODO: ol.View2D wird ol:View
  // hat aber im Test Fehler provoziert
  if (!window.apf.olMap.map) {
    window.apf.olMap.map = new ga.Map({
      target: 'olMapDiv',
      layers: createLayers(),
      view: new ol.View({
        resolution: 4,
        center: [693000, 253000]
      })
    })

    // diverse features und Fähigkeiten ergänzen
    addDragAndDropGeofiles()
    addShowFeatureInfoOnClick()
    changeCursorOverFeature()
    initiiereLayertree()
    addMousePositionControl()
    addFullScreenControl()

    window.apf.olMap.map.on('change:size', function () {
      // steuern, ob das Export-Tool sichtbar ist
      // wenn es bei hoher Pixelzahl sichtbar ist, gibt es Probleme
      blendeOlmapExportieren()
    })
  }
}
