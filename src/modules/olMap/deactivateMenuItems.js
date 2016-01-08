// deaktiviert Messen und Auswählen

'use strict'

var $ = require('jquery')
var entfernePopupOverlays = require('./entfernePopupOverlays')
var removeSelectFeaturesInSelectableLayers = require('./removeSelectFeaturesInSelectableLayers')
var removeMeasureInteraction = require('./removeMeasureInteraction')
var entferneModifyInteractionFuerTpop = require('./entferneModifyInteractionFuerTpop')

module.exports = function () {
  // messen deaktivieren
  removeMeasureInteraction()
  // Auswählen deaktivieren
  removeSelectFeaturesInSelectableLayers()
  // allfällige popups schliessen
  entfernePopupOverlays()
  // allfällige tooltips von ga-karten verstecken
  $('div.ga-tooltip').hide()
  // allfällige modify-interaction entfernen
  entferneModifyInteractionFuerTpop()
}
