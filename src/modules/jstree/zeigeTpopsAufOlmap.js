'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  zeigeTPop = require('../olMap/zeigeTPop'),
  getApiHost = require('../getApiHost')

module.exports = function (nodePopId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/tpopsKarte/popId=' + erstelleIdAusDomAttributId(nodePopId)
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
