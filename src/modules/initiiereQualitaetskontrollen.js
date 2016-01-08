/*
 * Erzeugt eine Liste von Hinweisen auf Daten, die geprüft werden sollten
 * Ziel: Datenverantwortliche kontrollieren die Qualität ihrer Daten weitgehend selbst
 * Felder:
 * - Datensatz (Datensatzbeschreibung): ist Link, der in neuem Tab öffnet
 * - Hinweis (Begründung, wieso der Datensatz angezeigt wird)
 */

'use strict'

var $ = require('jquery')
var zeigeFormular = require('./zeigeFormular')
var kontrolliereProgramm = require('./kontrolliereProgramm')

module.exports = function (apId) {
  var listOptions = {
    valueNames: ['hw', 'link'],
    item: '<li><p class="hw"></p><p class="link"></p></li>'
  }
  var qsList = new window.List('qualitaetskontrollen', listOptions)

  $('#qkRefresh').button({
    icons: {
      primary: 'ui-icon-refresh'
    }
  })

  // make global so search can be cancelled
  window.apf.qsList = qsList

  zeigeFormular('qualitaetskontrollen')
  window.history.pushState(null, null, 'index.html?ap=' + apId + '&qualitaetskontrollen=true')

  kontrolliereProgramm()
}
