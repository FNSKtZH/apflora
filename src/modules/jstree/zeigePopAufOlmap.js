/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  zeigePop = require('../olMap/zeigePop')

module.exports = function (nodePopId) {
  $.ajax({
    type: 'get',
    url: 'api/v1/popChKarte/popId=' + erstelleIdAusDomAttributId(nodePopId)
  }).done(function (data) {
    if (data && data.length > 0) {
      zeigePop(data)
    } else {
      melde('Die Population hat keine Koordinaten', 'Aktion abgebrochen')
    }
  }).fail(function () {
    melde('Fehler: Keine Populationen erhalten')
  })
}
