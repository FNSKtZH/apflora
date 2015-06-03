// setzt window.apf.jberUebersicht und window.localStorage.jberUebersichtId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.jberUebersichtId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=apberuebersicht/feld=JbuJahr/wertNumber=' + window.localStorage.jberUebersichtId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // jberUebersicht bereitstellen
      window.apf.jberUebersicht = data[0]
    }
  })
}
