'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var zeigeTPopAufGmap = require('../gMap/zeigeTPop')
var getApiHost = require('../getApiHost')

module.exports = function (nodePopId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/popKarte/popId=' + erstelleIdAusDomAttributId(nodePopId)
  }).done(function (data) {
    if (data && data.length > 0) {
      zeigeTPopAufGmap(data)
    } else {
      melde('Es gibt keine Teilpopulation mit Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Teilpopulationen erhalten')
  })
}
