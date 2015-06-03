'use strict'

var $ = require('jquery'),
  initiiereAp = require('./initiiereAp'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  leereFelderVonFormular = require('./leereFelderVonFormular'),
  getApiHost = require('./getApiHost')

module.exports = function (apId, apZielId) {
  // prüfen, ob voraussetzungen gegeben sind
  if (!apId && !window.localStorage.apId) {
    // Anwendung neu initiieren
    window.apf.initiiereApp()
    return
  }
  if (!apZielId && !window.localStorage.apzielId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereAp(apId)
    return
  }

  // apId setzen
  window.localStorage.apId = window.localStorage.apId || apId
  apId = apId || window.localStorage.apId

  // apZielId setzen
  if (!window.localStorage.apzielId) {
    window.localStorage.apzielId = apZielId
  }
  if (!apZielId) {
    apZielId = window.localStorage.apzielId
  }

  var $ZielJahr = $('#ZielJahr')

  // Felder zurücksetzen
  leereFelderVonFormular('apziel')

  // Daten für die apziel aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=ziel/feld=ZielId/wertNumber=' + apZielId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]
      // apziel bereitstellen
      window.apf.apziel = data
      // Felder mit Daten beliefern
      $ZielJahr.val(data.ZielJahr)
      $('#ZielTyp' + data.ZielTyp).prop('checked', true)
      $('#ZielBezeichnung').val(data.ZielBezeichnung)
      // Formulare blenden
      zeigeFormular('apziel')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&apziel=' + apZielId)
      // bei neuen Datensätzen Fokus steuern
      if (!$ZielJahr.val()) {
        $ZielJahr.focus()
      }
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für das AP-Ziel erhalten')
  })
}
