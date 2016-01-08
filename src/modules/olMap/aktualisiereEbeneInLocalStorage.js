// aktualisiert eine Kopie eigener Ebenen in window.localStorage
// remove: wenn vorhanden, wird die Ebene entfernt
// sonst wird die enthaltene Version durch die aktuelle ersetzt
// geschrieben wird GeoJSON. Grund: Die Layerobjekte sind rekursiv und können daher nicht stringified werden

'use strict'

var $ = require('jquery')
var ol = require('ol')
var _ = require('underscore')

module.exports = function (layer, remove) {
  // mit der guid kontrollieren, ob die Ebene schon existiert
  var guid = layer.get('guid')
  var eigeneEbenen = []
  var format
  var dataParsed

  if (window.localStorage.olmapEigeneEbenen) {
    eigeneEbenen = JSON.parse(window.localStorage.olmapEigeneEbenen)
  }

  if (guid) {
    // den layer entfernen
    // wenn er nicht entfernt werden soll, wird er im nächsten Schritt mit den aktuellen Daten ersetzt
    eigeneEbenen = _.reject(eigeneEbenen, function (ebene) {
      return ebene.guid && ebene.guid === guid
    })
    // wenn die Ebene nicht entfernt werden sollte, mit den aktuellen Daten ergänzen
    if (!remove) {
      format = new ol.format.GeoJSON()
      dataParsed = format.writeFeatures(layer.getSource().getFeatures())
      // alle zugefügten Eigenschaften anfügen
      dataParsed.title = layer.get('title')
      dataParsed.guid = guid
      dataParsed.kategorie = layer.get('kategorie')
      eigeneEbenen.push(dataParsed)
    }
    try {
      // TODO: wenn rueteren.kml importiert wurde erscheint Fehler 'Converting circular structure to JSON'
      window.localStorage.olmapEigeneEbenen = JSON.stringify(eigeneEbenen)
    } catch (e) {
      console.log('Ebene konnte nicht in window.localStorage gespeichert werden. Fehlermeldung: ' + e)
      $('#eigene_layer_meldung_' + layer.get('title').replace(' ', '_'))
        .html('Ebene kann nicht im Cache des Browsers gespeichert werden')
        .show()
    }
  }
}
