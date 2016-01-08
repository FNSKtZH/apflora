'use strict'

var $ = require('jquery')
var initiiereAp = require('./initiiereAp')
var initiierePop = require('./initiierePop')
var initiiereTPop = require('./initiiereTPop')
var zeigeFormular = require('./zeigeFormular')
var melde = require('./melde')
var leereFelderVonFormular = require('./leereFelderVonFormular')
var getApiHost = require('./getApiHost')

module.exports = function (apId, popId, tpopId, tpopBerId) {
  // prüfen, ob voraussetzungen gegeben sind
  if (!apId && !window.localStorage.apId) {
    // Anwendung neu initiieren
    window.apf.initiiereApp()
    return
  }
  if (!popId && !window.localStorage.popId && !window.apf.pop && (window.apf.pop && !window.apf.pop.PopId)) {
    // es fehlen benötigte Daten > zwei Ebenen höher
    initiiereAp(apId)
    return
  }
  if (!tpopId && !window.localStorage.tpopId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiierePop(apId, popId)
    return
  }
  if (!tpopBerId && !window.localStorage.tpopberId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereTPop(apId, popId, tpopId)
    return
  }

  // apId setzen
  window.localStorage.apId = window.localStorage.apId || apId
  apId = apId || window.localStorage.apId
  // popId setzen
  if (!window.localStorage.popId) {
    if (!window.apf.pop || !window.apf.pop.PopId) {
      window.localStorage.popId = popId
    } else {
      window.localStorage.popId = window.apf.pop.PopId
    }
  }
  if (!popId) {
    if (!window.apf.pop || !window.apf.pop.PopId) {
      popId = window.localStorage.popId
    } else {
      popId = window.apf.pop.PopId
    }
  }
  // tpopId setzen
  window.localStorage.tpopId = window.localStorage.tpopId || tpopId
  tpopId = tpopId || window.localStorage.tpopId
  // tpopBerId setzen
  window.localStorage.tpopberId = window.localStorage.tpopberId || tpopBerId
  tpopBerId = tpopBerId || window.localStorage.tpopberId

  // Felder zurücksetzen
  leereFelderVonFormular('tpopber')

  // Daten für die tpopber aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpopber/feld=TPopBerId/wertNumber=' + tpopBerId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // tpopber bereitstellen
      window.apf.tpopber = data

      // Felder mit Daten beliefern
      $('#TPopBerJahr').val(data.TPopBerJahr)
      $('#TPopBerEntwicklung' + data.TPopBerEntwicklung).prop('checked', true)
      $('#TPopBerTxt').val(data.TPopBerTxt)

      // Formulare blenden
      zeigeFormular('tpopber')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&pop=' + popId + '&tpop=' + tpopId + '&tpopber=' + tpopBerId)

      // bei neuen Datensätzen Fokus steuern
      $('#TPopBerJahr').focus()
    }
  }).fail(function () {
    melde('Fehler: keine Daten für den Teilpopulations-Bericht erhalten')
  })
}
