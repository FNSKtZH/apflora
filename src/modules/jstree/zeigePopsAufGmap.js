'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var zeigeTPop = require('../gMap/zeigeTPop')
var getApiHost = require('../getApiHost')

module.exports = function (nodeApId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apKarte/apId=' + erstelleIdAusDomAttributId(nodeApId)
  }).done(function (data) {
    if (data && data.length > 0) {
      zeigeTPop(data)
    } else {
      melde('Es gibt keine Teilpopulation mit Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Daten erhalten')
  })
}
