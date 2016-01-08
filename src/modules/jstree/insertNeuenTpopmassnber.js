'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/insert/apflora/tabelle=tpopmassnber/feld=TPopId/wert=' + erstelleIdAusDomAttributId(nodeTpopId) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'tpopmassnber'
    var beschriftung = 'neuer Massnahmen-Bericht'
    if ($(aktiverNode).attr('id') === nodeTpopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Keinen neuen Massnahmen-Bericht erstellt')
  })
}
