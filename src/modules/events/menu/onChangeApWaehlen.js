'use strict'

var waehleAp = require('../../waehleAp')

module.exports = function () {
  var value = this.value || localStorage.apId
  waehleAp(value)
}
