'use strict'

var $ = require('jquery')
var kontrolliereProgramm = require('../../kontrolliereProgramm')

module.exports = function (event) {
  event.preventDefault()
  kontrolliereProgramm($('#qkBerichtjahr').val())
}
