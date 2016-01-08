'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeApId) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/insert/apflora/tabelle=pop/feld=ApArtId/wert=' + erstelleIdAusDomAttributId(nodeApId) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'pop'
    var beschriftung = 'neue Population'
    if ($(aktiverNode).attr('id') === nodeApId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Keine neue Population erstellt')
  })
}
