// setzt window.apf.ber und window.localStorage.berId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function (id) {
  window.localStorage.berId = id
  $.ajax({
    type: 'get',
    url: '/api/v1/apflora/tabelle=ber/feld=BerId/wertNumber=' + window.localStorage.berId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      data = data[0]
      // ber bereitstellen
      window.apf.ber = data
    }
  })
}
