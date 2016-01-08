'use strict'

var ol = require('ol')
var frageNameFuerEbene = require('./frageNameFuerEbene')
var defaultStyle = require('./defaultStyle')
var initiiereLayertree = require('./initiiereLayertree')
var erstelleGuid = require('../erstelleGuid')

module.exports = function () {
  var styleFunction,
    dragAndDropInteraction

  styleFunction = function (feature, resolution) {
    var featureStyleFunction = feature.getStyleFunction()

    if (featureStyleFunction) {
      return featureStyleFunction.call(feature, resolution)
    }
    return defaultStyle[feature.getGeometry().getType()]
  }

  dragAndDropInteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [
      ol.format.GPX,
      ol.format.GeoJSON,
      ol.format.IGC,
      ol.format.KML,
      ol.format.TopoJSON
    ]
  })

  window.apf.olMap.map.addInteraction(dragAndDropInteraction)

  dragAndDropInteraction.on('addfeatures', function (event) {
    var vectorSource,
      dragAndDropLayer,
      view

    vectorSource = new ol.source.Vector({
      features: event.features
    })
    dragAndDropLayer = new ol.layer.Vector({
      guid: erstelleGuid(),
      source: vectorSource,
      style: styleFunction,
      title: 'eigene Ebene',
      kategorie: 'Eigene Ebenen'
    })
    window.apf.olMap.map.addLayer(dragAndDropLayer)
    view = window.apf.olMap.map.getView()
    view.fitExtent(vectorSource.getExtent(), /** @type {ol.Size} */ (window.apf.olMap.map.getSize()))
    // layertree aktualisieren
    initiiereLayertree('Eigene Ebenen')
    frageNameFuerEbene(dragAndDropLayer)
  })
}
