'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeApId) {
  // window.apf.ap.ApBearb is standard for JBerBearb
  var felder = {}
  felder.ApArtId = erstelleIdAusDomAttributId(nodeApId)
  felder.JBerBearb = window.apf.ap.ApBearb
  felder.MutWann = new Date().toISOString()
  felder.MutWer = encodeURIComponent(window.sessionStorage.user)
  $.ajax({
    type: 'post',
    url: getApiHost() + '/insertMultiple/apflora/tabelle=apber/felder=' + JSON.stringify(felder)
  }).done(function (id) {
    var strukturtyp = 'jber'
    var beschriftung = 'neuer AP-Bericht'
    if ($(aktiverNode).attr('id') === nodeApId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Keinen neuen AP-Bericht erstellt')
  })
}
