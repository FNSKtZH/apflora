/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')

module.exports = function (aktiverNode) {
  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) { return }
  window.apf.tpopfreiwkontrNodeAusgeschnitten = aktiverNode
  // es macht keinen Sinn mehr, den kopierten node zu behalten
  // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
  delete window.apf.tpopfreiwkontrNodeKopiert
  delete window.apf.tpopfreiwkontrObjektKopiert
}
