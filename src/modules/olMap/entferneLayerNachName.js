'use strict'

var _ = require('underscore'),
  aktualisiereEbeneInLocalStorage = require('./aktualisiereEbeneInLocalStorage'),
  getLayersWithTitle = require('./getLayersWithTitle')

module.exports = function (name) {
  var layersArray = getLayersWithTitle(),
    layername,
    layerKategorie

  _.each(layersArray, function (layer) {
    layername = layer.get('title')
    layerKategorie = layer.get('kategorie')
    if (layername === name) {
      window.apf.olMap.map.removeLayer(layer)
      if (layerKategorie === 'Eigene Ebenen') {
        // ebene aus localStorage entfernen
        aktualisiereEbeneInLocalStorage(layer, true)
      }
    }
  })
}
