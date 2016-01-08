'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodePopId) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/insert/apflora/tabelle=popber/feld=PopId/wert=' + erstelleIdAusDomAttributId(nodePopId) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'popber'
    var beschriftung = 'neuer Populations-Bericht'
    if ($(aktiverNode).attr('id') === nodePopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Keinen neuen Populations-Bericht erstellt')
  })
}
