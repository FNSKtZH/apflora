// wird offenbar momentan nicht verwendet

'use strict'

var $ = require('jquery')
var _ = require('underscore')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./jstree/insertNeuenNodeAufGleicherHierarchiestufe')
var erstelleIdAusDomAttributId = require('./erstelleIdAusDomAttributId')
var melde = require('./melde')
var pruefeSchreibvoraussetzungen = require('./pruefeSchreibvoraussetzungen')
var getApiHost = require('./getApiHost')

module.exports = function (aktiverNode, parentNode) {
  var data = {}

  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  // drop kennt den parent nicht
  if (!parentNode) {
    parentNode = $.jstree._reference(aktiverNode)._get_parent(aktiverNode)
  }
  // User und neue PopId mitgeben
  data.MutWer = window.sessionStorage.user
  data.PopId = erstelleIdAusDomAttributId($(parentNode).attr('id'))
  // die alten id's entfernen
  delete window.apf.tpopObjektKopiert.PopId
  delete window.apf.tpopObjektKopiert.TPopId
  // das wird gleich neu gesetzt, alte Werte verwerfen
  delete window.apf.tpopObjektKopiert.MutWann
  delete window.apf.tpopObjektKopiert.MutWer
  // alle verbliebenen Felder an die url hängen
  _.each(window.apf.tpopObjektKopiert, function (value, key) {
    // Nullwerte ausschliessen
    if (value !== null) {
      data[key] = value
    }
  })
  // und an die DB schicken
  $.ajax({
    type: 'post',
    url: getApiHost() + '/tpopInsertKopie/popId=' + data.PopId + '/tpopId=' + erstelleIdAusDomAttributId($(window.apf.tpopNodeKopiert).attr('id')) + '/user=' + data.MutWer
  }).done(function (tpopId) {
    var strukturtyp = 'tpop'
    var beschriftung = window.apf.tpopObjektKopiert.TPopNr + ' ' + window.apf.tpopObjektKopiert.TPopFlurname

    insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, tpopId, beschriftung)
  }).fail(function () {
    melde('Fehler: Die Teilpopulation wurde nicht erstellt')
  })
}
