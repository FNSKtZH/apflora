'use strict'

var $ = require('jquery')
var kopiereKoordinatenInPop = require('../../kopiereKoordinatenInPop')

module.exports = function () {
  kopiereKoordinatenInPop($('#TPopXKoord').val(), $('#TPopYKoord').val())
}
