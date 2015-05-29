'use strict'

var waehleAp = require('../../waehleAp')

module.exports = function () {
  var value = this.value || window.localStorage.apId
  waehleAp(value)
}
