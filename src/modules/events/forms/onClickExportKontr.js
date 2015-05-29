'use strict'

var _ = require('underscore'),
  downloadFileFromView = require('../../downloadFileFromView'),
  downloadFileFromViewWehreIdIn = require('../../downloadFileFromViewWehreIdIn')

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
    downloadFileFromViewWehreIdIn('v_tpopkontr', 'TPop ID', tpopIdListe, 'Kontrollen', 'csv')
  } else {
    downloadFileFromView('v_tpopkontr', 'Kontrollen')
  }
  return false; // this is critical to stop the click event which will trigger a normal file download!
}
