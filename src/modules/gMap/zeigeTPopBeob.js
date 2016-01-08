'use strict'

var google = require('google')
var MarkerWithLabel = require('MarkerWithLabel')
var MarkerClusterer = require('MarkerClusterer')
var chToWgsLng = require('../../lib/chToWgsLng')
var chToWgsLat = require('../../lib/chToWgsLat')
var zeigeFormular = require('../zeigeFormular')
var makeListenerMarkerClick = require('./makeListenerMarkerClick')

module.exports = function (tpopBeobListe) {
  var anzTpopBeob
  var infowindow = new google.maps.InfoWindow()
  var lat
  var lng
  var latlng
  var options
  var map
  var bounds
  var markers
  var latlng2
  var marker
  var contentString
  var markerOptions
  var datum
  var titel
  var autor
  var projekt
  var ort

  // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
  zeigeFormular('gMap')
  window.apf.gMap.markersArray = []
  window.apf.gMap.infoWindowArray = []
  // TPopListe bearbeiten:
  // Objekte löschen, die keine Koordinaten haben
  // Lat und Lng ergänzen
  tpopBeobListe.forEach(function (tpopBeob, index) {
    if (tpopBeob.X && tpopBeob.Y) {
      if (!tpopBeob.Lat || !tpopBeob.Lng) {
        tpopBeob.Lat = chToWgsLat(parseInt(tpopBeob.X, 10), parseInt(tpopBeob.Y, 10))
        tpopBeob.Lng = chToWgsLng(parseInt(tpopBeob.X, 10), parseInt(tpopBeob.Y, 10))
      }
    } else {
      tpopBeobListe.splice(index, 1)
    }
  })
  // TPop zählen
  anzTpopBeob = tpopBeobListe.length
  // Karte mal auf Zürich zentrieren, falls in den TPopBeobListe.rows keine Koordinaten kommen
  // auf die die Karte ausgerichtet werden kann
  lat = 47.383333
  lng = 8.533333
  latlng = new google.maps.LatLng(lat, lng)
  options = {
    zoom: 15,
    center: latlng,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    mapTypeControlOptions: {
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.TERRAIN,
        google.maps.MapTypeId.SATELLITE,
        google.maps.MapTypeId.HYBRID
      ]
    }
  }
  // document.getElementById("gMapDiv") verwenden statt $("#gMapDiv")!!!!
  // ruler.js braucht window.map
  window.apf.gMap.map = window.map = map = new google.maps.Map(document.getElementById('gMapDiv'), options)
  // Versuch: SVO einblenden
  // loadWMS(map, "//wms.zh.ch/FnsSVOZHWMS?")
  // loadWMS(map, "//www.gis.zh.ch/scripts/wmsfnssvo2.asp?")
  // Versuch: AV einblenden
  // loadWMS(map, "//wms.zh.ch/avwms?")
  bounds = new google.maps.LatLngBounds()

  // für alle Orte Marker erstellen
  markers = []
  tpopBeobListe.forEach(function (tpopBeob, index) {
    datum = tpopBeob.Datum
    latlng2 = new google.maps.LatLng(tpopBeob.Lat, tpopBeob.Lng)
    if (anzTpopBeob === 1) {
      // map.fitbounds setzt zu hohen zoom, wenn nur eine TPopBeob Koordinaten hat > verhindern
      latlng = latlng2
    } else {
      // Kartenausschnitt um diese Koordinate erweitern
      bounds.extend(latlng2)
    }
    // title muss String sein
    titel = (datum ? datum.toString() : '')
    marker = new MarkerWithLabel({
      map: map,
      position: latlng2,
      // title muss String sein
      title: titel,
      labelContent: titel,
      labelAnchor: new google.maps.Point(75, 0),
      labelClass: 'MapLabel',
      icon: 'img/flora_icon_violett.png'
    })
    markers.push(marker)
    autor = tpopBeob.Autor || '(keiner)'
    projekt = tpopBeob.PROJET || '(keines)'
    ort = tpopBeob.DESC_LOCALITE || '(keiner)'
    contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<div id="bodyContent" class="GmInfowindow">' +
      '<h3>' + datum + '</h3>' +
      '<p>Autor: ' + autor + '</p>' +
      '<p>Projekt: ' + projekt + '</p>' +
      '<p>Ort: ' + ort + '</p>' +
      '<p>Koordinaten: ' + tpopBeob.X + ' / ' + tpopBeob.Y + '</p>' +
      '<p><a href="#" onclick="window.apf.oeffneTPopBeob(\'' + tpopBeob.NO_NOTE + '\')">Formular anstelle Karte öffnen<\/a></p>' +
      '<p><a href="#" onclick="window.apf.oeffneTPopBeobInNeuemTab(\'' + tpopBeob.NO_NOTE + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
      '</div>' +
      '</div>'
    makeListenerMarkerClick(map, marker, contentString, infowindow)
  })
  markerOptions = {
    maxZoom: 17,
    styles: [{
      height: 53,
      url: '../../../img/m5.png',
      width: 53
    }]
  }
  new MarkerClusterer(map, markers, markerOptions)
  if (anzTpopBeob === 1) {
    // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
    map.setCenter(latlng)
    map.setZoom(18)
  } else {
    // Karte auf Ausschnitt anpassen
    map.fitBounds(bounds)
  }
}
