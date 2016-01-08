// übernimmt eine Liste von (markierten) Pop
// retourniert den Ausschnitt = bounds der angezeigt werden soll
// und einen array mit den tpopId's der liste

'use strict'

var _ = require('underscore')

module.exports = function (popListeMarkiert) {
  var bounds
  var xArray = []
  var yArray = []
  var xMax
  var yMax
  var xMin
  var yMin
  var popidMarkiert = []

  // bounds der anzuzeigenden bestimmen
  if (popListeMarkiert && popListeMarkiert.length > 0) {
    popListeMarkiert.forEach(function (pop) {
      popidMarkiert.push(pop.PopId)
      xArray.push(pop.PopXKoord)
      yArray.push(pop.PopYKoord)
    })
    // extent berechnen
    // puffern, damit immer alles sichtbar ist
    // underscore retourniert strings, also in Zahlen umwandeln
    xMax = parseInt(_.max(xArray), 10) + 70
    xMin = parseInt(_.min(xArray), 10) - 70
    yMax = parseInt(_.max(yArray), 10) + 70
    yMin = parseInt(_.min(yArray), 10) - 70
    bounds = [xMin, yMin, xMax, yMax]
  } else {
    // keine tpop übergeben, Kanton anzeigen
    bounds = [669000, 222000, 717000, 284000]
  }
  return {
    bounds: bounds,
    popidMarkiert: popidMarkiert
  }
}
