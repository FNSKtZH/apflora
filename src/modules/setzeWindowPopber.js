// setzt window.apf.popber und window.localStorage.popberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.popberId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/api/v1/apflora/tabelle=popber/feld=PopBerId/wertNumber=' + id
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // popber bereitstellen
      window.apf.popber = data[0]
    }
  })
}
