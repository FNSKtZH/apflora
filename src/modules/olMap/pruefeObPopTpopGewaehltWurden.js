'use strict'

var $ = require('jquery')
var erstelleListeDerAusgewaehltenPopTPop = require('../erstelleListeDerAusgewaehltenPopTPop')
var getSelectedFeaturesOfType = require('./getSelectedFeaturesOfType')

module.exports = function () {
  var popSelected = []
  var tpopSelected = []

  // prüfen, ob pop / tpop gewählt wurden
  popSelected = getSelectedFeaturesOfType('pop')
  tpopSelected = getSelectedFeaturesOfType('tpop')

  // wenn ja: anzeigen
  if (popSelected.length > 0 || tpopSelected.length > 0) {
    erstelleListeDerAusgewaehltenPopTPop(popSelected, tpopSelected)
  } else {
    $('#olMapErgebnisAuswahl').hide()
  }
}
