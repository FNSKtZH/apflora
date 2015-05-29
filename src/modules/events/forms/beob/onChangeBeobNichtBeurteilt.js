'use strict'

var ordneBeobEinerTpopZu = require('../../../ordneBeobEinerTpopZu')

module.exports = function () {
  var beobId = localStorage.beobId,
    beobStatus = 'nicht_beurteilt',
    tpopId = null,
    beobTpopId = null,
    olmapCallback = null,
    jstreeCallback = null

  ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
}
