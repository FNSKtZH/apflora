'use strict'

var zeigeFeatureInfo = require('./zeigeFeatureInfo')
var pruefeObPopTpopGewaehltWurden = require('./pruefeObPopTpopGewaehltWurden')

module.exports = function () {
  window.apf.olMap.map.on('singleclick', function (event) {
    var pixel = event.pixel
    var coordinate = event.coordinate

    // nur machen, wenn nicht selektiert wird
    if (!window.apf.olMap.map.olmapSelectInteraction) {
      zeigeFeatureInfo(pixel, coordinate)
    }
    // prüfen, ob pop / tpop gewählt wurden
    // verzögern, weil die neuste selection sonst nicht erfasst wird
    setTimeout(function () {
      pruefeObPopTpopGewaehltWurden()
    }, 100)
  })
}
