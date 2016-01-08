/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (laenge) {
  var laengeGrad = Math.floor(laenge)
  var laengeMin = Math.floor((laenge - laengeGrad) * 60)

  return Math.round((((laenge - laengeGrad) - (laengeMin / 60)) * 60 * 60) * 100) / 100
}
