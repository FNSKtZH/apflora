// Formulare als dialog öffnen
// braucht die id des Formulars
// und die id des Datensatzes, der anzuzeigen ist

'use strict'

var $ = require('jquery')

module.exports = function (formularname, id, statusZuordnung) {
  var $formularname = $('#' + formularname)
  var title
  var beobTyp
  var formWidth = 600

  // id setzen
  window.localStorage[formularname + 'Id'] = id

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
