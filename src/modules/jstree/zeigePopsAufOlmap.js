'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var zeigePop = require('../olMap/zeigePop')
var getApiHost = require('../getApiHost')

module.exports = function (nodeApId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/popsChKarte/apId=' + erstelleIdAusDomAttributId(nodeApId)
  }).done(function (data) {
    if (data && data.length > 0) {
      zeigePop(data)
    } else {
      melde('Die Population hat keine Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Daten erhalten')
  })
}
