/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  kopiereKoordinatenInPop = require('../../kopiereKoordinatenInPop')

module.exports = function () {
  kopiereKoordinatenInPop($('#TPopXKoord').val(), $('#TPopYKoord').val())
}
