'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var erstelleLabelFuerFeldkontrolle = require('../erstelleLabelFuerFeldkontrolle')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
  var herkunftKontrId = erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr('id'))
  // und an die DB schicken
  $.ajax({
    type: 'post',
    url: getApiHost() + '/tpopkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopKontrId=' + herkunftKontrId + '/user=' + encodeURIComponent(window.sessionStorage.user)
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
