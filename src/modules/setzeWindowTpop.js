// setzt window.apf.tpop und window.localStorage.tpopId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery')
var getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.tpopId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpop/feld=TPopId/wertNumber=' + window.localStorage.tpopId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // tpop bereitstellen
      window.apf.tpop = data[0]
    }
  })
}
