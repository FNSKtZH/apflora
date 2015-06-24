'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('./erstelleIdAusDomAttributId'),
  melde = require('./melde'),
  getApiHost = require('./getApiHost'),
  getAppHost = require('./getAppHost')

module.exports = function (beobNodeId) {
  console.log('gruendePopAusBeob.js: called with beobNodeId =', beobNodeId)

  // 1. get ap id
  var apId = window.apf.ap.ApArtId,
    popId,
    user = encodeURIComponent(window.sessionStorage.user),
    tpopId,
    beob = window.apf.beob,
    beobId = erstelleIdAusDomAttributId(beobNodeId),
    // 2. TODO: get koords of beob,
    XKoord = beob.COORDONNEE_FED_E ? beob.COORDONNEE_FED_E : beob.FNS_XGIS,
    YKoord = beob.COORDONNEE_FED_N ? beob.COORDONNEE_FED_N : beob.FNS_YGIS,
    apiHost = getApiHost()

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
      type: 'post',
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
      type: 'post',
      url: apiHost + '/updateMultiple/apflora/tabelle=tpop/felder=' + JSON.stringify(felder)
    })
  }).then(function () {
    // 7. assign beob to tpop
    // 7.1: insert new row in table beobzuordnung
    return $.ajax({
      type: 'post',
      url: apiHost + '/insert/apflora/tabelle=beobzuordnung/feld=NO_NOTE/wert=' + beobId + '/user=' + user
    })
  }).then(function () {
    // 7.2: update this row
    return $.ajax({
      type: 'post',
      url: apiHost + '/update/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + beobId + '/feld=TPopId/wert=' + tpopId + '/user=' + user
    })
  }).then(function () {
    // 8. update ui
    // create url, example:
    // http://localhost:4000/index.html?ap=100&pop=2146169980&tpop=2146453055&beobZugeordnet=63D291BA-0603-45A1-8380-60D8C39A8C3E
    var url = getAppHost() + '/index.html?ap=' + apId + '&pop=' + popId + '&tpop=' + tpopId + '&beobZugeordnet=' + beobId
    // full reload so the tree rebuilds

    console.log('gruendePopAusBeob.js: url to open', url)

    window.open(url, '_self')
  }).fail(function (error) {
    melde('Fehler: Die Population wurde nicht geründet. Die Anwendung lieferte folgende Fehlermeldung:', error)
  })
}
