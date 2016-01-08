'use strict'

var $ = require('jquery')
var zeigeFormular = require('../zeigeFormular')
var erstelleTPopLayer = require('./erstelleTPopLayer')
var initiiereLayertree = require('./initiiereLayertree')
var zeigePopInTPop = require('./zeigePopInTPop')
var melde = require('../melde')
var waehleAusschnittFuerUebergebenePop = require('./waehleAusschnittFuerUebergebenePop')
var getApiHost = require('../getApiHost')

module.exports = function (popListeMarkiert) {
  var markiertePop

  // falls noch aus dem Verorten ein Klick-Handler besteht: deaktivieren
  if (window.apf.olMap.LetzterKlickHandler) {
    window.apf.olMap.LetzterKlickHandler.deactivate()
  }

  markiertePop = waehleAusschnittFuerUebergebenePop(popListeMarkiert)

  // Grundkarte aufbauen
  $.when(zeigeFormular('olMap')).then(function () {
    // Karte zum richtigen Ausschnitt zoomen
    // aber nur, wenn keine Auswahl aktiv
    if (window.apf.olMap.auswahlPolygonLayer && window.apf.olMap.auswahlPolygonLayer.features.length > 0) {
      // Auswahl aktiv, Zoomstufe belassen
    } else {
      window.apf.olMap.map.updateSize()
      window.apf.olMap.map.getView().fitExtent(markiertePop.bounds, window.apf.olMap.map.getSize())
    }
    // tpop und pop ergänzen
    // alle tpop holen
    $.ajax({
      type: 'get',
      url: getApiHost() + '/tpopKarteAlle/apId=' + window.apf.ap.ApArtId
    }).done(function (tpopListe) {
      $.when(
        // Layer für Symbole und Beschriftung erstellen
        erstelleTPopLayer(tpopListe),
        // alle Pop holen, symbole und nr sichtbar schalten, Markierung übergeben
        zeigePopInTPop(true, markiertePop.popidMarkiert)
      ).then(function () {
        // layertree neu aufbauen
        initiiereLayertree()
      })
    }).fail(function () {
      melde('Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden')
    })
  })
}
