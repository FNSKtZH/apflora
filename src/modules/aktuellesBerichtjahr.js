/*
 * berechnet das Berichtjahr, für welches normalerweise Daten erfasst werden
 * bis und mit März wird für das Vorjahr gearbeitet
 */

'use strict'

module.exports = function () {
  var date,
    month,
    jear,
    berichtjahr

  date = new Date()
  month = date.getMonth()
  jear = date.getFullYear()
  berichtjahr = jear

  if (month < 4) {
    berichtjahr = jear - 1
  }

  return berichtjahr
}
