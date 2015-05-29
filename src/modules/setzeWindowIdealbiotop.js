// setzt window.apf.idealbiotop und window.localStorage.idealbiotopId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function (id) {
  window.localStorage.idealbiotopId = id
  $.ajax({
    type: 'get',
    url: '/api/v1/apflora/tabelle=idealbiotop/feld=IbApArtId/wertNumber=' + window.localStorage.idealbiotopId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // idealbiotop bereitstellen
      window.apf.idealbiotop = data[0]
    }
  })
}
