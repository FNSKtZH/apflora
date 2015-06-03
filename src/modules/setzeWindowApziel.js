// setzt window.apf.apziel und window.localStorage.apzielId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.apzielId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=ziel/feld=ZielId/wertNumber=' + window.localStorage.apzielId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // apziel bereitstellen
      window.apf.apziel = data[0]
    }
  })
}
