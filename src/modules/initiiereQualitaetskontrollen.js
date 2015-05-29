/*
 * Erzeugt eine Liste von Hinweisen auf Daten, die geprüft werden sollten
 * Ziel: Datenverantwortliche kontrollieren die Qualität ihrer Daten weitgehend selbst
 * Felder:
 * - Datensatz (Datensatzbeschreibung): ist Link, der in neuem Tab öffnet
 * - Hinweis (Begründung, wieso der Datensatz angezeigt wird)
 */

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  zeigeFormular = require('./zeigeFormular'),
  kontrolliereProgramm = require('./kontrolliereProgramm')

module.exports = function (apId) {
  var listOptions = {
      valueNames: ['hw', 'link'],
      item: '<li><p class="hw"></p><p class="link"></p></li>'
    },
    qsList = new window.List('qualitaetskontrollen', listOptions)

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
