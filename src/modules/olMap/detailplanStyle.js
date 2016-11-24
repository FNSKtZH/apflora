'use strict'

var ol = require('ol')

module.exports = function (feature, resolution) {
  return new ol.style.Style({
    // mail vom 24.11.2016: lieber kein fill
    /*
    fill: new ol.style.Fill({
      color: 'rgba(250, 58, 15, 0.1)'
    }),*/
    stroke: new ol.style.Stroke({
      color: '#fa3a0f',
      width: 1
    })
  })
}
