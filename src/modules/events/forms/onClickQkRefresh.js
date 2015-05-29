/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  kontrolliereProgramm = require('../../kontrolliereProgramm')

module.exports = function (event) {
  event.preventDefault()
  kontrolliereProgramm($('#qkBerichtjahr').val())
}
