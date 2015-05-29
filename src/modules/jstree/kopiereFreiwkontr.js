'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')

module.exports = function (aktiverNode) {
  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) { return }
  window.apf.tpopfreiwkontrNodeKopiert = aktiverNode
  // Daten des Objekts holen
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=tpopkontr/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontrNodeKopiert).attr('id'))
  }).done(function (data) {
    window.apf.tpopfreiwkontrObjektKopiert = data[0]
  }).fail(function () {
    melde('Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert')
  })
}
