'use strict'

var $ = require('jquery'),
  waehleAp = require('../../waehleAp')

module.exports = function () {
  waehleAp()
  $('#apWaehlenText').focus()
}
