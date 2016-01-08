// übernimmt eine Liste von (markierten) TPop
// retourniert den Ausschnitt = bounds der angezeigt werden soll
// und einen array mit den tpopId's der liste

'use strict'

var _ = require('underscore')

module.exports = function (tpopListeMarkiert, zuordnen) {
  var bounds
  var xArray = []
  var yArray = []
  var xMax
  var yMax
  var xMin
  var yMin
  var dist
  var tpopidMarkiert = []

  dist = zuordnen ? 500 : 70

  // bounds der anzuzeigenden bestimmen
  if (tpopListeMarkiert && tpopListeMarkiert.length > 0) {
    _.each(tpopListeMarkiert, function (tpop) {
      tpopidMarkiert.push(tpop.TPopId)
      xArray.push(tpop.TPopXKoord)
      yArray.push(tpop.TPopYKoord)
    })
    // extent berechnen
    // puffern, damit immer alles sichtbar ist
    // underscore retourniert strings, also in Zahlen umwandeln
    xMax = parseInt(_.max(xArray), 10) + dist
    xMin = parseInt(_.min(xArray), 10) - dist
    yMax = parseInt(_.max(yArray), 10) + dist
    yMin = parseInt(_.min(yArray), 10) - dist
    bounds = [xMin, yMin, xMax, yMax]
  } else {
    // keine tpop übergeben, Kanton anzeigen
    bounds = [669000, 222000, 717000, 284000]
  }
  return {
    bounds: bounds,
    tpopidMarkiert: tpopidMarkiert
  }
}
