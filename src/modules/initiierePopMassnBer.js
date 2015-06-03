'use strict'

var $ = require('jquery'),
  initiiereAp = require('./initiiereAp'),
  initiierePop = require('./initiierePop'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  leereFelderVonFormular = require('./leereFelderVonFormular'),
  getApiHost = require('./getApiHost')

module.exports = function (apId, popId, massnberId) {
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
  if (!massnberId && !window.localStorage.popmassnberId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiierePop(apId, popId)
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

  // massnberId setzen
  window.localStorage.popmassnberId = window.localStorage.popmassnberId || massnberId
  massnberId = massnberId || window.localStorage.popmassnberId

  // Felder zurücksetzen
  leereFelderVonFormular('popmassnber')

  // Daten für die pop aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/apflora/tabelle=popmassnber/feld=PopMassnBerId/wertNumber=' + massnberId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // popmassnber bereitstellen
      window.apf.popmassnber = data

      // Felder mit Daten beliefern
      $('#PopMassnBerJahr').val(data.PopMassnBerJahr)
      $('#PopMassnBerErfolgsbeurteilung' + data.PopMassnBerErfolgsbeurteilung).prop('checked', true)
      $('#PopMassnBerTxt').val(data.PopMassnBerTxt)

      // Formulare blenden
      zeigeFormular('popmassnber')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&pop=' + popId + '&popmassnber=' + massnberId)

      // bei neuen Datensätzen Fokus steuern
      $('#PopMassnBerJahr').focus()
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für den Massnahmenbericht erhalten')
  })
}
