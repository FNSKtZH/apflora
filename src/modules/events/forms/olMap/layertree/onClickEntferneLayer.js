'use strict'

var $ = require('jquery')
var entferneLayerNachName = require('../../../../olMap/entferneLayerNachName')
var initiiereLayertree = require('../../../../olMap/initiiereLayertree')
var melde = require('../../../../melde')

module.exports = function () {
  // layer holen
  var layerDiv = $(this).parent().parent().siblings('input')
  var layerIndex = layerDiv.val()
  var layer = window.apf.olMap.map.getLayers().getArray()[layerIndex]
  var layerName = layer.get('title')

  if (layerName) {
    // open a dialog
    $('#entferneEigeneEbeneDialog').dialog({
      resizable: false,
      height: 'auto',
      width: 400,
      modal: true,
      buttons: {
        'ja, entfernen!': function () {
          $(this).dialog('close')
          entferneLayerNachName(layerName)
          initiiereLayertree('Eigene Ebenen')
        },
        'abbrechen': function () {
          $(this).dialog('close')
        }
      }
    })
  } else {
    melde('Fehler: Layer nicht entfernt')
  }
}
