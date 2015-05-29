// Formulare als dialog öffnen
// braucht die id des Formulars
// und die id des Datensatzes, der anzuzeigen ist

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  initiiereBeob = require('./initiiereBeob')

module.exports = function (formularname, id, statusZuordnung) {
  var $formularname = $('#' + formularname),
    title,
    beobTyp,
    formWidth = 600

  // id setzen
  localStorage[formularname + 'Id'] = id

  // titel bestimmen
  switch (formularname) {
    case 'pop':
      title = 'Population'
      // formular initiieren, ohne anzuzeigen
      require('./initiierePop')(null, id, true)
      break
    case 'tpop':
      title = 'Teilpopulation'
      // formular initiieren, ohne anzuzeigen
      require('./initiiereTpop')(null, null, id, true)
      break
    case 'beob':
      title = 'Beobachtung'
      beobTyp = (isNaN(id) ? 'evab' : 'infospezies')
      // formular initiieren, ohne anzuzeigen
      initiiereBeob(beobTyp, id, statusZuordnung, true)
      break
    default:
      title = ''
  }

  // dialog öffnen
  $formularname.dialog({
    close: function () {
      $formularname.dialog('destroy')
    },
    width: formWidth,
    maxHeight: $('#menu').height(),
    resizable: true,
    position: {
      my: 'left top',
      at: 'left top',
      of: $('#menu')
    },
    title: title
  })
  $formularname.dialog('open')
}
