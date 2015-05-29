// setzt window.apf.assozarten und window.localStorage.assozartenId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery')

module.exports = function (id) {
  window.localStorage.assozartenId = id
  $.ajax({
    type: 'get',
    url: '/api/v1/apflora/tabelle=assozart/feld=AaId/wertNumber=' + window.localStorage.assozartenId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data) {
      // assozarten bereitstellen
      window.apf.assozarten = data
    }
  })
}
