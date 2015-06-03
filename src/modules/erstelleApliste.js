'use strict'

var $ = require('jquery'),
  setzeAutocompleteFuerApliste = require('./setzeAutocompleteFuerApliste'),
  getApiHost = require('./getApiHost')

module.exports = function (programm, callback) {
  window.apf.apliste = window.apf.apliste || {}

  // sicherstellen, dass ein Programm übergeben wurde
  if (!programm) {
    return
  }

  // nur machen, wenn window.apf.apliste noch nicht existiert
  if (!window.apf.apliste[programm]) {
    $.ajax({
      type: 'get',
      url: getApiHost() + '/api/v1/apliste/programm=' + programm
    }).done(function (data) {
      // die Daten werden später benötigt > globale Variable erstellen
      window.apf.apliste[programm] = data
      setzeAutocompleteFuerApliste(programm)
      if (callback) {
        callback()
      }
    })
  } else {
    setzeAutocompleteFuerApliste(programm)
    if (callback) {
      callback()
    }
  }
}
