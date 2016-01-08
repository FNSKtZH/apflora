'use strict'

var ol = require('ol')
var tpopContent = require('../../templates/olMap/popupTpop')
var erstelleTPopNrLabel = require('../erstelleTPopNrLabel')

module.exports = function (tpop) {
  return new ol.Feature({
    geometry: new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]),
    tpopNr: tpop.TPopNr,
    popNr: tpop.PopNr,
    tpopNrLabel: erstelleTPopNrLabel(tpop.PopNr, tpop.TPopNr),
    tpopName: tpop.TPopFlurname || '(kein Name)',
    name: erstelleTPopNrLabel(tpop.PopNr, tpop.TPopNr), // brauchts das noch? TODO: entfernen
    popupContent: tpopContent(tpop),
    popupTitle: tpop.Artname,
    // koordinaten werden benötigt damit das popup am richtigen Ort verankert wird
    xkoord: tpop.TPopXKoord,
    ykoord: tpop.TPopYKoord,
    myTyp: 'tpop',
    myId: tpop.TPopId
  })
}
