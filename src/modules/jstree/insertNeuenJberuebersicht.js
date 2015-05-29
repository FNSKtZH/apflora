'use strict'

var $ = require('jquery'),
  insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
  melde = require('../melde')

module.exports = function (aktiverNode, parentNode, nodeText) {
  $.ajax({
    type: 'post',
    url: 'api/v1/insert/apflora/tabelle=apberuebersicht/feld=JbuJahr/wert=' + nodeText + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function () {
    var strukturtyp = 'jberUebersicht',
      dsId = nodeText,
      beschriftung = 'neue Übersicht zu allen Arten'
    insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, dsId, beschriftung)
  }).fail(function () {
    melde('Fehler: Keine Übersicht zu allen Arten erstellt')
  })
}
