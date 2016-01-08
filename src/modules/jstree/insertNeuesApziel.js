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
    url: getApiHost() + '/insert/apflora/tabelle=ziel/feld=ApArtId/wert=' + erstelleIdAusDomAttributId(nodeApId) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'apziel'
    var beschriftung = 'neues Ziel'

    // mitteilen, dass von ganz oben ein apziel erstellt wird und daher noch ein Zwischenordner erstellt werden muss
    window.localStorage.apzielVonOrdnerApziel = true
    // zur Sicherheit den anderen Zeiger löschen
    delete window.localStorage.apzielVonApzieljahr
    if ($(aktiverNode).attr('typ') === 'apOrdnerApziel') {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else if ($(aktiverNode).attr('typ') === 'apzieljahr') {
      insertNeuenNodeEineHierarchiestufeTiefer(parentNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Kein neues AP-Ziel erstellt')
  })
}
