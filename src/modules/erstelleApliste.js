'use strict'

var $ = require('jquery')
var setzeAutocompleteFuerApliste = require('./setzeAutocompleteFuerApliste')
var setzeAutocompleteFuerEwmsApliste = require('./setzeAutocompleteFuerEwmsApliste')
var getApiHost = require('./getApiHost')

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
      url: getApiHost() + '/apliste/programm=' + programm
    }).done(function (data) {
      // die Daten werden später benötigt > globale Variable erstellen
      window.apf.apliste[programm] = data
      setzeAutocompleteFuerApliste(programm)
      setzeAutocompleteFuerEwmsApliste(programm)
      if (callback) {
        callback()
      }
    })
  } else {
    setzeAutocompleteFuerApliste(programm)
    setzeAutocompleteFuerEwmsApliste(programm)
    if (callback) {
      callback()
    }
  }
}
