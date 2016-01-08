'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode) {
  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  window.apf.popNodeKopiert = aktiverNode
  // Daten des Objekts holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=pop/feld=PopId/wertNumber=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
  }).done(function (data) {
    window.apf.popObjektKopiert = data[0]
  }).fail(function () {
    melde('Fehler: Die Population wurde nicht kopiert')
  })
}
