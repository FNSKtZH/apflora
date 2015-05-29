// übernimmt drei Variablen: popliste ist das Objekt mit den Populationen
// popidMarkiert der Array mit den ausgewählten Pop
// visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)

'use strict'

var $ = require('jquery'),
  _ = require('underscore'),
  ol = require('ol'),
  styleBeobZuordnung = require('./styleBeobZuordnung')

module.exports = function (beobArray, tpopArray, visible) {
  var beobZuordnungsLayerErstellt = $.Deferred(),
    lines = [],
    line,
    tpop,
    beobZuordnungLayer

  visible = (visible === true)

  _.each(beobArray, function (beob) {
    if (beob.X && beob.Y) {
      // tpop suchen
      tpop = _.find(tpopArray, function (tpop) {
        return tpop.TPopId === beob.TPopId
      })

      // für jede beob eine Linie erstellen, damit später Linien nur noch angepasst werden müssen
      var tpopX = tpop && tpop.TPopXKoord ? tpop.TPopXKoord : beob.X,
        tpopY = tpop && tpop.TPopYKoord ? tpop.TPopYKoord : beob.Y

      // line erstellen...
      line = new ol.Feature({
        geometry: new ol.geom.LineString([[beob.X, beob.Y], [tpopX, tpopY]]),
        myTyp: 'beobZuordnung',
        myId: beob.NO_NOTE
      })

      // line in Array speichern
      lines.push(line)
    }
  })

  // layer für Marker erstellen
  beobZuordnungLayer = new ol.layer.Vector({
    title: 'BeobZuordnungen',
    selectable: true,
    source: new ol.source.Vector({
      features: lines
    }),
    style: function (feature, resolution) {
      return styleBeobZuordnung(feature, resolution)
    }
  })
  beobZuordnungLayer.set('visible', visible)
  beobZuordnungLayer.set('kategorie', 'AP Flora')
  window.apf.olMap.map.addLayer(beobZuordnungLayer)
  // layer global bereitstellen, damit es neu erstellt werden kann
  window.apf.olMap.beobZuordnungLayer = beobZuordnungLayer
  // features global bereitstellen, um sie beim zuordnen anpassen zu können
  window.apf.olMap.beobZuordnungsLayerFeatures = lines

  beobZuordnungsLayerErstellt.resolve()
  return beobZuordnungsLayerErstellt.promise()
}
