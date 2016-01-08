'use strict'

var initiiereLayertree = require('./initiiereLayertree')

module.exports = function (layerTitle) {
  var layers = window.apf.olMap.map.getLayers(),
    layersArray = window.apf.olMap.map.getLayers().getArray(),
    topLayer

  layersArray.forEach(function (layer, index) {
    if (index > 0) {
      if (layer.get('title') === layerTitle) {
        topLayer = layers.removeAt(index)
        layers.insertAt(index - 1, topLayer)
      }
    }
  })
  initiiereLayertree()
}
