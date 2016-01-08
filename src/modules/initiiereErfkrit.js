'use strict'

var $ = require('jquery')
var initiiereAp = require('./initiiereAp')
var limiter = require('../lib/limiter')
var zeigeFormular = require('./zeigeFormular')
var melde = require('./melde')
var leereFelderVonFormular = require('./leereFelderVonFormular')
var getApiHost = require('./getApiHost')

module.exports = function (apId, erfkritId) {
  // prüfen, ob voraussetzungen gegeben sind
  if (!apId && !window.localStorage.apId) {
    // Anwendung neu initiieren
    window.apf.initiiereApp()
    return
  }
  if (!erfkritId && !window.localStorage.erfkritId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereAp(apId)
    return
  }

  // apId setzen
  window.localStorage.apId = window.localStorage.apId || apId
  apId = apId || window.localStorage.apId

  // erfkritId setzen
  window.localStorage.erfkritId = window.localStorage.erfkritId || erfkritId
  erfkritId = erfkritId || window.localStorage.erfkritId

  var $ErfkritErreichungsgrad = $('#ErfkritErreichungsgrad')

  // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
  limiter($)

  // Felder zurücksetzen
  leereFelderVonFormular('erfkrit')

  // Daten für die erfkrit aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=erfkrit/feld=ErfkritId/wertString=' + erfkritId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // erfkrit bereitstellen
      window.apf.erfkrit = data

      // Felder mit Daten beliefern
      $('#ErfkritErreichungsgrad' + data.ErfkritErreichungsgrad).prop('checked', true)
      $('#ErfkritTxt')
        .val(data.ErfkritTxt)
        .limiter(255, $('#ErfkritTxt_limit'))

      // Formulare blenden
      zeigeFormular('erfkrit')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&erfkrit=' + erfkritId)

      // bei neuen Datensätzen Fokus steuern
      if (!$ErfkritErreichungsgrad.val()) {
        $ErfkritErreichungsgrad.focus()
      }
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für das Erfolgskriterium erhalten')
  })
}
