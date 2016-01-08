'use strict'

var _ = require('underscore')
var downloadFileFromView = require('../../downloadFileFromView')
var downloadFileFromViewWehreIdIn = require('../../downloadFileFromViewWehreIdIn')

module.exports = function () {
  // wenn tpop ausgewählt, diese übergeben
  var tpopIdListe = ''
  if (window.apf.olMap.tpopSelected) {
    _.each(window.apf.olMap.tpopSelected, function (tpop, index) {
      tpopIdListe += tpop.get('myId')
      if (index + 1 < window.apf.olMap.tpopSelected.length) {
        tpopIdListe += ','
      }
    })
    downloadFileFromViewWehreIdIn('v_tpop', 'TPop ID', tpopIdListe, 'Teilpopulationen', 'csv')
  } else {
    downloadFileFromView('v_tpop', 'Teilpopulationen')
  }
  return false // this is critical to stop the click event which will trigger a normal file download!
}
