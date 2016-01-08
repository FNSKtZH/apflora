'use strict'

var ordneBeobEinerTpopZu = require('../../../ordneBeobEinerTpopZu')

module.exports = function () {
  var beobId = window.localStorage.beobId
  var beobStatus = 'nicht_zuordnen'
  var tpopId = null
  var beobTpopId = null
  var olmapCallback = null
  var jstreeCallback = null

  window.localStorage.beobStatus = beobStatus
  ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
}
