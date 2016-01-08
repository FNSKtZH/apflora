'use strict'

var $ = require('jquery')

module.exports = function () {
  var overlays = window.apf.olMap.map.getOverlays().getArray()
  var zuLoeschendeOverlays = []

  overlays.forEach(function (overlay) {
    if (overlay.get('typ') === 'popup') {
      zuLoeschendeOverlays.push(overlay)
    }
  })

  zuLoeschendeOverlays.forEach(function (overlay) {
    window.apf.olMap.map.removeOverlay(overlay)
  })

  // alle qtips entfernen
  $('.qtip').each(function () {
    $(this).qtip('destroy', true)
  })
}
