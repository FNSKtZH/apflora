'use strict'

var $ = require('jquery')
var stylePop = require('../../../../olMap/stylePop')

module.exports = function () {
  var layers = window.apf.olMap.map.getLayers().getArray()
  var layer = $('#olMapLayertreePopulationen').val()

  // style setzen
  layers[layer].setStyle(stylePop)
}
