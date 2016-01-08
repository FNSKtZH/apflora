'use strict'

var $ = require('jquery')
var waehleAp = require('../../waehleAp')

module.exports = function () {
  waehleAp()
  $('#apWaehlenText').focus()
}
