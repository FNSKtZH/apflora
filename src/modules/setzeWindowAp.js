// setzt window.apf und window.localStorage.apId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.apId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/ap=' + window.localStorage.apId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // ap bereitstellen
      window.apf.ap = data[0]
    }
  })
}
