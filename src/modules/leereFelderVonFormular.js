// leert alle Felder und stellt ihre Breite ein

'use strict'

var $ = require('jquery')

module.exports = function (formular) {
  $('#' + formular).find('input[type="text"]').each(function () {
    $(this).val('')
  })
  $('#' + formular).find('input[type="date"]').each(function () {
    $(this).val('')
  })
  $('#' + formular).find('input[type="radio"]:checked').each(function () {
    $(this).prop('checked', false)
  })
  $('#' + formular).find('select').each(function () {
    $(this).val('')
  })
}
