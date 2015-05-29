/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  limiter = require('../lib/limiter'),
  initiiereAp = require('./initiiereAp'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  leereFelderVonFormular = require('./leereFelderVonFormular')

module.exports = function (apId, popId, ohneZuZeigen) {
  var $PopName = $('#PopName'),
    $PopNr = $('#PopNr')

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

  // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
  limiter($)

  // Felder zurücksetzen
  leereFelderVonFormular('pop')

  // Daten für die pop aus der DB holen
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=pop/feld=PopId/wertNumber=' + popId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // data.TPopHerkunft 200 und 210 müssen in derselben Schaltfläche dargestellt werden
      // die Schaltfläche hat die id 200
      // daher muss 210 zu 200 geändert werden
      var popherkunftCheckboxwert = data.PopHerkunft === 210 ? 200 : data.PopHerkunft

      // pop bereitstellen
      window.apf.pop = data

      // Felder mit Daten beliefern
      $('#PopHerkunft' + popherkunftCheckboxwert).prop('checked', true)
      if (data.PopHerkunftUnklar === 1) {
        $('#PopHerkunftUnklar').prop('checked', true)
      } else {
        $('#PopHerkunftUnklar').prop('checked', false)
      }
      $('#PopHerkunftUnklarBegruendung')
        .val(data.PopHerkunftUnklarBegruendung)
        .limiter(255, $('#PopHerkunftUnklarBegruendung_limit'))
      $PopName
        .val(data.PopName)
        .limiter(150, $('#PopName_limit'))
      $PopNr.val(data.PopNr)
      $('#PopBekanntSeit').val(data.PopBekanntSeit)
      $('#PopXKoord').val(data.PopXKoord)
      $('#PopYKoord').val(data.PopYKoord)

      // Formulare blenden
      // nur, wenn ohneZuZeigen nicht true ist (true, um in dialog anzuzeigen)
      if (!ohneZuZeigen) {
        zeigeFormular('pop')
        window.history.pushState(null, null, 'index.html?ap=' + apId + '&pop=' + popId)

        // bei neuen Datensätzen Fokus steuern
        if (!$PopName.val()) {
          $PopNr.focus()
        }
      }
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für die Population erhalten')
  })
}
