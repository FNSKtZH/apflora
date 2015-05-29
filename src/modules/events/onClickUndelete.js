/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var undeleteDatensatz = require('../undeleteDatensatz')

module.exports = function (event) {
  event.preventDefault()
  undeleteDatensatz()
}
