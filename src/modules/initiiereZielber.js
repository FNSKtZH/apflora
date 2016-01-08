'use strict'

var $ = require('jquery')
var initiiereAp = require('./initiiereAp')
var initiiereApziel = require('./initiiereApziel')
var zeigeFormular = require('./zeigeFormular')
var melde = require('./melde')
var leereFelderVonFormular = require('./leereFelderVonFormular')
var getApiHost = require('./getApiHost')

module.exports = function (apId, apZielId, zielberId) {
  var $ZielBerJahr = $('#ZielBerJahr')

  // prüfen, ob voraussetzungen gegeben sind
  if (!apId && !window.localStorage.apId) {
    // Anwendung neu initiieren
    window.apf.initiiereApp()
    return
  }
  if (!apZielId && !window.localStorage.apzielId) {
    // es fehlen benötigte Daten > zwei Ebenen höher
    initiiereAp(apId)
    return
  }
  if (!zielberId && !window.localStorage.zielberId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereApziel(apId, apZielId)
    return
  }

  // apId setzen
  window.localStorage.apId = window.localStorage.apId || apId
  apId = apId || window.localStorage.apId

  // apZielId setzen
  window.localStorage.apzielId = window.localStorage.apzielId || apZielId
  apZielId = apZielId || window.localStorage.apzielId

  // zielberId setzen
  window.localStorage.zielberId = window.localStorage.zielberId || zielberId
  zielberId = zielberId || window.localStorage.zielberId

  // Felder zurücksetzen
  leereFelderVonFormular('zielber')

  // Daten für die zielber aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=zielber/feld=ZielBerId/wertString=' + zielberId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // zeilber bereitstellen
      window.apf.zielber = data

      // Felder mit Daten beliefern
      $ZielBerJahr.val(data.ZielBerJahr)
      $('#ZielBerErreichung').val(data.ZielBerErreichung)
      $('#ZielBerTxt').val(data.ZielBerTxt)

      // Formulare blenden
      zeigeFormular('zielber')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&apziel=' + apZielId + '&zielber=' + zielberId)

      // bei neuen Datensätzen Fokus steuern
      if (!$ZielBerJahr.val()) {
        $ZielBerJahr.focus()
      }
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für den Zielbericht erhalten')
  })
}
