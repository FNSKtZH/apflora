/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
*/

'use strict'

module.exports = function (line) {
  var length = Math.round(line.getLength() * 100) / 100,
    output

  if (length > 1000) {
    output = (Math.round(length / 1000 * 100) / 100) + ' km'
  } else {
    output = (Math.round(length * 100) / 100) + ' m'
  }
  return output
}
