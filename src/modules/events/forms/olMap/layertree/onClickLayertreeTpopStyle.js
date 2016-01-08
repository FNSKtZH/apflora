'use strict'

var $ = require('jquery')
var styleTPop = require('../../../../olMap/styleTPop')

module.exports = function () {
  var layers = window.apf.olMap.map.getLayers().getArray(),
    layer = $('#olMapLayertreeTeilpopulationen').val()

  // style setzen
  layers[layer].setStyle(styleTPop)
}
