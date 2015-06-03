// setzt window.apf.tpopmassn und window.localStorage.tpopmassnId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

'use strict'

var $ = require('jquery'),
  getApiHost = require('./getApiHost')

module.exports = function (id) {
  window.localStorage.tpopmassnId = id
  $.ajax({
    type: 'get',
    url: getApiHost() + '/apflora/tabelle=tpopmassn/feld=TPopMassnId/wertNumber=' + id
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // tpopmassn bereitstellen
      window.apf.tpopmassn = data[0]
    }
  })
}
