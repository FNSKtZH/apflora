'use strict'

var $ = require('jquery'),
  initiiereAp = require('./initiiereAp'),
  initiierePop = require('./initiierePop'),
  zeigeFormular = require('./zeigeFormular'),
  leereFelderVonFormular = require('./leereFelderVonFormular'),
  getApiHost = require('./getApiHost')

module.exports = function (apId, popId, popberId) {
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
  if (!popberId && !window.localStorage.popberId) {
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

  // popberId setzen
  window.localStorage.popberId = window.localStorage.popberId || popberId
  popberId = popberId || window.localStorage.popberId

  // Felder zurücksetzen
  leereFelderVonFormular('popber')

  // Daten für die popber aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/apflora/tabelle=popber/feld=PopBerId/wertNumber=' + popberId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // popber bereitstellen
      window.apf.popber = data

      // Felder mit Daten beliefern
      $('#PopBerJahr').val(data.PopBerJahr)
      $('#PopBerEntwicklung' + data.PopBerEntwicklung).prop('checked', true)
      $('#PopBerTxt').val(data.PopBerTxt)

      // Formulare blenden
      zeigeFormular('popber')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&pop=' + popId + '&popber=' + popberId)

      // bei neuen Datensätzen Fokus steuern
      $('#PopBerJahr').focus()
    }
  })
}
