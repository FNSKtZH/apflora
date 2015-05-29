// setzt window.apf.tpopmassnber und localStorage.tpopmassnberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function (id) {
  localStorage.tpopmassnberId = id
  $.ajax({
    type: 'get',
    url: 'api/v1/apflora/tabelle=tpopmassnber/feld=TPopMassnBerId/wertNumber=' + id
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data && data[0]) {
      // tpopmassnber bereitstellen
      window.apf.tpopmassnber = data[0]
    }
  })
}
