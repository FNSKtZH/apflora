'use strict'

var initiiereLayertree = require('./initiiereLayertree')

module.exports = function () {
  var layersArray,
    kategorie,
    title,
    zuLoeschendeLayer = []

  if (window.apf.olMap && window.apf.olMap.map) {
    // getLayers retourniert ein Objekt!!!
    // um die eigentlichen Layers zu erhalten, muss man .getLayers().getArray() aufrufen!!!
    layersArray = window.apf.olMap.map.getLayers().getArray()
    // zuerst nur einen Array mit den zu löschenden Layern erstellen
    // wenn man sofort löscht, wird nur der erste entfernt!
    layersArray.forEach(function (layer) {
      kategorie = layer.get('kategorie')
      title = layer.get('title')
      if (kategorie && kategorie === 'AP Flora' && title !== 'Detailpläne') {
        zuLoeschendeLayer.push(layer)
      }
    })
    zuLoeschendeLayer.forEach(function (layer) {
      window.apf.olMap.map.removeLayer(layer)
    })
    initiiereLayertree()
  }
}
