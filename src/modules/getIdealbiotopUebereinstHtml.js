/**
 * baut das html für die Dropdown-Liste der Übereinstimmung mit dem Idealbiotop
 * speichert die Liste in window.apf.IdealBiotopUebereinstHtml
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser wird das generierte html übergeben
 */

'use strict'

var $ = require('jquery')
var getApiHost = require('./getApiHost')

module.exports = function (callback) {
  var html = window.apf.IdealBiotopUebereinstHtml

  if (!html) {
    $.ajax({
      type: 'get',
      url: getApiHost() + '/idealbiotopUebereinst'
    }).done(function (data) {
      if (data && data.length > 0) {
        // Feld mit Daten beliefern
        html = '<option></option>'
        data.forEach(function (uebereinst) {
          html += '<option value="' + uebereinst.DomainCode + '">' + uebereinst.DomainTxt + '</option>'
        })
        window.apf.IdealBiotopUebereinstHtml = html
      }
      callback(html)
      return
    })
  }
  callback(html)
}
