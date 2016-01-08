'use strict'

var $ = require('jquery')
var oeffneBeob = require('../../../oeffneBeob')

module.exports = function (event) {
  event.preventDefault()
  oeffneBeob($(this).data('beob'))
}
