'use strict'

var $ = require('jquery')
var ol = require('ol')
var erstelleModifyInteractionFuerTPop = require('./erstelleModifyInteractionFuerTPop')
var zeigeTPop = require('./zeigeTPop')
var styleTPop = require('./styleTPop')
var erstelleMarkerFuerTPopLayer = require('./erstelleMarkerFuerTPopLayer')
var aktualisiereKoordinatenVonTPop = require('../aktualisiereKoordinatenVonTPop')
var stapleLayerZuoberst = require('./stapleLayerZuoberst')
var deactivateMenuItems = require('./deactivateMenuItems')
var removeSelectFeaturesInSelectableLayers = require('./removeSelectFeaturesInSelectableLayers')

module.exports = function (tpop) {
  var bounds
  var xMax
  var xMin
  var yMax
  var yMin
  var newFeature
  var modifySource
  var modifyLayer

  // tpop hat keine PopNr
  // Infos von Pop müssen ergänzt werden, weil sie als Label angezeigt werden
  tpop.PopNr = window.apf.pop.PopNr
  tpop.PopName = window.apf.pop.PopName
  tpop.Artname = window.apf.ap.Artname

  $.when(zeigeTPop()).then(function () {
    deactivateMenuItems()

    // modify-layer erstellen
    modifySource = new ol.source.Vector()
    modifyLayer = new ol.layer.Vector({
      title: 'verortende Teilpopulation',
      kategorie: 'AP Flora',
      source: modifySource,
      style: function (feature, resolution) {
        return styleTPop(feature, resolution, false, true)
      }
    })
    window.apf.olMap.map.addLayer(modifyLayer)

    if (tpop && tpop.TPopXKoord && tpop.TPopYKoord) {
      // bounds vernünftig erweitern, damit Punkt nicht in eine Ecke zu liegen kommt
      xMax = parseInt(tpop.TPopXKoord, 10) + 200
      xMin = parseInt(tpop.TPopXKoord, 10) - 200
      yMax = parseInt(tpop.TPopYKoord, 10) + 200
      yMin = parseInt(tpop.TPopYKoord, 10) - 200
      bounds = [xMin, yMin, xMax, yMax]
      // wenn schon eine Koordinate existiert:
      // tpop als feature zum modify hinzufügen
      newFeature = new ol.Feature(new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]))
      modifySource.addFeature(newFeature)
      // modify-handler erstellen
      erstelleModifyInteractionFuerTPop(modifySource)
      // Karte zum richtigen Ausschnitt zoomen
      window.apf.olMap.map.updateSize()
      window.apf.olMap.map.getView().fitExtent(bounds, window.apf.olMap.map.getSize())
      // verzögern, sonst funktioniert es nicht
      setTimeout(function () {
        stapleLayerZuoberst('verortende Teilpopulation')
      }, 200)
    } else {
      // wenn keine Koordinate existiert:
      window.apf.olMap.draw_interaction = new ol.interaction.Draw({
        source: modifySource,
        type: /** @type {ol.geom.GeometryType} */ ('Point')
      })
      window.apf.olMap.map.addInteraction(window.apf.olMap.draw_interaction)

      window.apf.olMap.draw_interaction.once('drawend', function (event) {
        var coordinates = event.feature.getGeometry().getCoordinates()
        // Koordinaten in tpop ergänzen
        tpop.TPopXKoord = parseInt(coordinates[0], 10)
        tpop.TPopYKoord = parseInt(coordinates[1], 10)
        $.when(aktualisiereKoordinatenVonTPop(tpop)).then(function () {
          // marker in tpopLayer ergänzen
          // tpopLayer holen
          var layers = window.apf.olMap.map.getLayers().getArray()
          var tpopLayerNr = $('#olMapLayertreeTeilpopulationen').val()
          var tpopLayer = layers[tpopLayerNr]
          var tpopLayerSource = tpopLayer.getSource()
          // marker ergänzen
          tpopLayerSource.addFeature(erstelleMarkerFuerTPopLayer(tpop))
          // selects entfernen - aus unerfindlichem Grund ist der neue Marker selektiert
          removeSelectFeaturesInSelectableLayers()

          window.apf.olMap.map.removeInteraction(window.apf.olMap.draw_interaction)
          // modify-interaction erstellen
          erstelleModifyInteractionFuerTPop(modifySource)
        })
      }, this)
      // verzögern, sonst funktioniert es nicht
      setTimeout(function () {
        stapleLayerZuoberst('verortende Teilpopulation')
      }, 200)
    }
  })
}
