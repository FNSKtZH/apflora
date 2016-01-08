'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodePopId) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/tpopInsertKopie/popId=' + erstelleIdAusDomAttributId(nodePopId) + '/tpopId=' + erstelleIdAusDomAttributId($(window.apf.tpopNodeKopiert).attr('id')) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'tpop'
    var beschriftung = window.apf.tpopObjektKopiert.TPopFlurname
    if (window.apf.tpopObjektKopiert.TPopNr) {
      beschriftung = window.apf.tpopObjektKopiert.TPopNr + ': ' + window.apf.tpopObjektKopiert.TPopFlurname
    }
    if ($(aktiverNode).attr('id') === nodePopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Die Teilpopulation wurde nicht erstellt')
  })
}
