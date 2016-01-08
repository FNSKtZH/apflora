'use strict'

var $ = require('jquery')
var ordneBeobEinerTpopZu = require('../../../ordneBeobEinerTpopZu')

module.exports = function () {
  var beobId = window.localStorage.beobId
  var tpopId = $(this).val()
  var beobTpopId

  beobTpopId = window.apf.beob.zuordnung && window.apf.beob.zuordnung.TPopId ? window.apf.beob.zuordnung.TPopId : null

  ordneBeobEinerTpopZu(beobId, 'zugeordnet', tpopId, beobTpopId)
}
