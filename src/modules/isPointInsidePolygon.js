/*
 * receives a polygon as geoJson object with coodinates in WGS84
 * and an x and y coordinate in LV03
 * converts coodinates to WGS84
 * then checks if point is inside polygon
 */

'use strict'

var inside = require('turf-inside')
var ol = require('ol')

module.exports = function (polygon, x, y) {
  var koordLv03 = [x, y]
  var koordWgs84
  var koordPt
  var isInsidePolygon = false

  // convert koordinates to wgs84
  koordWgs84 = ol.proj.transform(koordLv03, 'EPSG:21781', 'EPSG:4326')

  // convert coordinates into a geoJson point
  koordPt = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': koordWgs84
    }
  }

  // let turf check if the point is in zh
  isInsidePolygon = inside(koordPt, polygon)

  return isInsidePolygon
}
