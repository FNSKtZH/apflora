// setzt window.apf.zielber und window.localStorage.zielberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery')
var getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.zielberId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=zielber/feld=ZielBerId/wertString=' + window.localStorage.zielberId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // zielber bereitstellen
      window.apf.zielber = data[0]
    }
  })
}
