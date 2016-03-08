'use strict'

module.exports = function (beob) {
  var initiiereBeob = require('./initiiereBeob')
  var oeffneTPopBeob = require('./oeffneTPopBeob')
  var beobStatus
  var beobTyp

  if (typeof beob === 'number' || typeof beob === 'string') {
    // die TPopId wurde übergeben
    oeffneTPopBeob(beob)
    return
  }

  beobStatus = beob.BeobNichtZuordnen ? 'nicht_zuzuordnen' : 'nicht_beurteilt'

  beobTyp = isNaN(beob.NO_NOTE) ? 'evab' : 'infospezies'

  window.localStorage.beobtyp = beobTyp
  initiiereBeob(beobTyp, beob.NO_NOTE, beobStatus)
}
