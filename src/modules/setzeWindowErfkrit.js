// setzt window.apf.erfkrit und window.localStorage.erfkritId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function (id) {
  window.localStorage.erfkritId = id
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=erfkrit/feld=ErfkritId/wertString=' + window.localStorage.erfkritId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // erfkrit bereitstellen
      window.apf.erfkrit = data[0]
    }
  })
}
