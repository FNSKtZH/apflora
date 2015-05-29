'use strict'

var setzeKartenhoehe = require('../setzeKartenhoehe'),
  setzeTreehoehe = require('../jstree/setzeTreehoehe')

module.exports = function () {
  setzeTreehoehe()
  // Karten sollen ca. Bildschirmhöhe haben
  // da Formulare so hoch wie der Inhalt sind, muss die Kartenhöhe manuell eingestellt werden
  setzeKartenhoehe()
}
