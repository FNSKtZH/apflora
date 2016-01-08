'use strict'

var $ = require('jquery')

module.exports = function () {
  $(window.apf.olMap.map.getViewport()).on('mousemove', function (e) {
    var pixel
    var hit

    pixel = window.apf.olMap.map.getEventPixel(e.originalEvent)
    hit = window.apf.olMap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
      return true
    })
    if (hit) {
      $('#olMapDiv').css('cursor', 'pointer')
    } else {
      $('#olMapDiv').css('cursor', '')
    }
  })
}
