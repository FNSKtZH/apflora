/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var _                  = require('underscore'),
    mysql              = require('mysql'),
    config             = require('../../src/modules/configuration'),
    escapeStringForSql = require('../escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'apflora'
    });

function buildChildFromData(data) {
    var childrenArray = [],
        object;

    _.each(data, function (beob) {
        var datum = beob.Datum || '(kein Datum)',
            autor = beob.Autor || '(kein Autor)';

        object      = {};
        object.data = datum + ': ' + autor;
        // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
        object.attr = {
            typ: 'beobNichtBeurteilt'
        };

        if (beob.NO_NOTE) {
            object.attr.id      = 'beob' + beob.NO_NOTE;
            object.attr.beobtyp = 'infospezies';
        } else {
            object.attr.id      = 'beob' + beob.NO_NOTE_PROJET;
            object.attr.beobtyp = 'evab';
        }
        childrenArray.push(object);
    });

    return childrenArray;
}

module.exports = function (request, reply) {
    var apId = escapeStringForSql(request.params.apId);

    connection.query(
        "SELECT apfloraBeob.tblBeobBereitgestellt.NO_NOTE, apfloraBeob.tblBeobBereitgestellt.NO_NOTE_PROJET, apfloraBeob.tblBeobBereitgestellt.NO_ISFS, apfloraBeob.tblBeobBereitgestellt.Datum, apfloraBeob.tblBeobBereitgestellt.Autor FROM (apfloraBeob.tblBeobBereitgestellt LEFT JOIN apflora.tblBeobZuordnung ON apfloraBeob.tblBeobBereitgestellt.NO_NOTE = apflora.tblBeobZuordnung.NO_NOTE) LEFT JOIN apflora.tblBeobZuordnung AS tblBeobZuordnung_1 ON apfloraBeob.tblBeobBereitgestellt.NO_NOTE_PROJET = tblBeobZuordnung_1.NO_NOTE WHERE apfloraBeob.tblBeobBereitgestellt.NO_ISFS=" + apId + " AND ((apfloraBeob.tblBeobBereitgestellt.NO_NOTE_PROJET Is Not Null AND tblBeobZuordnung_1.NO_NOTE Is Null) OR (apfloraBeob.tblBeobBereitgestellt.NO_NOTE Is Not Null AND apflora.tblBeobZuordnung.NO_NOTE Is Null)) ORDER BY apfloraBeob.tblBeobBereitgestellt.Datum DESC LIMIT 100",
        function (err, data) {
            var node = {};

            if (err) { reply(err); }

            if (data.length < 100) {
                node.data = 'nicht beurteilte Beobachtungen (' + data.length + ')';
            } else {
                node.data = 'nicht beurteilte Beobachtungen (neuste ' + data.length + ')';
            }
            node.attr = {
                id:  'apOrdnerBeobNichtBeurteilt' + apId,
                typ: 'apOrdnerBeobNichtBeurteilt'
            };
            node.children = buildChildFromData(data);
            reply(null, node);
        }
    );
};