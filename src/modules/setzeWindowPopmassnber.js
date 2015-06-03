// setzt window.apf.popmassnber und window.localStorage.popmassnberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.popmassnberId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=popmassnber/feld=PopMassnBerId/wertNumber=' + id
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // popmassnber bereitstellen
      window.apf.popmassnber = data[0]
    }
  })
}
