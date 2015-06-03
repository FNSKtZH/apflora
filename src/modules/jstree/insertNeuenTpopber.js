'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
  insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
  melde = require('../melde'),
  getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/api/v1/insert/apflora/tabelle=tpopber/feld=TPopId/wert=' + erstelleIdAusDomAttributId(nodeTpopId) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'tpopber',
      beschriftung = 'neuer Teilpopulations-Bericht'
    if ($(aktiverNode).attr('id') === nodeTpopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Keinen neuen Teilpopulations-Bericht erstellt')
  })
}
