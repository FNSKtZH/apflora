'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var zeigeTPop = require('../olMap/zeigeTPop')
var getApiHost = require('../getApiHost')

module.exports = function (nodePopId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/tpopsKarte/popId=' + erstelleIdAusDomAttributId(nodePopId)
  }).done(function (data) {
    if (data.length > 0) {
      zeigeTPop(data)
    } else {
      melde('Es gibt keine Teilpopulation mit Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Teilpopulationen erhalten')
  })
}
