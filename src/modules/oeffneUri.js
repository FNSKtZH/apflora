/* jslint node: true, browser: true, nomen: true, todo: true, white: true, asi: true */
'use strict'

var $ = require('jquery')
var _ = require('underscore')
var Uri = require('Uri')
var initiiereIdealbiotop = require('./initiiereIdealbiotop')
var initiiereAp = require('./initiiereAp')
var initiiereApziel = require('./initiiereApziel')
var initiiereErfkrit = require('./initiiereErfkrit')
var initiiereZielber = require('./initiiereZielber')
var initiiereJber = require('./initiiereJber')
var initiiereJberUebersicht = require('./initiiereJberUebersicht')
var initiiereBer = require('./initiiereBer')
var initiierePopMassnBer = require('./initiierePopMassnBer')
var initiiereTPop = require('./initiiereTPop')
var initiierePopBer = require('./initiierePopBer')
var initiiereTPopKontr = require('./initiiereTPopKontr')
var initiiereTPopMassn = require('./initiiereTPopMassn')
var initiiereTPopMassnBer = require('./initiiereTPopMassnBer')
var initiiereTPopBer = require('./initiiereTPopBer')
var initiiereBeob = require('./initiiereBeob')
var erstelleTree = require('./jstree/erstelleTree')
var setzeWindowAp = require('./setzeWindowAp')
var setzeWindowPop = require('./setzeWindowPop')
var setzeWindowApziel = require('./setzeWindowApziel')
var setzeWindowZielber = require('./setzeWindowZielber')
var setzeWindowErfkrit = require('./setzeWindowErfkrit')
var setzeWindowJber = require('./setzeWindowJber')
var setzeWindowJberUebersicht = require('./setzeWindowJberUebersicht')
var setzeWindowBer = require('./setzeWindowBer')
var setzeWindowIdealbiotop = require('./setzeWindowIdealbiotop')
var setzeWindowAssozarten = require('./setzeWindowAssozarten')
var setzeWindowPopmassnber = require('./setzeWindowPopmassnber')
var setzeWindowTpop = require('./setzeWindowTpop')
var setzeWindowPopber = require('./setzeWindowPopber')
var setzeWindowTpopfeldkontr = require('./setzeWindowTpopfeldkontr')
var setzeWindowTpopmassn = require('./setzeWindowTpopmassn')
var setzeWindowTpopmassnber = require('./setzeWindowTpopmassnber')
var setzeWindowTpopber = require('./setzeWindowTpopber')
var initiiereExporte = require('./initiiereExporte')
var initiiereQualitaetskontrollen = require('./initiiereQualitaetskontrollen')

module.exports = function () {
  var uri = new Uri($(window.location).attr('href'))
  var anchor = uri.anchor() || null
  var apId = uri.getQueryParamValue('ap')
  var popId = uri.getQueryParamValue('pop')
  var tpopId = uri.getQueryParamValue('tpop')
  var tpopfeldkontrId = uri.getQueryParamValue('tpopfeldkontr')
  var tpopfreiwkontrId = uri.getQueryParamValue('tpopfreiwkontr')
  var tpopmassnId = uri.getQueryParamValue('tpopmassn')
  var tpopberId = uri.getQueryParamValue('tpopber')
  var tpopmassnberId = uri.getQueryParamValue('tpopmassnber')
  var popberId = uri.getQueryParamValue('popber')
  var popmassnberId = uri.getQueryParamValue('popmassnber')
  var apzielId = uri.getQueryParamValue('apziel')
  var zielberId = uri.getQueryParamValue('zielber')
  var erfkritId = uri.getQueryParamValue('erfkrit')
  var jberId = uri.getQueryParamValue('jber')
  var jberUebersichtId = uri.getQueryParamValue('jberUebersicht')
  var berId = uri.getQueryParamValue('ber')
  var idealbiotopId = uri.getQueryParamValue('idealbiotop')
  var assozartenId = uri.getQueryParamValue('assozarten')
  var beobZugeordnetId = uri.getQueryParamValue('beobZugeordnet')
  var beobNichtBeurteiltId = uri.getQueryParamValue('beobNichtBeurteilt')
  var beobNichtZuzuordnenId = uri.getQueryParamValue('beobNichtZuzuordnen')
  var exporte = uri.getQueryParamValue('exporte')
  var qualitaetskontrollen = uri.getQueryParamValue('qualitaetskontrollen')
  var apWaehlenText

  // ids in Zahlen umwandeln
  if (apId) { apId = parseInt(apId, 10) }
  if (popId) { popId = parseInt(popId, 10) }
  if (tpopId) { tpopId = parseInt(tpopId, 10) }
  if (tpopfeldkontrId) { tpopfeldkontrId = parseInt(tpopfeldkontrId, 10) }
  if (tpopfreiwkontrId) { tpopfreiwkontrId = parseInt(tpopfreiwkontrId, 10) }
  if (tpopmassnId) { tpopmassnId = parseInt(tpopmassnId, 10) }
  if (tpopberId) { tpopberId = parseInt(tpopberId, 10) }
  if (tpopmassnberId) { tpopmassnberId = parseInt(tpopmassnberId, 10) }
  if (popberId) { popberId = parseInt(popberId, 10) }
  if (popmassnberId) { popmassnberId = parseInt(popmassnberId, 10) }
  if (apzielId) { apzielId = parseInt(apzielId, 10) }
  if (zielberId) { zielberId = parseInt(zielberId, 10) }
  if (erfkritId) { erfkritId = parseInt(erfkritId, 10) }
  if (jberId) { jberId = parseInt(jberId, 10) }
  if (jberUebersichtId) { jberUebersichtId = parseInt(jberUebersichtId, 10) }
  if (berId) { berId = parseInt(berId, 10) }
  if (idealbiotopId) { idealbiotopId = parseInt(idealbiotopId, 10) }
  if (assozartenId) { assozartenId = parseInt(assozartenId, 10) }

  // zuerst die globalen Variabeln setzen
  if (apId) { setzeWindowAp(apId) }
  if (popId) { setzeWindowPop(popId) }
  if (tpopId) { setzeWindowTpop(tpopId) }
  if (tpopfeldkontrId) { setzeWindowTpopfeldkontr(tpopfeldkontrId) }
  if (tpopfreiwkontrId) { setzeWindowTpopfeldkontr(tpopfreiwkontrId) }
  if (tpopmassnId) { setzeWindowTpopmassn(tpopmassnId) }
  if (tpopberId) { setzeWindowTpopber(tpopberId) }
  if (tpopmassnberId) { setzeWindowTpopmassnber(tpopmassnberId) }
  if (popberId) { setzeWindowPopber(popberId) }
  if (popmassnberId) { setzeWindowPopmassnber(popmassnberId) }
  if (apzielId) { setzeWindowApziel(apzielId) }
  if (zielberId) { setzeWindowZielber(zielberId) }
  if (erfkritId) { setzeWindowErfkrit(erfkritId) }
  if (jberId) { setzeWindowJber(jberId) }
  if (jberUebersichtId) { setzeWindowJberUebersicht(jberUebersichtId) }
  if (berId) { setzeWindowBer(berId) }
  if (idealbiotopId) { setzeWindowIdealbiotop(idealbiotopId) }
  if (assozartenId) { setzeWindowAssozarten(assozartenId) }

  if (apId) {
    // Dem Feld im Formular den Wert zuweisen
    $('#apWaehlen').val(apId)
    // TODO: funktioniert nicht
    // gewählte Art in Auswahlliste anzeigen
    apWaehlenText = _.find(window.apf.apliste.programmAlle, function (art) {
      return art.id === apId
    })
    if (apWaehlenText) {
      $('#apWaehlenText').val(apWaehlenText.label)
    }
    if (tpopId) {
      if (tpopfeldkontrId) {
        // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
        // Die Markierung wird im load-Event wieder entfernt
        window.apf.tpopfeldkontrZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiiereTPopKontr(apId, popId, tpopId, tpopfeldkontrId, 'feldKontr')
      } else if (tpopfreiwkontrId) {
        // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
        window.apf.tpopfreiwkontrZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        window.localStorage.tpopfreiwkontr = true
        initiiereTPopKontr(apId, popId, tpopId, tpopfeldkontrId, 'freiwKontr')
      } else if (tpopmassnId) {
        // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
        window.apf.tpopmassnZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiiereTPopMassn(apId, popId, tpopId, tpopmassnId)
      } else if (tpopberId) {
        // markieren, dass nach dem loaded-event im Tree die tpopber angezeigt werden soll
        window.apf.tpopberZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiiereTPopBer(apId, popId, tpopId, tpopberId)
      } else if (beobZugeordnetId) {
        // markieren, dass nach dem loaded-event im Tree die beobZugeordnet angezeigt werden soll
        window.apf.beobZugeordnetZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        // herausfinden, ob beobtyp infospezies oder evab ist
        window.localStorage.beobId = beobZugeordnetId
        if (isNaN(beobZugeordnetId)) {
          // evab
          window.localStorage.beobtyp = 'evab'
          initiiereBeob('evab', window.localStorage.beobId, 'zugeordnet')
        } else {
          window.localStorage.beobtyp = 'infospezies'
          initiiereBeob('infospezies', window.localStorage.beobId, 'zugeordnet')
        }
      } else if (tpopmassnberId) {
        // markieren, dass nach dem loaded-event im Tree die tpopmassnber angezeigt werden soll
        window.apf.tpopmassnberZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiiereTPopMassnBer(apId, popId, tpopmassnberId)
      } else {
        // muss tpop sein
        // markieren, dass nach dem loaded-event im Tree die TPop angezeigt werden soll
        window.apf.tpopZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiiereTPop(apId, popId, tpopId)
      }
    } else if (popId) {
      if (popberId) {
        // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll
        window.apf.popberZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiierePopBer(apId, popId, popberId)
      } else if (popmassnberId) {
        // markieren, dass nach dem loaded-event im Tree die popmassnber angezeigt werden soll
        window.apf.popmassnberZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiierePopMassnBer(apId, popId, popmassnberId)
      } else {
        // muss pop sein
        // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll
        window.apf.popZeigen = true
      }
    } else if (apzielId) {
      if (zielberId) {
        // markieren, dass nach dem loaded-event im Tree die zielber angezeigt werden soll
        window.apf.zielberZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiiereZielber(apId, apzielId, zielberId)
      } else {
        // muss ein apziel sein
        // markieren, dass nach dem loaded-event im Tree die apziel angezeigt werden soll
        window.apf.apzielZeigen = true
        // direkt initiieren, bevor der baum fertig aufgebaut ist
        initiiereApziel(apId, apzielId)
      }
    } else if (erfkritId) {
      // markieren, dass nach dem loaded-event im Tree die erfkrit angezeigt werden soll
      window.apf.erfkritZeigen = true
      // direkt laden
      initiiereErfkrit(apId, erfkritId)
    } else if (jberId) {
      // markieren, dass nach dem loaded-event im Tree die jber angezeigt werden soll
      window.apf.jberZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      initiiereJber(apId, jberId)
    } else if (jberUebersichtId) {
      // markieren, dass nach dem loaded-event im Tree die jberUebersicht angezeigt werden soll
      window.apf.jberUebersichtZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      initiiereJberUebersicht(apId, jberUebersichtId)
    } else if (berId) {
      // markieren, dass nach dem loaded-event im Tree die ber angezeigt werden soll
      window.apf.berZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      initiiereBer(apId, berId)
    } else if (idealbiotopId) {
      // markieren, dass nach dem loaded-event im Tree die idealbiotop angezeigt werden soll
      window.apf.idealbiotopZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      initiiereIdealbiotop(apId)
    } else if (assozartenId) {
      // markieren, dass nach dem loaded-event im Tree die assozarten angezeigt werden soll
      window.apf.assozartenZeigen = true
    // NICHT direkt initiieren, weil sonst die Artliste noch nicht existiert
    } else if (beobNichtBeurteiltId) {
      // markieren, dass nach dem loaded-event im Tree die beobZugeordnet angezeigt werden soll
      window.apf.beobNichtBeurteiltZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      // herausfinden, ob beobtyp infospezies oder evab ist
      window.localStorage.beobId = beobNichtBeurteiltId
      if (isNaN(beobNichtBeurteiltId)) {
        // evab
        window.localStorage.beobtyp = 'evab'
        initiiereBeob('evab', window.localStorage.beobId, 'nicht_beurteilt')
      } else {
        window.localStorage.beobtyp = 'infospezies'
        initiiereBeob('infospezies', window.localStorage.beobId, 'nicht_beurteilt')
      }
    } else if (beobNichtZuzuordnenId) {
      // markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll
      window.apf.beobNichtZuzuordnenZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      // herausfinden, ob beobtyp infospezies oder evab ist
      window.localStorage.beobId = beobNichtZuzuordnenId
      if (isNaN(beobNichtZuzuordnenId)) {
        // evab
        window.localStorage.beobtyp = 'evab'
        initiiereBeob('evab', window.localStorage.beobId, 'nicht_zuzuordnen')
      } else {
        window.localStorage.beobtyp = 'infospezies'
        initiiereBeob('infospezies', window.localStorage.beobId, 'nicht_zuzuordnen')
      }
    } else if (qualitaetskontrollen) {
      // muss qualitaetskontrollen sein
      // markieren, dass nach dem loaded-event im Tree die qualitaetskontrollen angezeigt werden soll
      window.apf.qualitaetskontrollenZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      initiiereQualitaetskontrollen(apId)
    } else {
      // muss ap sein
      // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll
      window.apf.apZeigen = true
      // direkt initiieren, bevor der baum fertig aufgebaut ist
      initiiereAp(apId)
    }
    erstelleTree(apId)
  } else {
    if (exporte) {
      initiiereExporte(anchor)
    }
  }
}
