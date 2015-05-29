'use strict'

var removeruler = require('removeruler')

module.exports = function (event) {
  event.preventDefault()
  removeruler()
}
