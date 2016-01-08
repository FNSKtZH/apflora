'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var zeigeTPop = require('../gMap/zeigeTPop')
var getApiHost = require('../getApiHost')

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
    melde('Fehler: Keine Daten erhalten')
  })
}
