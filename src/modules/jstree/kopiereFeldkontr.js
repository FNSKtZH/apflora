'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode) {
  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  window.apf.tpopfeldkontrNodeKopiert = aktiverNode
  // Daten des Objekts holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpopkontr/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr('id'))
  }).done(function (data) {
    window.apf.tpopfeldkontrObjektKopiert = data[0]
  }).fail(function () {
    melde('Fehler: Die Feldkontrolle wurde nicht kopiert')
  })
}
