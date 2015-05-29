/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
  insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
  melde = require('../melde'),
  erstelleLabelFuerFeldkontrolle = require('../erstelleLabelFuerFeldkontrolle')

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
  var herkunftKontrId = erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr('id'))
  // und an die DB schicken
  $.ajax({
    type: 'post',
    url: 'api/v1/tpopkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopKontrId=' + herkunftKontrId + '/user=' + encodeURIComponent(sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'tpopfeldkontr',
      beschriftung = erstelleLabelFuerFeldkontrolle(window.apf.tpopfeldkontrObjektKopiert.TPopKontrJahr, window.apf.tpopfeldkontrObjektKopiert.TPopKontrTyp)
    if ($(aktiverNode).attr('id') === nodeTpopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Die Feldkontrolle wurde nicht erstellt')
  })
}
