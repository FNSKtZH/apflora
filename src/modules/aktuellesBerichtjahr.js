/*
 * berechnet das Berichtjahr, für welches normalerweise Daten erfasst werden
 * bis und mit März wird für das Vorjahr gearbeitet
 */

'use strict'

module.exports = function () {
  var date = new Date()
  var month = date.getMonth()
  var jear = date.getFullYear()
  var berichtjahr = jear

  if (month < 4) berichtjahr = jear - 1

  return berichtjahr
}
