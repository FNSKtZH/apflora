'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var erstelleLabelFuerMassnahme = require('../erstelleLabelFuerMassnahme')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassnNodeKopiert).attr('id')) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'tpopmassn',
      beschriftung = erstelleLabelFuerMassnahme(window.apf.tpopmassnObjektKopiert.TPopMassnJahr, window.apf.tpopmassnObjektKopiert.TPopMassnBerErfolgsbeurteilungTxt)
    if ($(aktiverNode).attr('id') === nodeTpopId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Die Massnahme wurde nicht erstellt')
  })
}
