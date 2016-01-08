'use strict'

var $ = require('jquery')
var kontrolliereProgramm = require('../../kontrolliereProgramm')

module.exports = function (event) {
  kontrolliereProgramm($(event.target).val())
}
