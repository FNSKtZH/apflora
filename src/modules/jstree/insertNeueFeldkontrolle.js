'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
  // window.apf.ap.ApBearb is standard for TPopKontrBearb
  var felder = {}
  felder.TPopId = erstelleIdAusDomAttributId(nodeTpopId)
  felder.TPopKontrBearb = window.apf.ap.ApBearb
  felder.MutWann = new Date().toISOString()
  felder.MutWer = encodeURIComponent(window.sessionStorage.user)
  $.ajax({
    type: 'post',
    url: getApiHost() + '/insertMultiple/apflora/tabelle=tpopkontr/felder=' + JSON.stringify(felder)
  }).done(function (id) {
    var strukturtyp = 'tpopfeldkontr'
    var beschriftung = 'neue Feldkontrolle'
    if ($(aktiverNode).attr('id') === nodeTpopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Keine neue Feldkontrolle erstellt')
  })
}
