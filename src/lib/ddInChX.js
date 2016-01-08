/**
 * wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict'

module.exports = function (breite, laenge) {
  var ddInWgs84BreiteGrad = require('./ddInWgs84BreiteGrad')
  var breiteGrad = ddInWgs84BreiteGrad(breite)
  var ddInWgs84BreiteMin = require('./ddInWgs84BreiteMin')
  var breiteMin = ddInWgs84BreiteMin(breite)
  var ddInWgs84BreiteSec = require('./ddInWgs84BreiteSec')
  var breiteSec = ddInWgs84BreiteSec(breite)
  var ddInWgs84LaengeGrad = require('./ddInWgs84LaengeGrad')
  var laengeGrad = ddInWgs84LaengeGrad(laenge)
  var ddInWgs84LaengeMin = require('./ddInWgs84LaengeMin')
  var laengeMin = ddInWgs84LaengeMin(laenge)
  var ddInWgs84LaengeSec = require('./ddInWgs84LaengeSec')
  var laengeSec = ddInWgs84LaengeSec(laenge)
  var wgs84InChX = require('./wgs84InChX')

  return Math.floor(wgs84InChX(breiteGrad, breiteMin, breiteSec, laengeGrad, laengeMin, laengeSec))
}
