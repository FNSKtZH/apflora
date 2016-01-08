'use strict'

var $ = require('jquery')
var google = require('google')
var chToWgsLng = require('../../lib/chToWgsLng')
var chToWgsLat = require('../../lib/chToWgsLat')
var zeigeFormular = require('../zeigeFormular')
var setLocationTPop = require('./setLocationTPop')
var erstelleMarker = require('./erstelleMarker')
var beschrifteTPopMitNrFuerKarte = require('../beschrifteTPopMitNrFuerKarte')

module.exports = function (tpop) {
  var infowindow = new google.maps.InfoWindow(),
    lat,
    lng,
    latlng,
    zoomLevel,
    options,
    map,
    mapCanvas = $('#gMapDiv'),
    verorted,
    marker,
    contentString,
    tpopBeschriftung,
    myFlurname

  window.apf.gMap.markersArray = []

  // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
  zeigeFormular('gMap')

  // Optionen für die Anzeige
  if (tpop && tpop.TPopXKoord && tpop.TPopYKoord) {
    // Wenn Koordinaten vorhanden, Lat und Lng ergänzen
    lat = chToWgsLat(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10))
    lng = chToWgsLng(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10))
    zoomLevel = 15
    verorted = true
  } else {
    // sonst auf Zürich zentrieren
    lat = 47.360566
    lng = 8.542829
    zoomLevel = 12
    verorted = false
  }
  latlng = new google.maps.LatLng(lat, lng)
  options = {
    zoom: zoomLevel,
    center: latlng,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  }

  // Karte gründen. ruler.js braucht window.map
  window.apf.gMap.map = window.map = map = new google.maps.Map(mapCanvas[0], options)

  if (verorted) {
    // marker erstellen
    tpopBeschriftung = beschrifteTPopMitNrFuerKarte(tpop.PopNr, tpop.TPopNr)
    marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: tpopBeschriftung,
      icon: 'img/flora_icon_rot.png',
      draggable: true
    })
    // Marker in Array speichern, damit er gelöscht werden kann
    window.apf.gMap.markersArray.push(marker)

    // infowindow erstellen
    myFlurname = tpop.TPopFlurname || '(kein Flurname)'
    contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<div id="bodyContent" class="GmInfowindow">' +
      '<h3>' + myFlurname + '</h3>' +
      '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>' +
      '<p><a href="#" onclick="window.apf.oeffneTPop(\'' + tpop.TPopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
      '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')">Formular neben der Karte öffnen<\/a></p>' +
      '<p><a href="#" onclick="window.apf.oeffneTPopInNeuemTab(\'' + tpop.TPopId + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
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
    google.maps.event.addListener(marker, 'dragend', function (event) {
      setLocationTPop(event.latLng, map, marker, tpop)
    })
  }

  // listener bei klick in Karte
  // entfernt bestehenden marker, erstellt neuen und aktualisiert Koordinaten
  google.maps.event.addListener(map, 'click', function (event) {
    erstelleMarker(event.latLng, map, marker, tpop)
  })
}
