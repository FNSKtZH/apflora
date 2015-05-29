'use strict'

var _ = require('underscore'),
  $ = require('jquery')

module.exports = function () {
  var overlays = window.apf.olMap.map.getOverlays().getArray(),
    zuLoeschendeOverlays = []

  _.each(overlays, function (overlay) {
    if (overlay.get('typ') === 'popup') {
      zuLoeschendeOverlays.push(overlay)
    }
  })

  _.each(zuLoeschendeOverlays, function (overlay) {
    window.apf.olMap.map.removeOverlay(overlay)
  })

  // alle qtips entfernen
  $('.qtip').each(function () {
    $(this).qtip('destroy', true)
  })
}
