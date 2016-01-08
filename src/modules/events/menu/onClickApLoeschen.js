'use strict'

var $ = require('jquery')
var loescheAp = require('../../loescheAp')

module.exports = function () {
  var $apWaehlen = $('#apWaehlen')
  if (!$apWaehlen.val()) {
    $('#Meldung')
      .html('Bitte wählen Sie vor dem Löschen ein Artförderprogramm')
      .dialog({
        modal: true,
        buttons: {
          Ok: function () {
            $(this).dialog('close')
          }
        }
      })
  } else {
    $('#Meldung')
      .html('Wollen Sie das Artförderprogramm für "' + $('#apWaehlenText').val() + '" wirklich löschen?')
      .dialog({
        modal: true,
        width: 500,
        buttons: {
          ja: function () {
            loescheAp(window.localStorage.apId)
            $(this).dialog('close')
          },
          nein: function () {
            $(this).dialog('close')
          }
        }
      })
  }
}
