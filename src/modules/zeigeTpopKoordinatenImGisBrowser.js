'use strict'

var $ = require('jquery')
var melde = require('./melde')

module.exports = function () {
  var url
  var TPopXKoordVal = $('#TPopXKoord').val()
  var TPopYKoordVal = $('#TPopYKoord').val()
  var PopXKoordVal = $('#PopXKoord').val()
  var PopYKoordVal = $('#PopYKoord').val()

  if (TPopXKoordVal && TPopYKoordVal) {
    url = '//www.maps.zh.ch/?x=' + TPopXKoordVal + '&y=' + TPopYKoordVal + '&scale=3000&markers=ring'
    window.open(url, 'target="_blank"')
  } else if (PopXKoordVal && PopYKoordVal) {
    url = '//www.maps.zh.ch/?x=' + PopXKoordVal + '&y=' + PopYKoordVal + '&scale=3000&markers=ring'
    window.open(url, 'target="_blank"')
  } else {
    melde('Fehler: Keine Koordinaten zum Anzeigen', 'Aktion abgebrochen')
  }
}
