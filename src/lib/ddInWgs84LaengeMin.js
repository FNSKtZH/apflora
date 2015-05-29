/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (laenge) {
  var laengeGrad = Math.floor(laenge)
  return Math.floor((laenge - laengeGrad) * 60)
}
