'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  verorteTPop = require('../olMap/verorteTPop'),
  getApiHost = require('../getApiHost')

module.exports = function (nodeTpopId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/apflora/tabelle=tpop/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId(nodeTpopId)
  }).done(function (data) {
    verorteTPop(data[0])
  }).fail(function () {
    melde('Fehler: Keine Teilpopulation erhalten')
  })
}
