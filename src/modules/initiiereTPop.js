'use strict'

var $ = require('jquery'),
  limiter = require('../lib/limiter'),
  initiiereAp = require('./initiiereAp'),
  initiierePop = require('./initiierePop'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  leereFelderVonFormular = require('./leereFelderVonFormular')

module.exports = function (apId, popId, tpopId, ohneZuZeigen) {
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

  // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
  limiter($)

  var $TPopFlurname = $('#TPopFlurname')

  // Felder zurücksetzen
  leereFelderVonFormular('tpop')

  // Daten für die pop aus der DB holen
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=tpop/feld=TPopId/wertNumber=' + tpopId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // data.TPopHerkunft 200 und 210 müssen in derselben Schaltfläche dargestellt werden
      // die Schaltfläche hat die id 200
      // daher muss 210 zu 200 geändert werden
      var tpopherkunftCheckboxwert = data.TPopHerkunft === 210 ? 200 : data.TPopHerkunft

      // tpop bereitstellen
      window.apf.tpop = data

      // Felder mit Daten beliefern
      $TPopFlurname
        .val(data.TPopFlurname)
        .limiter(255, $('#TPopFlurname_limit'))
      $('#TPopNr').val(data.TPopNr)
      $('#TPopHerkunft' + tpopherkunftCheckboxwert).prop('checked', true)
      if (data.TPopHerkunftUnklar === 1) {
        $('#TPopHerkunftUnklar').prop('checked', true)
      } else {
        $('#TPopHerkunftUnklar').prop('checked', false)
      }
      $('#TPopHerkunftUnklarBegruendung')
        .val(data.TPopHerkunftUnklarBegruendung)
        .limiter(255, $('#TPopHerkunftUnklarBegruendung_limit'))
      $('#TPopApBerichtRelevant' + data.TPopApBerichtRelevant).prop('checked', true)
      $('#TPopBekanntSeit').val(data.TPopBekanntSeit)
      $('#TPopGemeinde')
        .val(data.TPopGemeinde)
        .limiter(255, $('#TPopGemeinde_limit'))
      $('#TPopXKoord').val(data.TPopXKoord)
      $('#TPopYKoord').val(data.TPopYKoord)
      $('#TPopRadius').val(data.TPopRadius)
      $('#TPopHoehe').val(data.TPopHoehe)
      $('#TPopExposition')
        .val(data.TPopExposition)
        .limiter(50, $('#TPopExposition_limit'))
      $('#TPopKlima')
        .val(data.TPopKlima)
        .limiter(50, $('#TPopKlima_limit'))
      $('#TPopNeigung')
        .val(data.TPopNeigung)
        .limiter(50, $('#TPopNeigung_limit'))
      $('#TPopBeschr')
        .val(data.TPopBeschr)
        .limiter(255, $('#TPopBeschr_limit'))
      $('#TPopKatNr')
        .val(data.TPopKatNr)
        .limiter(255, $('#TPopKatNr_limit'))
      $('#TPopEigen')
        .val(data.TPopEigen)
        .limiter(255, $('#TPopEigen_limit'))
      $('#TPopKontakt')
        .val(data.TPopKontakt)
        .limiter(255, $('#TPopKontakt_limit'))
      $('#TPopNutzungszone')
        .val(data.TPopNutzungszone)
        .limiter(255, $('#TPopNutzungszone_limit'))
      $('#TPopBewirtschafterIn')
        .val(data.TPopBewirtschafterIn)
        .limiter(255, $('#TPopBewirtschafterIn_limit'))
      $('#TPopBewirtschaftung')
        .val(data.TPopBewirtschaftung)
        .limiter(255, $('#TPopBewirtschaftung_limit'))
      $('#TPopTxt').val(data.TPopTxt)

      // Formulare blenden
      // nur, wenn ohneZuZeigen nicht true ist (true, um in dialog anzuzeigen)
      if (!ohneZuZeigen) {
        zeigeFormular('tpop')
        window.history.pushState(null, null, 'index.html?ap=' + apId + '&pop=' + popId + '&tpop=' + tpopId)

        // bei neuen Datensätzen Fokus steuern
        if (!$TPopFlurname.val()) {
          $('#TPopNr').focus()
        }
      }
    }
  }).fail(function () {
    melde('Fehler: keine Daten für die Teilpopulation erhalten')
  })
}
