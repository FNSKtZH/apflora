/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var _ = require('underscore'),
  ol = require('ol')

module.exports = function () {
  var layersArray,
    layers

  layersArray = window.apf.olMap.map.getLayers().getArray()
  layers = _.filter(layersArray, function (layer) {
    return layer.get('title')
  })
  return layers || []
}
