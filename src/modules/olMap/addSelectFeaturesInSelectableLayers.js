'use strict'

var ol = require('ol')
var addDragBoxForPopTpop = require('./addDragBoxForPopTpop')
var stylePop = require('./stylePop')
var styleTPop = require('./styleTPop')
var detailplanStyleSelected = require('./detailplanStyleSelected')

module.exports = function () {
  window.apf.olMap.map.olmapSelectInteraction = new ol.interaction.Select({
    layers: function (layer) {
      return layer.get('selectable') === true
    },
    style: function (feature, resolution) {
      switch (feature.get('myTyp')) {
        case 'pop':
          return stylePop(feature, resolution, true)
        case 'tpop':
          return styleTPop(feature, resolution, true)
        case 'Detailplan':
          return detailplanStyleSelected(feature, resolution)
      }
    }
  })
  window.apf.olMap.map.addInteraction(window.apf.olMap.map.olmapSelectInteraction)
  // man soll auch mit dragbox selecten können
  addDragBoxForPopTpop()
}
