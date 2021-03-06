'use strict'

var $ = require('jquery')
var ol = require('ol')
var pruefeObPopTpopGewaehltWurden = require('./pruefeObPopTpopGewaehltWurden')

module.exports = function () {
  // interaction erstellen
  window.apf.olMap.dragBoxInteraction = new ol.interaction.DragBox({
    /* dragbox interaction is active only if alt key is pressed */
    condition: ol.events.condition.altKeyOnly,
    /* style the box */
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.1)'
      }),
      stroke: new ol.style.Stroke({
        color: [255, 0, 0, 1],
        width: 3
      })
    })
  })
  window.apf.olMap.map.addInteraction(window.apf.olMap.dragBoxInteraction)

  // Aktion bei boxend erstellen
  window.apf.olMap.dragBoxInteraction.on('boxend', function () {
    var geometry = window.apf.olMap.dragBoxInteraction.getGeometry()
    var extent = geometry.getExtent()
    var layers = window.apf.olMap.map.getLayers().getArray()
    var popLayerNr = $('#olMapLayertreePopulationen').val()
    var popLayer = layers[popLayerNr]
    var tpopLayerNr = $('#olMapLayertreeTeilpopulationen').val()
    var tpopLayer = layers[tpopLayerNr]
    var popLayerSource = popLayer.getSource()
    var tpopLayerSource = tpopLayer.getSource()
    var selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray()

    if (popLayer.get('visible') === true) {
      popLayerSource.forEachFeatureInExtent(extent, function (feature) {
        selectedFeatures.push(feature)
      })
    }
    if (tpopLayer.get('visible') === true) {
      tpopLayerSource.forEachFeatureInExtent(extent, function (feature) {
        selectedFeatures.push(feature)
      })
    }
    setTimeout(function () {
      pruefeObPopTpopGewaehltWurden()
    }, 100)
  })
}
