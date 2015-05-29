/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (breite) {
  var breiteGrad = Math.floor(breite),
    breiteMin = Math.floor((breite - breiteGrad) * 60)

  return Math.round((((breite - breiteGrad) - (breiteMin / 60)) * 60 * 60) * 100) / 100
}
