// setzt window.apf.tpopmassnber und window.localStorage.tpopmassnberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.tpopmassnberId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpopmassnber/feld=TPopMassnBerId/wertNumber=' + id
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // tpopmassnber bereitstellen
      window.apf.tpopmassnber = data[0]
    }
  })
}
