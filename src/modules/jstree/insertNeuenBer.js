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
    url: getApiHost() + '/insert/apflora/tabelle=ber/feld=ApArtId/wert=' + erstelleIdAusDomAttributId(nodeApId) + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function (id) {
    var strukturtyp = 'ber'
    var beschriftung = 'neuer Bericht'

    console.log('$(aktiverNode).attr("id"): ', $(aktiverNode).attr('id'))
    console.log('nodeApId: ', nodeApId)

    if (erstelleIdAusDomAttributId($(aktiverNode).attr('id')) === nodeApId) {
      insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    } else {
      insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung)
    }
  }).fail(function () {
    melde('Fehler: Keinen neuen Bericht erstellt')
  })
}
