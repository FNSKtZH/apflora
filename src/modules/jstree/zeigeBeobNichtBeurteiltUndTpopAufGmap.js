'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  zeigeBeobUndTPop = require('../gMap/zeigeBeobUndTPop'),
  zeigeBeob = require('../gMap/zeigeBeob'),
  getApiHost = require('../getApiHost')

module.exports = function (nodeApId, nodeBeobId) {
  var apId,
    beobId

  apId = nodeApId ? erstelleIdAusDomAttributId(nodeApId) : ''
  beobId = nodeBeobId ? erstelleIdAusDomAttributId(nodeBeobId) : ''

  $.ajax({
    type: 'get',
    url: getApiHost() + '/beobKarte/apId=' + apId + '/tpopId=/beobId=' + beobId + '/nichtZuzuordnen='
  }).done(function (beob) {
    if (beob.length > 0) {
      $.ajax({
        type: 'get',
        url: getApiHost() + '/apKarte/apId=' + apId
      }).done(function (tpop) {
        if (tpop && tpop.length > 0) {
          zeigeBeobUndTPop(beob, tpop)
        } else {
          zeigeBeob(beob)
        }
      })
    } else {
      melde('Es gibt keine Beobachtung mit Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Daten erhalten')
  })
}
