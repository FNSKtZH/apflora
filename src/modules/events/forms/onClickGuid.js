/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function () {
  var successful = false
  var msg
  var $guidRueckmeldung = $('.js-guidRueckmeldung')

  // die GUIDS sollen einfach kopiert werden können
  $(this).select()

  // falls möglich direkt kopieren
  if (document.queryCommandSupported('copy')) {
    try {
      // Now that we've selected the text, execute the copy command
      successful = document.execCommand('copy')
      if (successful) {
        $guidRueckmeldung.fadeIn('slow')
        setTimeout(function () {
          $guidRueckmeldung.fadeOut('slow')
        }, 3000)
      }
    } catch (err) {
      console.log('Oops, unable to copy')
    }
  }
}
