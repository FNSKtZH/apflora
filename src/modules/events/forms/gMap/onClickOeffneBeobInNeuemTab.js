'use strict'

var $ = require('jquery'),
  oeffneBeobInNeuemTab = require('../../../oeffneBeobInNeuemTab')

module.exports = function (event) {
  event.preventDefault(event)
  oeffneBeobInNeuemTab($(this).data('beob'))
}
