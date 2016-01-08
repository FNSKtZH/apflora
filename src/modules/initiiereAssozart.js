'use strict'

var $ = require('jquery')
var _ = require('underscore')
var initiiereAp = require('./initiiereAp')
var zeigeFormular = require('./zeigeFormular')
var melde = require('./melde')
var leereFelderVonFormular = require('./leereFelderVonFormular')
var getApiHost = require('./getApiHost')

module.exports = function (apId, assozId) {
  // prüfen, ob voraussetzungen gegeben sind
  if (!apId && !window.localStorage.apId) {
    // Anwendung neu initiieren
    window.apf.initiiereApp()
    return
  }
  if (!assozId && !window.localStorage.assozartenId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereAp(apId)
    return
  }

  // apId setzen
  window.localStorage.apId = window.localStorage.apId || apId
  apId = apId || window.localStorage.apId

  // assozId setzen
  if (!window.localStorage.assozartenId) {
    window.localStorage.assozartenId = assozId
  }
  if (!assozId) {
    assozId = window.localStorage.assozartenId
  }

  var $AaSisfNrText = $('#AaSisfNrText')
  var aaSisfNrText

  // Felder zurücksetzen
  leereFelderVonFormular('assozarten')

  // Daten für die assozarten aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=assozart/feld=AaId/wertNumber=' + assozId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // assozarten bereitstellen
      window.apf.assozarten = data

      // Felder mit Daten beliefern
      // autocomplete, d.h. ein Feld für den Text und eines für die nummer
      if (data.AaSisfNr) {
        $('#AaSisfNr').val(data.AaSisfNr)
        aaSisfNrText = _.find(window.apf.artliste, function (art) {
          return art.id === data.AaSisfNr
        })
        // falls die erfasste Nummer in der Artliste nicht (mehr) enthalten ist!
        if (aaSisfNrText) {
          $AaSisfNrText.val(aaSisfNrText.label)
        }
      }
      $('#AaBem').val(data.AaBem)

      // Formulare blenden
      zeigeFormular('assozarten')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&assozarten=' + assozId)

      // bei neuen Datensätzen Fokus steuern
      if (!$AaSisfNrText.val()) {
        $AaSisfNrText.focus()
      }
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für die assoziierte Art erhalten')
  })
}
