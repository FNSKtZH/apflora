'use strict'

var $ = require('jquery')
var _ = require('underscore')
var google = require('google')
var MarkerWithLabel = require('MarkerWithLabel')
var MarkerClusterer = require('MarkerClusterer')
var chToWgsLat = require('../../lib/chToWgsLat')
var chToWgsLng = require('../../lib/chToWgsLng')
var zeigeFormular = require('../zeigeFormular')
var beschrifteTPopMitNrFuerKarte = require('../beschrifteTPopMitNrFuerKarte')
var makeListenerMarkerClick = require('./makeListenerMarkerClick')
var makeListenerBeobMarkerDragend = require('./makeListenerBeobMarkerDragend')

module.exports = function (beobListe, tpopListe) {
  var anzBeob
  var anzTpop
  var infowindowBeob = new google.maps.InfoWindow()
  var infowindowTpop = new google.maps.InfoWindow()
  var lat
  var lng
  var latlng
  var options
  var map
  var bounds
  var markersTpop
  var latlng2
  var marker_beob
  var marker_tpop
  var contentstringBeob
  var contentstringTpop
  var markerOptionsTpop
  var datum
  var titelBeob
  var tpopBeschriftung
  var aNote
  var myFlurname
  var autor
  var projekt
  var ort

  // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
  zeigeFormular('gMap')
  window.apf.gMap.markersArray = []
  window.apf.gMap.infoWindowArray = []

  // Lat und Lng in BeobListe ergänzen
  _.each(beobListe, function (beob, index) {
    if (beob.X && beob.Y) {
      beob.Lat = chToWgsLat(parseInt(beob.X, 10), parseInt(beob.Y, 10))
      beob.Lng = chToWgsLng(parseInt(beob.X, 10), parseInt(beob.Y, 10))
    } else {
      delete beobListe[index]
    }
  })
  // dito in TPopListe
  _.each(tpopListe, function (tpop, index) {
    if (tpop.TPopXKoord && tpop.TPopYKoord) {
      tpop.Lat = chToWgsLat(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10))
      tpop.Lng = chToWgsLng(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10))
    } else {
      delete tpopListe[index]
    }
  })
  // Beob zählen
  anzBeob = beobListe.length
  // TPop zählen
  anzTpop = tpopListe.length
  // Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
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
  markersTpop = []
  _.each(tpopListe, function (tpop) {
    latlng2 = new google.maps.LatLng(tpop.Lat, tpop.Lng)
    // Kartenausschnitt um diese Koordinate erweitern
    bounds.extend(latlng2)
    tpopBeschriftung = beschrifteTPopMitNrFuerKarte(tpop.PopNr, tpop.TPopNr)
    marker_tpop = new MarkerWithLabel({
      map: map,
      position: latlng2,
      title: tpopBeschriftung,
      labelContent: tpopBeschriftung,
      labelAnchor: new google.maps.Point(75, 0),
      labelClass: 'MapLabel',
      icon: 'img/flora_icon.png'
    })
    markersTpop.push(marker_tpop)
    myFlurname = tpop.TPopFlurname || '(kein Flurname)'
    contentstringTpop = '<div id="content">' +
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
    makeListenerMarkerClick(map, marker_tpop, contentstringTpop, infowindowTpop)
  })
  markerOptionsTpop = {
    maxZoom: 17,
    styles: [{
      height: 53,
      url: '../../../img/m8.png',
      width: 53
    }]
  }
  new MarkerClusterer(map, markersTpop, markerOptionsTpop)

  // für alle Beob Marker erstellen
  window.markersBeob = []
  _.each(beobListe, function (beob) {
    datum = beob.Datum
    latlng2 = new google.maps.LatLng(beob.Lat, beob.Lng)
    if (anzBeob === 1) {
      // map.fitbounds setzt zu hohen zoom, wenn nur eine Beob Koordinaten hat > verhindern
      latlng = latlng2
    } else {
      // Kartenausschnitt um diese Koordinate erweitern
      bounds.extend(latlng2)
    }
    // title muss String sein
    titelBeob = (datum ? datum.toString() : '')
    // A_NOTE muss String sein
    aNote = (beob.A_NOTE ? beob.A_NOTE.toString() : '')
    marker_beob = new MarkerWithLabel({
      map: map,
      position: latlng2,
      title: titelBeob,
      labelContent: aNote,
      labelAnchor: new google.maps.Point(75, 0),
      labelClass: 'MapLabel',
      icon: 'img/flora_icon_violett.png',
      draggable: true
    })
    window.markersBeob.push(marker_beob)
    makeListenerBeobMarkerDragend(marker_beob, beob)
    autor = beob.Autor || '(keiner)'
    projekt = beob.PROJET || '(keines)'
    ort = beob.DESC_LOCALITE || '(keiner)'
    contentstringBeob = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<div id="bodyContent" class="GmInfowindow">' +
      '<h3>' + datum + '</h3>' +
      '<p>Autor: ' + autor + '</p>' +
      '<p>Projekt: ' + projekt + '</p>' +
      '<p>Ort: ' + ort + '</p>' +
      '<p>Koordinaten: ' + beob.X + ' / ' + beob.Y + '</p>' +
      '<p><a href="#" class="oeffneBeob" data-beob=\'' + JSON.stringify(beob) + "'>Formular anstelle Karte öffnen<\/a></p>" +
      '<p><a href="#" class="oeffneBeobInNeuemTab" data-beob=\'' + JSON.stringify(beob) + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
      '</div>' +
      '</div>'
    makeListenerMarkerClick(map, marker_beob, contentstringBeob, infowindowBeob)
  })
  // KEIN MARKERCLUSTERER: er verhindert das Entfernen einzelner Marker!
  // ausserdem macht er es schwierig, eng liegende Marker zuzuordnen

  if (anzTpop + anzBeob === 1) {
    // map.fitbounds setzt zu hohen zoom, wenn nur ein Punkt dargestellt wird > verhindern
    map.setCenter(latlng)
    map.setZoom(18)
  } else {
    // Karte auf Ausschnitt anpassen
    map.fitBounds(bounds)
  }
}
