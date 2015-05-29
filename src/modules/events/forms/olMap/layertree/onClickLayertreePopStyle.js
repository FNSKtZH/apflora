/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  stylePop = require('../../../../olMap/stylePop')

module.exports = function () {
  var layers = window.apf.olMap.map.getLayers().getArray(),
    layer = $('#olMapLayertreePopulationen').val(),
    that = this

  // style setzen
  layers[layer].setStyle(stylePop)
}
