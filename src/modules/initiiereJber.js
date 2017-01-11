'use strict'

var $ = require('jquery')
var dateFormat = require('dateformat')
var initiiereAp = require('./initiiereAp')
var getAdressenHtml = require('./getAdressenHtml')
var zeigeFormular = require('./zeigeFormular')
var melde = require('./melde')
var leereFelderVonFormular = require('./leereFelderVonFormular')
var getApiHost = require('./getApiHost')

module.exports = function (apId, apBerId) {
  // prüfen, ob voraussetzungen gegeben sind
  if (!apId && !window.localStorage.apId) {
    // Anwendung neu initiieren
    window.apf.initiiereApp()
    return
  }
  if (!apBerId && !window.localStorage.jberId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereAp(apId)
    return
  }

  // apId setzen
  window.localStorage.apId = window.localStorage.apId || apId
  apId = apId || window.localStorage.apId

  // apBerId setzen
  window.localStorage.jberId = window.localStorage.jberId || apBerId
  apBerId = apBerId || window.localStorage.jberId

  var $JBerJahr = $('#JBerJahr')

  // Felder zurücksetzen
  leereFelderVonFormular('jber')

  // Daten für die jber aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=apber/feld=JBerId/wertNumber=' + window.localStorage.jberId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // jber bereitstellen
      window.apf.jber = data

      // Felder mit Daten beliefern
      $JBerJahr.val(data.JBerJahr)
      $('#JBerSituation').val(data.JBerSituation)
      $('#JBerVergleichVorjahrGesamtziel').val(data.JBerVergleichVorjahrGesamtziel)
      $('#JBerBeurteilung' + data.JBerBeurteilung).prop('checked', true)
      // escapen, + und - werden sonst verändert
      $('#JBerVeraenGegenVorjahr\\' + data.JBerVeraenGegenVorjahr).prop('checked', true)
      $('#JBerAnalyse').val(data.JBerAnalyse)
      $('#JBerUmsetzung').val(data.JBerUmsetzung)
      $('#JBerErfko').val(data.JBerErfko)
      $('#JBerATxt').val(data.JBerATxt)
      $('#JBerBTxt').val(data.JBerBTxt)
      $('#JBerCTxt').val(data.JBerCTxt)
      $('#JBerDTxt').val(data.JBerDTxt)
      if (data.JBerDatum) {
        // chrome akzeptiert nur - getrennte Daten. Und zeigt sie dann gemäss Pattern korrekt an
        // die übrigen stellen mit - getrennte Daten leider mit - dar
        if (!window.chrome) {
          $('#JBerDatum').val(dateFormat(data.JBerDatum, 'dd.mm.yyyy'))
        } else {
          $('#JBerDatum').val(dateFormat(data.JBerDatum, 'yyyy-mm-dd'))
        }
      }
      // adressen holen, um JBerBearb zu füllen
      getAdressenHtml(function (html) {
        $('#JBerBearb')
          .html(html)
          .val(window.apf.jber.JBerBearb)
      })

      // Formulare blenden
      zeigeFormular('jber')
      window.history.pushState(null, null, 'index.html?ap=' + window.localStorage.apId + '&jber=' + window.localStorage.jberId)

      // bei neuen Datensätzen Fokus steuern
      if (!$JBerJahr.val()) {
        $JBerJahr.focus()
      }
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für den AP-Bericht erhalten')
  })
}
