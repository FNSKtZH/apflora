'use strict'

var $ = require('jquery')
var frageNameFuerEbene = require('../../../../olMap/frageNameFuerEbene')

module.exports = function () {
  // layer holen
  var layerDiv = $(this).parent().parent().siblings('input')
  var layerIndex = layerDiv.val()
  var layer = window.apf.olMap.map.getLayers().getArray()[layerIndex]

  frageNameFuerEbene(layer)
}
