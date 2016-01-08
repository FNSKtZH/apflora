'use strict'

var $ = require('jquery')
var google = require('google')
var chToWgsLat = require('../../lib/chToWgsLat')
var chToWgsLng = require('../../lib/chToWgsLng')
var ddInChY = require('../../lib/ddInChY')
var ddInChX = require('../../lib/ddInChX')
var melde = require('../melde')
var getApiHost = require('../getApiHost')

module.exports = function (markerBeob, Beob) {
  google.maps.event.addListener(markerBeob, 'dragend', function (event) {
    var lat,
      lng,
      X,
      Y,
      that

    that = this
    // Koordinaten berechnen
    lat = event.latLng.lat()
    lng = event.latLng.lng()
    X = ddInChY(lat, lng)
    Y = ddInChX(lat, lng)
    // nächstgelegene TPop aus DB holen
    $.ajax({
      type: 'get',
      url: getApiHost() + '/beobNaechsteTpop/apId=' + Beob.NO_ISFS + '/X=' + X + '/Y=' + Y
    }).done(function (data) {
      var beobtxt
      var tpop = data[0]
      var label = tpop.PopNr + '/' + tpop.TPopNr + ': ' + tpop.TPopFlurname

      if (Beob.Autor) {
        beobtxt = 'Beobachtung von ' + Beob.Autor + ' aus dem Jahr ' + Beob.A_NOTE
      } else {
        beobtxt = 'Beobachtung ohne Autor aus dem Jahr ' + Beob.A_NOTE
      }

      // rückfragen
      $('#Meldung')
        .html('Soll die ' + beobtxt + "<br>der Teilpopulation '" + label + "' zugeordnet werden?")
        .dialog({
          modal: true,
          title: 'Zuordnung bestätigen',
          width: 600,
          buttons: {
            Ja: function () {
              var beobRef = '#beob' + Beob.NO_NOTE,
                tpopOrdnerRef = '#tpopOrdnerBeobZugeordnet' + tpop.TPopId

              $(this).dialog('close')

              // dem bind.move_node mitteilen, dass das Formular nicht initiiert werden soll
              window.localStorage.karteFokussieren = true

              // Beob der TPop zuweisen
              $('#tree').jstree('move_node', beobRef.toString(), tpopOrdnerRef.toString(), 'first')
              // Den Marker der zugewiesenen Beobachtung entfernen
              that.setMap(null)
            },
            Nein: function () {
              $(this).dialog('close')
              // drag rückgängig machen
              lng = chToWgsLng(Beob.X, Beob.Y)
              lat = chToWgsLat(Beob.X, Beob.Y)
              var latlng3 = new google.maps.LatLng(lat, lng)
              that.setPosition(latlng3)
            }
          }
        })
    }).fail(function () {
      melde('Fehler: Die Beobachtung wurde nicht zugeordnet')
    })
  })
}
