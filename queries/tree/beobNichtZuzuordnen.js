/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var _                  = require('underscore'),
    mysql              = require('mysql'),
    config             = require('../../src/modules/configuration'),
    escapeStringForSql = require('../escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:      config.db.userName,
        password:  config.db.passWord,
        database: 'apfloraBeob'
    });

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
            id:  'beob' + beob.NO_NOTE,
            typ: 'beobNichtZuzuordnen',
            beobtyp: beob.beobtyp
        };
        childrenArray.push(object);
    });

    return childrenArray;
}

module.exports = function (request, reply) {
    var apId = escapeStringForSql(request.params.apId);

    connection.query(
        "SELECT apfloraBeob.tblBeobBereitgestellt.NO_ISFS, apflora.tblBeobZuordnung.NO_NOTE, apflora.tblBeobZuordnung.beobNichtZuordnen, apflora.tblBeobZuordnung.BeobBemerkungen, apflora.tblBeobZuordnung.BeobMutWann, apflora.tblBeobZuordnung.BeobMutWer, apfloraBeob.tblBeobBereitgestellt.Datum, apfloraBeob.tblBeobBereitgestellt.Autor, 'infospezies' AS beobtyp FROM apflora.tblBeobZuordnung INNER JOIN apfloraBeob.tblBeobBereitgestellt ON apflora.tblBeobZuordnung.NO_NOTE = apfloraBeob.tblBeobBereitgestellt.NO_NOTE WHERE apflora.tblBeobZuordnung.NO_NOTE IS NOT NULL AND apflora.tblBeobZuordnung.beobNichtZuordnen=1 AND apfloraBeob.tblBeobBereitgestellt.NO_ISFS=" + apId + " UNION SELECT apfloraBeob.tblBeobBereitgestellt.NO_ISFS, apflora.tblBeobZuordnung.NO_NOTE, apflora.tblBeobZuordnung.beobNichtZuordnen, apflora.tblBeobZuordnung.BeobBemerkungen, apflora.tblBeobZuordnung.BeobMutWann, apflora.tblBeobZuordnung.BeobMutWer, apfloraBeob.tblBeobBereitgestellt.Datum, apfloraBeob.tblBeobBereitgestellt.Autor, 'evab' AS beobtyp FROM apflora.tblBeobZuordnung INNER JOIN apfloraBeob.tblBeobBereitgestellt ON apflora.tblBeobZuordnung.NO_NOTE = apfloraBeob.tblBeobBereitgestellt.NO_NOTE_PROJET WHERE apflora.tblBeobZuordnung.NO_NOTE IS NOT NULL AND apflora.tblBeobZuordnung.beobNichtZuordnen=1 AND apfloraBeob.tblBeobBereitgestellt.NO_ISFS=" + apId + " ORDER BY Datum DESC LIMIT 100",
        function (err, data) {
            var node = {};

            if (err) { reply(err); }

            if (data.length < 100) {
                node.data = 'nicht zuzuordnende Beobachtungen (' + data.length + ')';
            } else {
                node.data = 'nicht zuzuordnende Beobachtungen (neuste ' + data.length + ')';
            }

            node.attr = {
                id: 'apOrdnerBeobNichtZuzuordnen' + apId,
                typ: 'apOrdnerBeobNichtZuzuordnen'
            };
            node.children = buildChildFromData(data);

            reply(null, node);
        }
    );
};