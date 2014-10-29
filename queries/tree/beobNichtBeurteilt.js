/*jslint node: true, browser: true, nomen: true */
'use strict';


var _          = require('underscore'),
    mysql      = require('mysql'),
    config     = require('../../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var beobNichtBeurteilt = function (request, reply) {
    var apId = decodeURIComponent(request.params.apId);
    connection.query(
        "SELECT alexande_beob.tblBeobBereitgestellt.NO_NOTE, alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET, alexande_beob.tblBeobBereitgestellt.NO_ISFS, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor FROM (alexande_beob.tblBeobBereitgestellt LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobBereitgestellt.NO_NOTE = alexande_apflora.tblBeobZuordnung.NO_NOTE) LEFT JOIN alexande_apflora.tblBeobZuordnung AS tblBeobZuordnung_1 ON alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET = tblBeobZuordnung_1.NO_NOTE WHERE alexande_beob.tblBeobBereitgestellt.NO_ISFS=" + apId + " AND ((alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET Is Not Null AND tblBeobZuordnung_1.NO_NOTE Is Null) OR (alexande_beob.tblBeobBereitgestellt.NO_NOTE Is Not Null AND alexande_apflora.tblBeobZuordnung.NO_NOTE Is Null)) ORDER BY alexande_beob.tblBeobBereitgestellt.Datum DESC LIMIT 100",
        function (err, data) {
            var node = {};

            if (err) reply(err);

            if (data.length < 100) {
                node.data = 'nicht beurteilte Beobachtungen (' + data.length + ')';
            } else {
                node.data = 'nicht beurteilte Beobachtungen (erste ' + data.length + ')';
            }
            node.attr = {
                id: 'ap_ordner_beob_nicht_beurteilt' + apId,
                typ: 'ap_ordner_beob_nicht_beurteilt'
            };
            node.children = buildChildFromData(data);
            reply(null, node);
        }
    );
};

function buildChildFromData(data) {
    var childrenArray = [],
        object;

    _.each(data, function (beob) {
        object = {};
        var datum = beob.Datum || '(kein Datum)',
            autor = beob.Autor || '(kein Autor)';
        object.data = datum + ': ' + autor;
        // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
        object.attr = {
            typ: 'beob_nicht_beurteilt'
        };

        if (beob.NO_NOTE) {
            object.attr.id = 'beob' + beob.NO_NOTE;
            object.attr.beobtyp = 'infospezies';
        } else {
            object.attr.id = 'beob' + beob.NO_NOTE_PROJET;
            object.attr.beobtyp = 'evab';
        }
        childrenArray.push(object);
    });

    return childrenArray;
}

module.exports = beobNichtBeurteilt;