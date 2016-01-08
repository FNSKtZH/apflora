'use strict'

var ordneBeobEinerTpopZu = require('../../../ordneBeobEinerTpopZu')

module.exports = function () {
  var beobId = window.localStorage.beobId
  var beobStatus = 'nicht_beurteilt'
  var tpopId = null
  var beobTpopId = null
  var olmapCallback = null
  var jstreeCallback = null

  ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
}
