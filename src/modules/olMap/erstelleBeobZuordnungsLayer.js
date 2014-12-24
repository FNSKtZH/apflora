// übernimmt drei Variablen: popliste ist das Objekt mit den Populationen
// popidMarkiert der Array mit den ausgewählten Pop
// visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                  = require('jquery'),
    _                  = require('underscore'),
    ol                 = require('ol'),
    styleBeobZuordnung = require('./styleBeobZuordnung');

module.exports = function (beobArray, tpopArray, visible) {
    var beobZuordnungsLayerErstellt = $.Deferred(),
        lines = [],
        line,
        tpop,
        beobZuordnungLayer;

    visible = (visible === true);

    _.each(beobArray, function (beob) {
        if (beob.X && beob.Y && beob.TPopId) {
            // tpop suchen
            tpop = _.find(tpopArray, function (tpop) {
                return tpop.TPopId === beob.TPopId;
            });
            if (tpop && tpop.TPopXKoord && tpop.TPopYKoord) {
                // linie zeichnen
                // line erstellen...
                line = new ol.Feature({
                    geometry: new ol.geom.LineString([[beob.X, beob.Y], [tpop.TPopXKoord, tpop.TPopYKoord]]),
                    myTyp:        'beobZuordnung',
                    myId:         'beobZuordnung' + beob.NO_NOTE
                });

                // line in Array speichern
                lines.push(line);
            }
        }
    });

    // layer für Marker erstellen
    beobZuordnungLayer = new ol.layer.Vector({
        title:      'BeobZuordnungen',
        selectable: true,
        source: new ol.source.Vector({
            features: lines
        }),
        style: function (feature, resolution) {
            return styleBeobZuordnung(feature, resolution);
        }
    });
    beobZuordnungLayer.set('visible', visible);
    beobZuordnungLayer.set('kategorie', 'AP Flora');
    window.apf.olMap.map.addLayer(beobZuordnungLayer);

    beobZuordnungsLayerErstellt.resolve();
    return beobZuordnungsLayerErstellt.promise();
};