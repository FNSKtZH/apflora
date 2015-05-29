// steuert den style von pop
// selected: mit der Maus oder drag_box markierte

'use strict'

var ol = require('ol')

module.exports = function (feature, resolution, selected) {
  var style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'black'
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(183, 42, 249, 0.9)',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
  return [style]
}
