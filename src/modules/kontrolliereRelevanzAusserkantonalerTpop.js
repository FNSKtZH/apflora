'use strict'

var $ = require('jquery')
var isPointInsidePolygon = require('./isPointInsidePolygon')
var zhGeojson = require('../../geojson/ktZh.json')
var melde = require('./melde')
var getApiHost = require('./getApiHost')

module.exports = function () {
  var qsList = window.apf.qsList

  // get list of tpop's of this window.localStorage.apId
  return $.ajax({
    type: 'get',
    url: getApiHost() + '/tpopKoordFuerProgramm/apId=' + window.localStorage.apId
  }).done(function (data) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (data) {
      data.forEach(function (tpop) {
        if (tpop.TPopApBerichtRelevant === 1 && !isPointInsidePolygon(zhGeojson, tpop.TPopXKoord, tpop.TPopYKoord)) {
          // diese tpop liegt ausserhalb des Kantons, daher sollte sie nicht relevant sein
          // von qsList benötigte Daten anfügen
          tpop.hw = "Teilpopulation ist als 'Für AP-Bericht relevant' markiert, liegt aber ausserhalb des Kt. Zürich und sollte daher nicht relevant sein:"
          tpop.link = "<a href='https://apflora.ch/index.html?ap=" + tpop.ApArtId + '&pop=' + tpop.PopId + '&tpop=' + tpop.TPopId + "' target='_blank'>Pop: "
          if (tpop.PopNr >= 0) {
            tpop.link += 'Pop: ' + tpop.PopNr
          } else {
            tpop.link += 'Pop: id=' + tpop.PopId
          }
          if (tpop.TPopNr >= 0) {
            tpop.link += ' > TPop: ' + tpop.TPopNr
          } else {
            tpop.link += ' > TPop: id=' + tpop.TPopId
          }
          tpop.link += '</a>'
          // an qsList anfügen
          qsList.add(tpop)
          $('#tree').jstree('rename_node', '#qualitaetskontrollen' + window.localStorage.apId, 'Qualitätskontrollen (' + qsList.items.length + ')')
          return true
        }
      })
    }
  }).fail(e => e)
}
