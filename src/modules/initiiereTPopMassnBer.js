'use strict'

var $ = require('jquery'),
  initiiereAp = require('./initiiereAp'),
  initiierePop = require('./initiierePop'),
  initiiereTPop = require('./initiiereTPop'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  leereFelderVonFormular = require('./leereFelderVonFormular'),
  getApiHost = require('./getApiHost')

module.exports = function (apId, popId, tpopId, massnBerId) {
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
  if (!massnBerId && !window.localStorage.tpopmassnberId) {
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
  // massnBerId setzen
  window.localStorage.tpopmassnberId = window.localStorage.tpopmassnberId || massnBerId
  massnBerId = massnBerId || window.localStorage.tpopmassnberId

  // Felder zurücksetzen
  leereFelderVonFormular('tpopmassnber')

  // Daten für die pop aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpopmassnber/feld=TPopMassnBerId/wertNumber=' + massnBerId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // tpopmassnber bereitstellen
      window.apf.tpopmassnber = data

      // Felder mit Daten beliefern
      $('#TPopMassnBerJahr').val(data.TPopMassnBerJahr)
      $('#TPopMassnBerErfolgsbeurteilung' + data.TPopMassnBerErfolgsbeurteilung).prop('checked', true)
      $('#TPopMassnBerTxt').val(data.TPopMassnBerTxt)

      // Formulare blenden
      zeigeFormular('tpopmassnber')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&pop=' + popId + '&tpop=' + tpopId + '&tpopmassnber=' + massnBerId)

      // bei neuen Datensätzen Fokus steuern
      $('#TPopMassnBerJahr').focus()
    }
  }).fail(function () {
    melde('Fehler: keine Daten für den Massnahmen-Bericht erhalten')
  })
}
