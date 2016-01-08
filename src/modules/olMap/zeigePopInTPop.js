'use strict'

var $ = require('jquery')
var melde = require('../melde')
var initiiereLayertree = require('./initiiereLayertree')
var erstellePopLayer = require('./erstellePopLayer')
var getApiHost = require('../getApiHost')

module.exports = function (overlayPopVisible, popidMarkiert) {
  var popGezeigt = $.Deferred()

  $.ajax({
    type: 'get',
    url: getApiHost() + '/popKarteAlle/apId=' + window.apf.ap.ApArtId
  }).done(function (popListe) {
    // Layer für Symbole und Beschriftung erstellen
    $.when(erstellePopLayer(popListe, popidMarkiert, overlayPopVisible)).then(function () {
      // layertree neu aufbauen
      initiiereLayertree()
      popGezeigt.resolve()
    })
  }).fail(function () {
    melde('Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden')
    popGezeigt.resolve()
  })
  return popGezeigt.promise()
}
