/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')

module.exports = function (aktiverNode) {
  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) { return }
  window.apf.tpopNodeKopiert = aktiverNode
  // Daten des Objekts holen
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=tpop/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
  }).done(function (data) {
    window.apf.tpopObjektKopiert = data[0]
  }).fail(function () {
    melde('Fehler: Die Teilpopulation wurde nicht kopiert')
  })
}
