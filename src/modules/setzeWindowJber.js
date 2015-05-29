// setzt window.apf.jber und window.localStorage.jberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function (id) {
  window.localStorage.jberId = id
  $.ajax({
    type: 'get',
    url: '/api/v1/apflora/tabelle=apber/feld=JBerId/wertNumber=' + window.localStorage.jberId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // jber bereitstellen
      window.apf.jber = data[0]
    }
  })
}
