'use strict'

var $ = require('jquery')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeText) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/insert/apflora/tabelle=apberuebersicht/feld=JbuJahr/wert=' + nodeText + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function () {
    var strukturtyp = 'jberUebersicht'
    var dsId = nodeText
    var beschriftung = 'neue Übersicht zu allen Arten'
    insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, dsId, beschriftung)
  }).fail(function () {
    melde('Fehler: Keine Übersicht zu allen Arten erstellt')
  })
}
