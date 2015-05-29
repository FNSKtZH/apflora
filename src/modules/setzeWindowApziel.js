// setzt window.apf.apziel und window.localStorage.apzielId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function (id) {
  window.localStorage.apzielId = id
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=ziel/feld=ZielId/wertNumber=' + window.localStorage.apzielId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // apziel bereitstellen
      window.apf.apziel = data[0]
    }
  })
}
