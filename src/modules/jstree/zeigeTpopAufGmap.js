'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  zeigeTPop = require('../gMap/zeigeTPop'),
  getApiHost = require('../getApiHost')

module.exports = function (nodeTpopId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/tpopKarte/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId)
  }).done(function (data) {
    if (data.length > 0) {
      zeigeTPop(data)
    } else {
      melde('Die Teilpopulation hat keine Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Daten erhalten')
  })
}
