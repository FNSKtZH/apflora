// setzt window.apf.pop und window.localStorage.popId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.popId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/apflora/tabelle=pop/feld=PopId/wertNumber=' + window.localStorage.popId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // pop bereitstellen
      window.apf.pop = data[0]
    }
  })
}
