'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  zeigeBeob = require('../gMap/zeigeBeob'),
  getApiHost = require('../getApiHost')

module.exports = function (nodeApId, nodeBeobId) {
  var apId = nodeApId ? erstelleIdAusDomAttributId(nodeApId) : '',
    beobId = nodeBeobId ? erstelleIdAusDomAttributId(nodeBeobId) : ''

  $.ajax({
    type: 'get',
    url: getApiHost() + '/beobKarte/apId=' + apId + '/tpopId=/beobId=' + beobId + '/nichtZuzuordnen='
  }).done(function (data) {
    if (data.length > 0) {
      zeigeBeob(data)
    } else {
      melde('Es gibt keine Beobachtung mit Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Daten erhalten')
  })
}
