'use strict'

var $ = require('jquery')
var zeigeFormular = require('./zeigeFormular')

module.exports = function (anchor) {
  $('#testartDiv').hide()
  $('#formsTitelzeile').hide()
  zeigeFormular('exporte')
  window.history.pushState(null, null, 'index.html?exporte=true')
  if (anchor) {
    window.location.hash = '#' + anchor
  }
}
