'use strict'

var _ = require('underscore')
var google = require('google')
var MarkerClusterer = require('MarkerClusterer')
var MarkerWithLabel = require('MarkerWithLabel')
var chToWgsLat = require('../../lib/chToWgsLat')
var chToWgsLng = require('../../lib/chToWgsLng')
var zeigeFormular = require('../zeigeFormular')
var beschrifteTPopMitNrFuerKarte = require('../beschrifteTPopMitNrFuerKarte')
var makeListenerMarkerClick = require('./makeListenerMarkerClick')
var getApiHost = require('../getApiHost')

module.exports = function (tpopListe) {
  var anzTpop,
    infowindow = new google.maps.InfoWindow(),
    tpopBeschriftung,
    lat,
    lng,
    latlng,
    options,
    map,
    bounds,
    markers,
    latlng2,
    marker,
    contentString,
    markerOptions,
    myFlurname

  // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
  zeigeFormular('gMap')
  window.apf.gMap.markersArray = []
  window.apf.gMap.infoWindowArray = []

  // TPopListe bearbeiten:
  // Objekte löschen, die keine Koordinaten haben
  // Lat und Lng ergänzen
  _.each(tpopListe, function (tpop, index) {
    if (tpop.TPopXKoord && tpop.TPopYKoord) {
      tpop.Lat = chToWgsLat(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10))
      tpop.Lng = chToWgsLng(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10))
    } else {
      delete tpopListe[index]
    }
  })

  // TPop zählen
  anzTpop = tpopListe.length

  // Karte mal auf Zürich zentrieren, falls in den TPopListe keine Koordinaten kommen
  // auf die die Karte ausgerichtet werden kann
  lat = 47.383333
  lng = 8.533333
  latlng = new google.maps.LatLng(lat, lng)
  options = {
    zoom: 15,
    center: latlng,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  }

  // ruler.js braucht window.map
  window.apf.gMap.map = window.map = map = new google.maps.Map(document.getElementById('gMapDiv'), options)
  bounds = new google.maps.LatLngBounds()

  // für alle TPop Marker erstellen
  markers = []
  _.each(tpopListe, function (tpop) {
    tpopBeschriftung = beschrifteTPopMitNrFuerKarte(tpop.PopNr, tpop.TPopNr)
    latlng2 = new google.maps.LatLng(tpop.Lat, tpop.Lng)
    if (anzTpop === 1) {
      // map.fitbounds setzt zu hohen zoom, wenn nur eine TPop Koordinaten hat > verhindern
      latlng = latlng2
    } else {
      // Kartenausschnitt um diese Koordinate erweitern
      bounds.extend(latlng2)
    }
    marker = new MarkerWithLabel({
      map: map,
      position: latlng2,
      title: tpopBeschriftung,
      labelContent: tpopBeschriftung,
      labelAnchor: new google.maps.Point(75, 0),
      labelClass: 'MapLabel',
      icon: 'img/flora_icon.png'
    })
    markers.push(marker)
    myFlurname = tpop.TPopFlurname || '(kein Flurname)'
    contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<div id="bodyContent" class="GmInfowindow">' +
      '<h3>' + tpop.Artname + '</h3>' +
      '<p>Population: ' + tpop.PopName + '</p>' +
      '<p>TPop: ' + myFlurname + '</p>' +
      '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>' +
      '<p><a href="#" onclick="window.apf.oeffneTPop(\'' + tpop.TPopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
      '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')">Formular neben der Karte öffnen<\/a></p>' +
      '<p><a href="#" onclick="window.apf.oeffneTPopInNeuemTab(\'' + tpop.TPopId + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
      '</div>' +
      '</div>'
    makeListenerMarkerClick(map, marker, contentString, infowindow)
  })
  markerOptions = {
    maxZoom: 17,
    styles: [{
      height: 53,
      url: '../../../img/m8.png',
      width: 53
    }]
  }

  // globale Variable verwenden, damit ein Klick auf die Checkbox die Ebene einblenden kann
  window.apf.googleKarteDetailplaene = new google.maps.KmlLayer({
    url: getApiHost() + '/kml/rueteren.kml',
    preserveViewport: true
  })
  window.apf.googleKarteDetailplaene.setMap(null)

  new MarkerClusterer(map, markers, markerOptions)
  if (anzTpop === 1) {
    // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
    map.setCenter(latlng)
    map.setZoom(18)
  } else {
    // Karte auf Ausschnitt anpassen
    map.fitBounds(bounds)
  }
}
