// momentan nicht verwendet

/*
    Document   : wms.js
    Created on : Feb 16, 2011, 3:25:27 PM
    Author     : "Gavin Jackson <Gavin.Jackson@csiro.au>"

    Refactored code from //lyceum.massgis.state.ma.us/wiki/doku.php?id=googlemapsv3:home

    example: loadWMS(map, "//spatial.ala.org.au/geoserver/wms?", customParams)

    You can easily add a WMS overlay by calling the loadWMS(map, baseURL, customParams) function, where:

    map - is an instance of Google.maps.Map
    baseURL - is the base URL of your WMS server (eg geoserver)
    customParams - Additional WMS parameters
*/

'use strict'

var google = require('google')

function bound (value, opt_min, opt_max) {
  if (opt_min != null) { value = Math.max(value, opt_min) }
  if (opt_max != null) { value = Math.min(value, opt_max) }
  return value
}

function degreesToRadians (deg) {
  return deg * (Math.PI / 180)
}

function radiansToDegrees (rad) {
  return rad / (Math.PI / 180)
}

function MercatorProjection () {
  /*global Google*/
  var MERCATOR_RANGE = 256
  this.pixelOrigin_ = new google.maps.Point(MERCATOR_RANGE / 2, MERCATOR_RANGE / 2)
  this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360
  this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI)
}

MercatorProjection.prototype.fromLatLngToPoint = function (latLng, opt_point) {
  /*global Google*/
  var me = this
  var point = opt_point || new google.maps.Point(0, 0)
  var origin = me.pixelOrigin_
  var siny

  point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_
  // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
  // 89.189.  This is about a third of a tile past the edge of the world tile.
  siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999)
  point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_
  return point
}

MercatorProjection.prototype.fromDivPixelToLatLng = function (pixel, zoom) {
  /*global Google*/
  var me = this
  var origin = me.pixelOrigin_
  var scale = Math.pow(2, zoom)
  var lng = (pixel.x / scale - origin.x) / me.pixelsPerLonDegree_
  var latRadians = (pixel.y / scale - origin.y) / -me.pixelsPerLonRadian_
  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2)
  return new google.maps.LatLng(lat, lng)
}

MercatorProjection.prototype.fromDivPixelToSphericalMercator = function (pixel, zoom) {
  /*global Google*/
  var me = this
  var coord = me.fromDivPixelToLatLng(pixel, zoom)
  var r = 6378137.0
  var x = r * degreesToRadians(coord.lng())
  var latRad = degreesToRadians(coord.lat())
  var y = (r / 2) * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad)))
  return new google.maps.Point(x, y)
}

module.exports = function (map, baseURL, customParams) {
  var tileHeight = 256
  var tileWidth = 256
  var opacityLevel = 0.75
  var isPng = true
  var minZoomLevel = 2
  var maxZoomLevel = 28
  var wmsParams
  var overlayOptions
  var overlayWMS

  // var baseURL = ""
  // für SVO
  wmsParams = [
    'REQUEST=GetMap',
    'SERVICE=WMS',
    'VERSION=1.1.1',
    // "WIDTH=512",
    // "HEIGHT=512",
    // "SRS=EPSG:4326",
    // "LAYERS=zonen-schutzverordnungen",
    'STYLES=default',
    'TRANSPARENT=TRUE',
    'FORMAT=image/gif'
  ]
  // für av
  /*var wmsParams = [
  //"REQUEST=GetCapabilities",
  //"SERVICE=WMS",
  //"VERSION=1.3.0",
  "WIDTH="+ tileWidth,
  "HEIGHT="+ tileHeight
  ];*/

  // add additional parameters
  wmsParams = wmsParams.concat(customParams)

  overlayOptions = {
    getTileUrl: function (coord, zoom) {
      var lULP = new google.maps.Point(coord.x * 256, (coord.y + 1) * 256)
      var lLRP = new google.maps.Point((coord.x + 1) * 256, coord.y * 256)
      var projectionMap = new MercatorProjection()
      var lULg = projectionMap.fromDivPixelToSphericalMercator(lULP, zoom)
      var lLRg = projectionMap.fromDivPixelToSphericalMercator(lLRP, zoom)
      var lUL_Latitude = lULg.y
      var lUL_Longitude = lULg.x
      var lLR_Latitude = lLRg.y
      var lLR_Longitude = lLRg.x
      var urlResult

      // GJ: there is a bug when crossing the -180 longitude border (tile does not render) - this check seems to fix it
      if (lLR_Longitude < lUL_Longitude) {
        lLR_Longitude = Math.abs(lLR_Longitude)
      }
      urlResult = baseURL + wmsParams.join('&') + '&bbox=' + lUL_Longitude + ',' + lUL_Latitude + ',' + lLR_Longitude + ',' + lLR_Latitude

      return urlResult
    },

    tileSize: new google.maps.Size(tileHeight, tileWidth),

    minZoom: minZoomLevel,
    maxZoom: maxZoomLevel,

    opacity: opacityLevel,

    isPng: isPng
  }

  overlayWMS = new google.maps.ImageMapType(overlayOptions)

  map.overlayMapTypes.insertAt(0, overlayWMS)

  map.setOptions({
    mapTypeControlOptions: {
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.TERRAIN,
        google.maps.MapTypeId.SATELLITE,
        google.maps.MapTypeId.HYBRID
      ],
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  })
}
