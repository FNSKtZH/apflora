'use strict'

var $ = require('jquery')
var exportiereLayer = require('../../../../olMap/exportiereLayer')

module.exports = function () {
  // layer holen
  var $layerDiv = $(this).parent().parent().siblings('input')
  var layerIndex = $layerDiv.val()
  var layer = window.apf.olMap.map.getLayers().getArray()[layerIndex]
  var $selectDiv = this
  var selectedValue = $selectDiv.options[$selectDiv.selectedIndex].value

  if (selectedValue !== 'leerwert') {
    exportiereLayer(layer, selectedValue)
    $selectDiv.value = 'leerwert'
    $(this).selectmenu('refresh')
  }
}
