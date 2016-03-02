'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('./erstelleIdAusDomAttributId')
var melde = require('./melde')
var getApiHost = require('./getApiHost')
var erstelleUnterordnerVonPop = require('./jstree/erstelleUnterordnerVonPop')
var erstelleUnterordnerVonTpop = require('./jstree/erstelleUnterordnerVonTpop')

module.exports = function (beobNodeId) {
  console.log('gruendePopAusBeob.js: called with beobNodeId =', beobNodeId)

  // 1. get ap id
  var apId = window.apf.ap.ApArtId
  var popId
  var user = encodeURIComponent(window.sessionStorage.user)
  var tpopId
  var beob = window.apf.beob
  var beobId = erstelleIdAusDomAttributId(beobNodeId)
  // 2. TODO: get koords of beob
  var XKoord = beob.COORDONNEE_FED_E ? beob.COORDONNEE_FED_E : beob.FNS_XGIS
  var YKoord = beob.COORDONNEE_FED_N ? beob.COORDONNEE_FED_N : beob.FNS_YGIS
  var apiHost = getApiHost()

  // 3. create new pop for ap
  $.ajax({
    type: 'post',
    url: apiHost + '/insert/apflora/tabelle=pop/feld=ApArtId/wert=' + apId + '/user=' + user
  }).then(function (newPopId) {
    popId = newPopId
    // 4. give pop koords of beob
    var felder = {
      id: popId,
      user: user,
      PopXKoord: XKoord,
      PopYKoord: YKoord
    }
    return $.ajax({
      type: 'put',
      url: apiHost + '/updateMultiple/apflora/tabelle=pop/felder=' + JSON.stringify(felder)
    })
  }).then(function () {
    // 5. create new tpop for pop
    return $.ajax({
      type: 'post',
      url: apiHost + '/insert/apflora/tabelle=tpop/feld=PopId/wert=' + popId + '/user=' + user
    })
  }).then(function (newTpopId) {
    tpopId = newTpopId
    // 6. give new tpop koords of beob
    var felder = {
      id: tpopId,
      user: user,
      TPopXKoord: XKoord,
      TPopYKoord: YKoord
    }
    return $.ajax({
      type: 'put',
      url: apiHost + '/updateMultiple/apflora/tabelle=tpop/felder=' + JSON.stringify(felder)
    })
  }).then(function () {
    // 7. move beob
    // this assigns it to tpop und updates ui
    var neuerPopNode
    var popOrdnerNode
    var neuerTPopNode
    var tpopOrdnerNode

    // create pop node
    popOrdnerNode = $('#apOrdnerPop' + apId)
    neuerPopNode = $.jstree._reference(popOrdnerNode).create_node(popOrdnerNode, 'last', {
      'data': 'neue Population',
      'attr': {
        'id': popId,
        'typ': 'pop'
      }
    })
    erstelleUnterordnerVonPop(neuerPopNode, popId)

    // create tpop node
    tpopOrdnerNode = $('#tree').find('[typ="popOrdnerTpop"]#' + popId)
    neuerTPopNode = $.jstree._reference(tpopOrdnerNode).create_node(tpopOrdnerNode, 'last', {
      'data': 'neue Teilpopulation',
      'attr': {
        'id': tpopId,
        'typ': 'tpop'
      }
    })
    erstelleUnterordnerVonTpop(neuerTPopNode, tpopId)

    // move beob to top node for beob
    $('#tree').jstree('move_node', '#beob' + beobId, '[typ="tpopOrdnerBeobZugeordnet"]#' + tpopId, 'first')

  }).fail(function (error) {
    melde('Fehler: Die Population wurde nicht geründet. Die Anwendung lieferte folgende Fehlermeldung:', error)
  })
}
