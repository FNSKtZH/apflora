'use strict'

var _ = require('underscore')

module.exports = function () {
  var layersArray = window.apf.olMap.map.getLayers().getArray()
  var layers = _.filter(layersArray, function (layer) {
    return layer.get('title')
  })
  return layers || []
}
