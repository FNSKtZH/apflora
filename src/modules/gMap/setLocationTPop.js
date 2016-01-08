'use strict'

var $ = require('jquery')
var google = require('google')
var ddInChY = require('../../lib/ddInChY')
var ddInChX = require('../../lib/ddInChX')
var melde = require('../melde')
var clearInfoWindows = require('./clearInfoWindows')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')
var getApiHost = require('../getApiHost')

module.exports = function (latLng, map, marker, tpop) {
  var lat,
    lng,
    contentString,
    infowindow,
    title,
    X,
    Y

  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) { return }

  title = (tpop && tpop.TPopFlurname ? tpop.TPopFlurname : 'neue Teilpopulation')
  lat = latLng.lat()
  lng = latLng.lng()
  X = ddInChY(lat, lng)
  Y = ddInChX(lat, lng)

  $.ajax({
    type: 'post',
    url: getApiHost() + '/update/apflora/tabelle=tpop/tabelleIdFeld=TPopId/tabelleId=' + window.localStorage.tpopId + '/feld=TPopXKoord/wert=' + X + '/user=' + encodeURIComponent(window.sessionStorage.user)
  }).done(function () {
    $.ajax({
      type: 'post',
      url: getApiHost() + '/update/apflora/tabelle=tpop/tabelleIdFeld=TPopId/tabelleId=' + window.localStorage.tpopId + '/feld=TPopYKoord/wert=' + Y + '/user=' + encodeURIComponent(window.sessionStorage.user)
    }).done(function () {
      clearInfoWindows()
      contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<div id="bodyContent" class="GmInfowindow">' +
        '<h3>' + title + '</h3>' +
        '<p>Koordinaten: ' + X + ' / ' + Y + '</p>' +
        '<p><a href="#" onclick="window.apf.oeffneTPop(\'' + window.localStorage.tpopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'tpop\', ' + window.localStorage.tpopId + ')">Formular neben der Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneTPopInNeuemTab(\'' + window.localStorage.tpopId + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
        '</div>' +
        '</div>'
      infowindow = new google.maps.InfoWindow({
        content: contentString
      })
      window.apf.gMap.infoWindowArray = window.apf.gMap.infoWindowArray || []
      window.apf.gMap.infoWindowArray.push(infowindow)
      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker)
      })
    }).fail(function () {
      melde('Fehler: Die Y-Koordinate wurde nicht übernommen (die X-Koordinate offenbar schon)')
    })
  }).fail(function () {
    melde('Fehler: Die Koordinaten wurden nicht übernommen')
  })
}
