// sucht features an einem Ort in der Karte

'use strict'

module.exports = function (pixel) {
  var features = []

  // console.log('es folgt forEachFeatureAtPixel')

  window.apf.olMap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
    features.push(feature)
  })
  return features
}
