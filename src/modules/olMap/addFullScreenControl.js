'use strict'

var $ = require('jquery')
var ol = require('ol')

module.exports = function () {
  var myFullScreenControl = new ol.control.FullScreen()
  window.apf.olMap.map.addControl(myFullScreenControl)
  // auf Deutsch beschriften
  $('#olMapDiv')
    .find('.ol-full-screen')
    .find('span[role="tooltip"]')
    .html('Vollbild wechseln')
}
