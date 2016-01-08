'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer')
var insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode, nodeApId) {
  $.ajax({
    type: 'post',
    url: getApiHost() + '/popInsertKopie/apId=' + erstelleIdAusDomAttributId(nodeApId) + '/popId=' + erstelleIdAusDomAttributId($(window.apf.popNodeKopiert).attr('id')) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'pop'
    var beschriftung = window.apf.popObjektKopiert.PopName
    if (window.apf.popObjektKopiert.PopNr) {
      beschriftung = window.apf.popObjektKopiert.PopNr + ': ' + window.apf.popObjektKopiert.PopName
    }
    if ($(aktiverNode).attr('id') === nodeApId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Die Teilpopulation wurde nicht erstellt')
  })
}
