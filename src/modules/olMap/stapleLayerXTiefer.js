'use strict'

var initiiereLayertree = require('./initiiereLayertree')

module.exports = function (layerTitle, anz) {
  var layers = window.apf.olMap.map.getLayers(),
    layersArray = window.apf.olMap.map.getLayers().getArray(),
    topLayer

  layersArray.forEach(function (layer, index) {
    if (index >= anz) {
      if (layer.get('title') === layerTitle) {
        topLayer = layers.removeAt(index)
        layers.insertAt(index - anz, topLayer)
      }
    }
  })
  initiiereLayertree()
}
