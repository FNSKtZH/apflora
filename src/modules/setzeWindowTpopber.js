// setzt window.apf.tpopber und window.localStorage.tpopberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery')

module.exports = function (id) {
  window.localStorage.tpopberId = id
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=tpopber/feld=TPopBerId/wertNumber=' + id
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // tpopber bereitstellen
      window.apf.tpopber = data[0]
    }
  })
}
