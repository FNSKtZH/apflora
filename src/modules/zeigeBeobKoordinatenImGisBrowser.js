'use strict'

var $ = require('jquery')
var melde = require('./melde')

module.exports = function () {
  var url
  var beobfelder_FNS_XGISVal = $('#beobfelder_FNS_XGIS').val()
  var beobfelder_FNS_YGISVal = $('#beobfelder_FNS_YGIS').val()
  var beobfelder_COORDONNEE_FED_EVal = $('#beobfelder_COORDONNEE_FED_E').val()
  var beobfelder_COORDONNEE_FED_NVal = $('#beobfelder_COORDONNEE_FED_N').val()
  var TPopXKoordVal = $('#TPopXKoord').val()
  var TPopYKoordVal = $('#TPopYKoord').val()
  var PopXKoordVal = $('#PopXKoord').val()
  var PopYKoordVal = $('#PopYKoord').val()

  if (beobfelder_FNS_XGISVal && beobfelder_FNS_YGISVal) {
    url = '//www.maps.zh.ch/?x=' + beobfelder_FNS_XGISVal + '&y=' + beobfelder_FNS_YGISVal + '&scale=3000&markers=ring'
    window.open(url, 'target="_blank"')
  } else if (beobfelder_COORDONNEE_FED_EVal && beobfelder_COORDONNEE_FED_NVal) {
    url = '//www.maps.zh.ch/?x=' + beobfelder_COORDONNEE_FED_EVal + '&y=' + beobfelder_COORDONNEE_FED_NVal + '&scale=3000&markers=ring'
    window.open(url, 'target="_blank"')
  } else if (TPopXKoordVal && TPopYKoordVal) {
    url = '//www.maps.zh.ch/?x=' + TPopXKoordVal + '&y=' + TPopYKoordVal + '&scale=3000&markers=ring'
    window.open(url, 'target="_blank"')
  } else if (PopXKoordVal && PopYKoordVal) {
    url = '//www.maps.zh.ch/?x=' + PopXKoordVal + '&y=' + PopYKoordVal + '&scale=3000&markers=ring'
    window.open(url, 'target="_blank"')
  } else {
    melde('Fehler: Keine Koordinaten zum Anzeigen', 'Aktion abgebrochen')
  }
}
