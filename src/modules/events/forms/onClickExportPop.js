'use strict'

var _ = require('underscore'),
  downloadFileFromView = require('../../downloadFileFromView'),
  downloadFileFromViewWehreIdIn = require('../../downloadFileFromViewWehreIdIn')

module.exports = function () {
  // wenn pop ausgewählt, diese übergeben
  var popIdListe = ''
  if (window.apf.olMap.popSelected) {
    _.each(window.apf.olMap.popSelected, function (pop, index) {
      popIdListe += pop.get('myId')
      if (index + 1 < window.apf.olMap.popSelected.length) {
        popIdListe += ','
      }
    })
    downloadFileFromViewWehreIdIn('v_pop', 'PopId', popIdListe, 'Populationen', 'csv')
  } else {
    downloadFileFromView('v_pop', 'Populationen')
  }
  return false; // this is critical to stop the click event which will trigger a normal file download!
}
