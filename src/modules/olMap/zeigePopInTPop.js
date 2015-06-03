'use strict'

var $ = require('jquery'),
  melde = require('../melde'),
  initiiereLayertree = require('./initiiereLayertree'),
  erstellePopLayer = require('./erstellePopLayer'),
  getApiHost = require('../getApiHost')

module.exports = function (overlayPopVisible, popidMarkiert) {
  var popGezeigt = $.Deferred()

  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/popKarteAlle/apId=' + window.apf.ap.ApArtId
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
