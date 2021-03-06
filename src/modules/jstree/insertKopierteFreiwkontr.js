'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
  // und an die DB schicken
  $.ajax({
    type: 'post',
    url: getApiHost() + '/tpopkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontrNodeKopiert).attr('id')) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'tpopfreiwkontr'
    var beschriftung = window.apf.tpopfreiwkontrObjektKopiert.TPopKontrJahr.toString()
    if ($(aktiverNode).attr('id') === nodeTpopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt')
  })
}
