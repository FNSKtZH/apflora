/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  _ = require('underscore'),
  createGlobals = require('./modules/createGlobals'),
  clearLocalStorage = require('./modules/clearLocalStorage'),
  erstelleGemeindeliste = require('./modules/erstelleGemeindeliste'),
  erstelleArtlisten = require('./modules/erstelleArtlisten'),
  waehleApliste = require('./modules/waehleApliste'),
  oeffneUri = require('./modules/oeffneUri'),
  setupEvents = require('./modules/setupEvents'),
  setupJqueryUi = require('./modules/setupJqueryUi'),
  pruefeLesevoraussetzungen = require('./modules/pruefeLesevoraussetzungen'),
  preventMousescrollEvent = require('./lib/preventMousescrollEvent')

// benötigte globale Variabeln initialisieren
window.apf = window.apf || {}
window.apf.gMap = window.apf.gMap || {}
window.apf.olMap = window.apf.olMap || {}

// initiiereApp als globale Variable bereitstellen,
// damit es wenn nötig später wieder aufgerufen werden kann
// apflora.js kann den anderen Modulen nicht als browserify-Modul bereitgestellt werden,
// weil es die Quelle der Modularisierung ist
window.apf.initiiereApp = function () {
  createGlobals()

  // dataType ist immer json
  // Bei jedem Lesezugriff soll geprüft werden, ob alle Voraussetzungen erfüllt sind
  // v.a., ob der User online ist
  $.ajaxSetup({
    dataType: 'json',
    beforeSend: function () {
      if (!pruefeLesevoraussetzungen()) {
        return false
      }
    }
  })

  // localStorage ausräumen
  clearLocalStorage()

  // Gemeindeliste erstellen (wenn nötig)
  erstelleGemeindeliste()

  // Auswahllisten aufbauen
  erstelleArtlisten()

  // HIER WIRD IN FIREFOX EINE ENDLOSSCHLAUFE AUSGELÖST
  $.when(waehleApliste('programmAlle')).then(function () {
    // falls eine Unteradresse angewählt wurde, diese öffnen
    oeffneUri()
  })

  // für index.html bereitstellen
  // damit es garantiert nur ein mal ausgeführt wird
  window.apf.setupEvents = function () {
    setupEvents()
  }
  window.apf.setupJqueryUi = function () {
    setupJqueryUi()
  }

  preventMousescrollEvent($)

  // ol soll Koordinaten von/in lv03 transformieren können
  window.proj4.defs('EPSG:21781', '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs')
}

// gleich ein mal ausführen
window.apf.initiiereApp()
