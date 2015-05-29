/*
 * Karte zeigt an:
 * - alle tpopArray
 *   - (die gewählte ist markiert)
 *   - "infos abfragen" ist aktiv
 * - alle beobArray
 *   - (zugeordnete sind beschriftet mit PopNr/TPopNr der TPop, der sie zugeordnet sind?)
 *   - nicht zugeordnete sind nicht beschriftet
 *   - beobachtungen liegen unter den tpop, um sie nicht zu verdecken
 * - Zuordnungen von Beob zu TPop:
 *   - jede zugeordnete Beob ist durch eine Linie mit ihrer TPop verbunden
 *   - (wahlweise können auch Beschriftungen (PopNr/TPopNr) eingeblendet werden)
 *   - Zuordnungen können im Layertool geblendet werden
 *   - Zuordnungen liegen zunterst
 *
 * Funktionalität:
 * - Kartenausschnitt soll praktisch sein
 * - Beob können per drag and drop einer TPop zugeordnet werden:
 *   - das Symbol der Beob kehrt in die ursprüngliche Lage zurück
 *   - die Symbole und Zuordnungen werden aktualisiert
 *     auch, wenn der Benutzer die Zuordnung im Formular geändert hat!
 *   - das Formular der Beob wird neben der Karte geöffnet
 *     - Optionenliste in der Höhe begrenzt, mit scrollbar
 *     - Status vor Zuordnung wird angezeigt
 *     - Zuordnung kann Rückgängig gemacht werden
 *     - Nicht zuordnen und Bemerkungen sind oberhalb der Optionenliste
 *     - Formular aus Vorlage aufgebaut
 *  - das Formular kann auch durch Klick auf die Beob neben der Karte geöffnet werden (wie pop und tpopArray)
 *    - Benutzer kann z.B. nicht zuzuordnen setzen - oder hier zuordnen
 *    - Zuordnungen werden in der Karte nachgeführt
 *  - nice to have: die Liste der 100 neusten nicht beurteilten Beob wird ergänzt (jsTree und Karte)
 */

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  _ = require('underscore'),
  async = require('async'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  zeigeFormular = require('../zeigeFormular'),
  waehleAusschnittFuerUebergebeneTPop = require('../olMap/waehleAusschnittFuerUebergebeneTPop'),
  erstelleTPopLayer = require('../olMap/erstelleTPopLayer'),
  erstelleBeobZuordnungsLayer = require('../olMap/erstelleBeobZuordnungsLayer'),
  zeigePopInTPop = require('../olMap/zeigePopInTPop'),
  erstelleBeobLayer = require('../olMap/erstelleBeobLayer'),
  initiiereLayertree = require('../olMap/initiiereLayertree'),
  stapleLayerEineEbeneTiefer = require('../olMap/stapleLayerEineEbeneTiefer'),
  stapleLayerXTiefer = require('../olMap/stapleLayerXTiefer')

module.exports = function (nodeTpopId) {
  var tpopId = erstelleIdAusDomAttributId(nodeTpopId)

  async.parallel({
    getBeob: function (callback) {
      $.ajax({
        type: 'get',
        url: '/api/v1/beobZuordnen/apId=' + window.apf.ap.ApArtId
      }).done(function (beobArray) {
        callback(null, beobArray)
      }).fail(function () {
        callback('Fehler: Keine Daten erhalten', null)
      })
    },
    getTpop: function (callback) {
      $.ajax({
        type: 'get',
        url: 'api/v1/apKarte/apId=' + window.apf.ap.ApArtId
      }).done(function (tpopArray) {
        callback(null, tpopArray)
      }).fail(function () {
        callback('Fehler: Keine Teilpopulationen erhalten', null)
      })
    }
  }, function (err, results) {
    var beobArray = results.getBeob || null,
      tpopArray = results.getTpop || null,
      markierteTpop,
      tpopListeMarkiert

    // prüfen, ob Daten erhalten wurden
    if (err) {
      melde('Fehler mit folgender Meldung: ' + err)
      return
    }
    if (!tpopArray || tpopArray.length === 0) {
      melde('Es gibt keine Teilpopulationen mit Koordinaten')
      return
    }
    if (!beobArray || beobArray.length === 0) {
      melde('Es gibt keine Beobachtung mit Koordinaten', 'Aktion abgebrochen')
      return
    }

    // o.k., wir haben nun alle benötigten Daten

    tpopListeMarkiert = _.filter(tpopArray, function (tpop) {
      return tpop.TPopId == tpopId
    })

    markierteTpop = waehleAusschnittFuerUebergebeneTPop(tpopListeMarkiert, true)

    // Grundkarte aufbauen
    $.when(zeigeFormular('olMap')).then(function () {
      // Karte zum richtigen Ausschnitt zoomen
      window.apf.olMap.map.updateSize()
      window.apf.olMap.map.getView().fitExtent(markierteTpop.bounds, window.apf.olMap.map.getSize())
      // tpop ergänzen
      $.when(
        // Layer für tpop-Symbole und Beschriftung erstellen
        erstelleTPopLayer(tpopArray, null, true, true),
        // Pop holen, aber ausgeblendet
        zeigePopInTPop(false),
        // layer für beob erstellen
        erstelleBeobLayer(beobArray, tpopArray, null, true),
        erstelleBeobZuordnungsLayer(beobArray, tpopArray, true)
      ).then(function () {
        stapleLayerEineEbeneTiefer('Beobachtungen')
        stapleLayerXTiefer('BeobZuordnungen', 2)
        // layertree neu aufbauen
        initiiereLayertree()
      })
    }).fail(function () {
      melde('Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden')
    })
  })
}
