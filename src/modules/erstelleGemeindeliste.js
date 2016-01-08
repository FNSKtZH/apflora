'use strict'

var $ = require('jquery')
var _ = require('underscore')
var melde = require('./melde')
var getApiHost = require('./getApiHost')

// übernimmt $ wegen jquery ui
module.exports = function () {
  var gemeinden
  if (!window.apf.gemeinden) {
    $.ajax({
      type: 'get',
      url: getApiHost() + '/gemeinden'
    }).done(function (data) {
      if (data) {
        // Gemeinden bereitstellen
        // Feld mit Daten beliefern
        gemeinden = _.map(data, function (gemeinde) {
          if (gemeinde.GmdName) {
            return gemeinde.GmdName
          }
        })
        window.apf.gemeinden = gemeinden
        // autocomplete-widget für Gemeinden initiieren
        $('#TPopGemeinde').autocomplete({
          source: gemeinden,
          delay: 0,
          // Change-Event wird nicht ausgelöst > hier aufrufen
          change: function (event, ui) {
            $('#TPopGemeinde').trigger('change').trigger('keyup')
          }
        })
      }
    }).fail(function () {
      melde('Fehler: Die Liste der Gemeinden konnte nicht bereitgestellt werden')
    })
  }
}
