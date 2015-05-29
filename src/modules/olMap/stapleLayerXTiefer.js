/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var _ = require('underscore'),
  initiiereLayertree = require('./initiiereLayertree')

module.exports = function (layerTitle, anz) {
  var layers = window.apf.olMap.map.getLayers(),
    layersArray = window.apf.olMap.map.getLayers().getArray(),
    topLayer

  _.each(layersArray, function (layer, index) {
    if (index >= anz) {
      if (layer.get('title') === layerTitle) {
        topLayer = layers.removeAt(index)
        layers.insertAt(index - anz, topLayer)
      }
    }
  })
  initiiereLayertree()
}
