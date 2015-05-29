/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var addruler = require('addruler')

module.exports = function (event) {
  event.preventDefault()
  addruler()
}
