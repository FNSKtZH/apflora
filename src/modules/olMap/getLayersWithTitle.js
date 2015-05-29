'use strict'

var _ = require('underscore')

module.exports = function () {
  var layersArray,
    layers

  layersArray = window.apf.olMap.map.getLayers().getArray()
  layers = _.filter(layersArray, function (layer) {
    return layer.get('title')
  })
  return layers || []
}
