'use strict'

var $ = require('jquery'),
  google = require('google'),
  chToWgsLat = require('../../lib/chToWgsLat'),
  chToWgsLng = require('../../lib/chToWgsLng'),
  ddInChY = require('../../lib/ddInChY'),
  ddInChX = require('../../lib/ddInChX'),
  melde = require('../melde'),
  getApiHost = require('../getApiHost')

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
      url: getApiHost() + '/api/v1/beobNaechsteTpop/apId=' + Beob.NO_ISFS + '/X=' + X + '/Y=' + Y
    }).done(function (data) {
      var beobtxt

      if (Beob.Autor) {
        beobtxt = 'Beobachtung von ' + Beob.Autor + ' aus dem Jahr ' + Beob.A_NOTE
      } else {
        beobtxt = 'Beobachtung ohne Autor aus dem Jahr ' + Beob.A_NOTE
      }
      // rückfragen
      $('#Meldung')
        .html('Soll die ' + beobtxt + "<br>der Teilpopulation '" + data[0].TPopFlurname + "' zugeordnet werden?")
        .dialog({
          modal: true,
          title: 'Zuordnung bestätigen',
          width: 600,
          buttons: {
            Ja: function () {
              var beobRef = '#beob' + Beob.NO_NOTE,
                tpopOrdnerRef = '#tpopOrdnerBeobZugeordnet' + data[0].TPopId

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
