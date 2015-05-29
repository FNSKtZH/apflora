/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var ordneBeobEinerTpopZu = require('../../../ordneBeobEinerTpopZu')

module.exports = function () {
  var beobId = localStorage.beobId,
    beobStatus = 'nicht_zuordnen',
    tpopId = null,
    beobTpopId = null,
    olmapCallback = null,
    jstreeCallback = null

  ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
}
