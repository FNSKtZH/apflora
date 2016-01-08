'use strict'

var ol = require('ol')
var melde = require('../melde')
var download = require('../download')

module.exports = function (layer, selectedValue) {
  var layerName = layer.get('title') || 'Eigene_Ebene'
  var allFeatures = layer.getSource().getFeatures()
  var format = new ol.format[selectedValue]()
  var dataParsed
  var dataStringified
  var serializer

  layerName += '.' + selectedValue
  try {
    dataParsed = format.writeFeatures(allFeatures)
  } catch (e) {
    melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export')
    return
  }
  if (selectedValue === 'GeoJSON') {
    try {
      dataStringified = JSON.stringify(dataParsed, null, 4)
    } catch (e) {
      melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export')
    }
  } else {
    serializer = new window.XMLSerializer()
    try {
      dataStringified = serializer.serializeToString(dataParsed)
    } catch (e) {
      melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export')
    }
  }
  download(layerName, dataStringified)
}
