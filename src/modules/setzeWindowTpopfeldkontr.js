// setzt window.apf.tpopfeldkontr und window.localStorage.tpopfeldkontrId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery')
var getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.tpopfeldkontrId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpopkontr/feld=TPopKontrId/wertNumber=' + id
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // tpopfeldkontr bereitstellen
      window.apf.tpopfeldkontr = data[0]
    }
  })
}
