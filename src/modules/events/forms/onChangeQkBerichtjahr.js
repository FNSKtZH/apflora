'use strict'

var $ = require('jquery'),
  kontrolliereProgramm = require('../../kontrolliereProgramm')

module.exports = function (event) {
  kontrolliereProgramm($(event.target).val())
}
