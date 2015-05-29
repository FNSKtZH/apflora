'use strict'

var $ = require('jquery')

module.exports = function () {
  if ($(this).is(':checked')) {
    window.apf.googleKarteDetailplaene.setMap(window.apf.gMap.map)
  } else {
    window.apf.googleKarteDetailplaene.setMap(null)
  }
}
