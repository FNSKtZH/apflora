/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var removeruler = require('removeruler')

module.exports = function (event) {
  event.preventDefault()
  removeruler()
}
