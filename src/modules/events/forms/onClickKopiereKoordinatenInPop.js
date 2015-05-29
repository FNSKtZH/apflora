'use strict'

var $ = require('jquery'),
  kopiereKoordinatenInPop = require('../../kopiereKoordinatenInPop')

module.exports = function () {
  kopiereKoordinatenInPop($('#TPopXKoord').val(), $('#TPopYKoord').val())
}
