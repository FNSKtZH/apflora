/**
 * wandelt Projektionen um
 * @return {number}
 */

'use strict'

module.exports = function (breite) {
  var breiteGrad = Math.floor(breite)
  return Math.floor((breite - breiteGrad) * 60)
}
