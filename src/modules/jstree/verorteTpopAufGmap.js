'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var verorteTPop = require('../gMap/verorteTPop')
var getApiHost = require('../getApiHost')

module.exports = function (nodeTpopId) {
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpop/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId(nodeTpopId)
  }).done(function (data) {
    verorteTPop(data[0])
  }).fail(function () {
    melde('Fehler: Keine Daten erhalten')
  })
}
