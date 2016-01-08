'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var zeigeBeobUndTPop = require('../gMap/zeigeBeobUndTPop')
var zeigeBeob = require('../gMap/zeigeBeob')
var getApiHost = require('../getApiHost')

module.exports = function (nodeBeobId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId(nodeBeobId) + '/nichtZuzuordnen='
  }).done(function (beob) {
    if (beob && beob[0]) {
      // Array belassen -zeigeBeob benötigt einen Array
      $.ajax({
        type: 'get',
        url: getApiHost() + '/apKarte/apId=' + window.localStorage.apId
      }).done(function (tpop) {
        if (tpop && tpop.length > 0) {
          zeigeBeobUndTPop(beob, tpop)
        } else {
          zeigeBeob(beob)
        }
      })
    } else {
      melde('Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Daten erhalten')
  })
}
