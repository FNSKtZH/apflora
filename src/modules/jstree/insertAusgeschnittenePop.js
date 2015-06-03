'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  erstelleTree = require('./erstelleTree'),
  getApiHost = require('../getApiHost')

module.exports = function (nodeApId) {
  var apId = erstelleIdAusDomAttributId(nodeApId)

  $.ajax({
    type: 'post',
    url: getApiHost() + '/api/v1/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=' + window.apf.popId + '/feld=ApArtId/wert=' + apId + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function () {
    // Baum neu aufbauen
    $.when(erstelleTree(apId)).then(function () {
      // dann den eingefügten Node wählen
      $('#tree').jstree('select_node', "[typ='pop']#" + window.apf.popId)
    })
    // einfügen soll nicht mehr angezeigt werden
    delete window.apf.popZumVerschiebenGemerkt
    // nicht mehr benötigte Variablen entfernen
    delete window.apf.popBezeichnung
    delete window.apf.popId
  }).fail(function () {
    melde('Fehler: Die Population wurde nicht verschoben')
  })
}
