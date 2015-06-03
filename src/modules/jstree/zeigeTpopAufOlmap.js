'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  zeigeTPop = require('../olMap/zeigeTPop'),
  getApiHost = require('../getApiHost')

module.exports = function (nodeTpopId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/tpopKarte/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId)
  }).done(function (data) {
    if (data.length > 0) {
      zeigeTPop(data)
    } else {
      melde('Die Teilpopulation hat keine Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Teilpopulationen erhalten')
  })
}
