'use strict'

var $ = require('jquery'),
  initiiereAp = require('./initiiereAp'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  leereFelderVonFormular = require('./leereFelderVonFormular'),
  getApiHost = require('./getApiHost')

module.exports = function (apId, uebId) {
  // prüfen, ob voraussetzungen gegeben sind
  if (!apId && !window.localStorage.apId) {
    // Anwendung neu initiieren
    window.apf.initiiereApp()
    return
  }
  if (!uebId && !window.localStorage.jberUebersichtId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereAp(apId)
    return
  }

  // apId setzen
  window.localStorage.apId = window.localStorage.apId || apId
  apId = apId || window.localStorage.apId

  // uebId setzen
  window.localStorage.jberUebersichtId = window.localStorage.jberUebersichtId || uebId
  uebId = uebId || window.localStorage.jberUebersichtId

  var $JbuJahr = $('#JbuJahr')

  // Felder zurücksetzen
  leereFelderVonFormular('jberUebersicht')

  // Daten für die jberUebersicht aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=apberuebersicht/feld=JbuJahr/wertNumber=' + uebId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // jberUebersicht bereitstellen
      window.apf.jberUebersicht = data

      // Felder mit Daten beliefern
      $JbuJahr.val(data.JbuJahr)
      $('#JbuBemerkungen').val(data.JbuBemerkungen)

      // Formulare blenden
      zeigeFormular('jberUebersicht')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&jberUebersicht=' + uebId)

      // bei neuen Datensätzen Fokus steuern
      if (!$JbuJahr.val()) {
        $JbuJahr.focus()
      }
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für die Übersicht erhalten')
  })
}
