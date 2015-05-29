// übernimmt drei Variablen: popliste ist das Objekt mit den Populationen
// popidMarkiert der Array mit den ausgewählten Pop
// visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)

'use strict'

var $ = require('jquery'),
  _ = require('underscore'),
  ol = require('ol'),
  stylePop = require('./stylePop'),
  popContent = require('../../templates/olMap/popupPop'),
  addSelectFeaturesInSelectableLayers = require('./addSelectFeaturesInSelectableLayers'),
  pruefeObPopTpopGewaehltWurden = require('./pruefeObPopTpopGewaehltWurden')

module.exports = function (popliste, popidMarkiert, visible) {
  var popLayerErstellt = $.Deferred(),
    markers = [],
    marker,
    myLabel,
    myName,
    popupContent,
    popMitNrLayer,
    selectedFeatures

  if (window.apf.olMap.map && window.apf.olMap.map.olmapSelectInteraction && popidMarkiert) {
    selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray()
  } else if (popidMarkiert) {
    addSelectFeaturesInSelectableLayers()
    selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray()
  }

  visible = (visible === true)

  _.each(popliste, function (pop) {
    myName = pop.PopName || '(kein Name)'
    popupContent = popContent(pop)

    // tooltip bzw. label vorbereiten: nullwerte ausblenden
    myLabel = (pop.PopNr ? pop.PopNr.toString() : '?')

    // marker erstellen...
    marker = new ol.Feature({
      geometry: new ol.geom.Point([pop.PopXKoord, pop.PopYKoord]),
      popNr: myLabel,
      popName: myName,
      name: myLabel, // noch benötigt? TODO: entfernen
      popupContent: popupContent,
      popupTitle: myName,
      // Koordinaten werden gebraucht, damit das popup richtig platziert werden kann
      xkoord: pop.PopXKoord,
      ykoord: pop.PopYKoord,
      myTyp: 'pop',
      myId: pop.PopId
    })

    // marker in Array speichern
    markers.push(marker)

    // markierte in window.apf.olMap.map.olmapSelectInteraction ergänzen
    if (popidMarkiert && popidMarkiert.indexOf(pop.PopId) !== -1) {
      selectedFeatures.push(marker)
    }
  })

  // layer für Marker erstellen
  popMitNrLayer = new ol.layer.Vector({
    title: 'Populationen',
    selectable: true,
    source: new ol.source.Vector({
      features: markers
    }),
    style: function (feature, resolution) {
      return stylePop(feature, resolution)
    }
  })
  popMitNrLayer.set('visible', visible)
  popMitNrLayer.set('kategorie', 'AP Flora')
  window.apf.olMap.map.addLayer(popMitNrLayer)

  if (selectedFeatures && selectedFeatures.length > 0) {
    setTimeout(function () {
      pruefeObPopTpopGewaehltWurden()
    }, 100)
    // Schaltfläche olMapAuswaehlen aktivieren
    $('#olMapAuswaehlen')
      .prop('checked', true)
      .button()
      .button('refresh')
  }

  popLayerErstellt.resolve()
  return popLayerErstellt.promise()
}
