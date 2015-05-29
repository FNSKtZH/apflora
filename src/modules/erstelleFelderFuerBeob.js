// gibt HTML zurück, mit dem die Informationen über eine Beobachtung dargestellt werden
// erwartet die Daten der Beobachtung

'use strict'

var $ = require('jquery'),
  beobFeldInputText = require('../templates/beobFeldInputText'),
  beobFeldTextarea = require('../templates/beobFeldTextarea')

module.exports = function (data, beobtyp) {
  // Titel für Beob im Formular erstellen
  var beobtitel = '<h1>Informationen aus ',
    htmlBeobfelder,
    nichtAnzuzeigendeFelder = ['NO_ISFS', 'ESPECE', 'CUSTOM_TEXT_5_', 'OBJECTID', 'FNS_GISLAYER', 'FNS_ISFS', 'ID', 'FNS_JAHR', 'NOM_COMPLET', 'FAMILLE']

  if (beobtyp === 'infospezies') {
    beobtitel += 'Info Spezies'
  } else {
    beobtitel += 'EvAB'
  }
  beobtitel += ' (nicht veränderbar)</h1>'
  // Beob-Felder dynamisch aufbauen
  htmlBeobfelder = '<table>'
  $.each(data, function (index, value) {
    if ((value || value === 0) && nichtAnzuzeigendeFelder.indexOf(index) === -1) {
      if (value.toString().length < 70) {
        htmlBeobfelder += beobFeldInputText({index: index, value: value})
      } else {
        console.log('value.length', value.length)
        htmlBeobfelder += beobFeldTextarea({index: index, value: value})
      }
    }
  })
  htmlBeobfelder += '</table>'
  return beobtitel + htmlBeobfelder
}
