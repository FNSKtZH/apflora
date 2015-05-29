'use strict'

var $ = require('jquery'),
  entferneLayerNachName = require('./entferneLayerNachName')

module.exports = function () {
  entferneLayerNachName('messen')
  window.apf.olMap.map.removeInteraction(window.apf.olMap.drawMeasure)
  delete window.apf.olMap.drawMeasure
  $('#olMapErgebnisMessung').text('')
  $(window.apf.olMap.map.getViewport()).off('mousemove')
}
