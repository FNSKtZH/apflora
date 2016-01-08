'use strict'

var $ = require('jquery')
var aktualisiereKoordinatenVonTPop = require('../aktualisiereKoordinatenVonTPop')
var melde = require('../melde')

module.exports = function () {
  var beobfelder_FNS_XGISVal = $('#beobfelder_FNS_XGIS').val()
  var beobfelder_FNS_YGISVal = $('#beobfelder_FNS_YGIS').val()
  var beobfelder_COORDONNEE_FED_EVal = $('#beobfelder_COORDONNEE_FED_E').val()
  var beobfelder_COORDONNEE_FED_NVal = $('#beobfelder_COORDONNEE_FED_N').val()
  var tpop

  tpop = {}
  tpop.TPopId = window.apf.tpop.TPopId

  if (beobfelder_FNS_XGISVal && beobfelder_FNS_YGISVal) {
    tpop.TPopXKoord = beobfelder_FNS_XGISVal
    tpop.TPopYKoord = beobfelder_FNS_YGISVal
  } else if (beobfelder_COORDONNEE_FED_EVal && beobfelder_COORDONNEE_FED_NVal) {
    tpop.TPopXKoord = beobfelder_COORDONNEE_FED_EVal
    tpop.TPopYKoord = beobfelder_COORDONNEE_FED_NVal
  } else {
    melde('Fehler: Keine Koordinaten zum übertragen', 'Aktion abgebrochen')
    return
  }

  $('#uebertrageBeobZugeordnetKoordInTPopDialog').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      'ja': function () {
        $(this).dialog('close')
        aktualisiereKoordinatenVonTPop(tpop)
      },
      'nein': function () {
        $(this).dialog('close')
      }
    }
  })
}
