/**
 * baut das html für die Dropdown-Liste der Delarze-Lebensräume
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.lrdelarzeHtml
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser wird das generierte html übergeben
 */

'use strict'

var $ = require('jquery')
var getApiHost = require('./getApiHost')

module.exports = function (callback) {
  var html = window.apf.lrdelarzeHtml

  if (!html) {
    $.ajax({
      type: 'get',
      url: getApiHost() + '/lrDelarze'
    }).done(function (data) {
      if (data) {
        // Feld mit Daten beliefern
        html = '<option></option>'
        data.forEach(function (lr) {
          html += '<option value="' + lr.id + '">' + lr.Einheit + '</option>'
        })
        window.apf.lrdelarzeHtml = html
      }
      callback(html)
      return
    })
  }
  callback(html)
}
