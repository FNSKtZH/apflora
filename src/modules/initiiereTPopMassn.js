'use strict'

var $ = require('jquery'),
  dateFormat = require('dateformat'),
  limiter = require('../lib/limiter'),
  initiiereAp = require('./initiiereAp'),
  initiierePop = require('./initiierePop'),
  initiiereTPop = require('./initiiereTPop'),
  getAdressenHtml = require('./getAdressenHtml'),
  getMassntypHtml = require('./getMassntypHtml'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  leereFelderVonFormular = require('./leereFelderVonFormular'),
  getApiHost = require('./getApiHost')

module.exports = function (apId, popId, tpopId, massnId) {
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
  if (!massnId && !window.localStorage.tpopmassnId) {
    // es fehlen benötigte Daten > eine Ebene höher
    initiiereTPop(apId, popId, tpopId)
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
  // massnId setzen
  window.localStorage.tpopmassnId = window.localStorage.tpopmassnId || massnId
  massnId = massnId || window.localStorage.tpopmassnId

  // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
  limiter($)

  // Felder zurücksetzen
  leereFelderVonFormular('tpopmassn')

  // Daten für die pop aus der DB holen
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpopmassn/feld=TPopMassnId/wertNumber=' + massnId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]

      // tpopmassn bereitstellen
      window.apf.tpopmassn = data

      // Felder mit Daten beliefern
      // für select TPopMassnTyp Daten holen - oder vorhandene nutzen
      getMassntypHtml(function (html) {
        $('#TPopMassnTyp')
          .html(html)
          .val(window.apf.tpopmassn.TPopMassnTyp)
      })
      $('#TPopMassnTxt')
        .val(data.TPopMassnTxt)
        .limiter(255, $('#TPopMassnTxt_limit'))
      $('#TPopMassnJahr').val(data.TPopMassnJahr)
      if (data.TPopMassnDatum) {
        // chrome akzeptiert nur - getrennte Daten. Und zeigt sie dann gemäss Pattern korrekt an
        // die übrigen stellen mit - getrennte Daten leider mit - dar
        if (!window.chrome) {
          $('#TPopMassnDatum').val(dateFormat(data.TPopMassnDatum, 'dd.mm.yyyy'))
        } else {
          $('#TPopMassnDatum').val(dateFormat(data.TPopMassnDatum, 'yyyy-mm-dd'))
        }
      }
      // Adressen holen, um TPopMassnBearb zu füllen
      getAdressenHtml(function (html) {
        $('#TPopMassnBearb')
          .html(html)
          .val(window.apf.tpopmassn.TPopMassnBearb)
      })
      $('#TPopMassnBemTxt').val(data.TPopMassnBemTxt)
      if (data.TPopMassnPlan === 1) {
        $('#TPopMassnPlan').prop('checked', true)
      } else {
        $('#TPopMassnPlan').prop('checked', false)
      }
      $('#TPopMassnPlanBez')
        .val(data.TPopMassnPlanBez)
        .limiter(255, $('#TPopMassnPlanBez_limit'))
      $('#TPopMassnFlaeche').val(data.TPopMassnFlaeche)
      $('#TPopMassnAnsiedForm')
        .val(data.TPopMassnAnsiedForm)
        .limiter(255, $('#TPopMassnAnsiedForm_limit'))
      $('#TPopMassnAnsiedPflanzanordnung')
        .val(data.TPopMassnAnsiedPflanzanordnung)
        .limiter(255, $('#TPopMassnAnsiedPflanzanordnung_limit'))
      $('#TPopMassnMarkierung')
        .val(data.TPopMassnMarkierung)
        .limiter(255, $('#TPopMassnMarkierung_limit'))
      $('#TPopMassnAnsiedAnzTriebe').val(data.TPopMassnAnsiedAnzTriebe)
      $('#TPopMassnAnsiedAnzPfl').val(data.TPopMassnAnsiedAnzPfl)
      $('#TPopMassnAnzPflanzstellen').val(data.TPopMassnAnzPflanzstellen)
      $('#TPopMassnAnsiedWirtspfl').val(data.TPopMassnAnsiedWirtspfl)
      $('#TPopMassnAnsiedHerkunftPop')
        .val(data.TPopMassnAnsiedHerkunftPop)
        .limiter(255, $('#TPopMassnAnsiedHerkunftPop_limit'))
      $('#TPopMassnAnsiedDatSamm')
        .val(data.TPopMassnAnsiedDatSamm)
        .limiter(50, $('#TPopMassnAnsiedDatSamm_limit'))
      $('#TPopMassnGuid').val(data.TPopMassnGuid)

      // Formulare blenden
      zeigeFormular('tpopmassn')
      window.history.pushState(null, null, 'index.html?ap=' + apId + '&pop=' + popId + '&tpop=' + tpopId + '&tpopmassn=' + massnId)

      // bei neuen Datensätzen Fokus steuern
      $('#TPopMassnJahr').focus()
    }
  }).fail(function () {
    melde('Fehler: keine Daten für die Massnahme erhalten')
  })
}
