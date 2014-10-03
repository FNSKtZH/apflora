'use strict';

var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var returnFunction = function (request, callback) {
    var tpopId       = decodeURIComponent(request.params.tpopId),        // die id
        tpopKontrtyp = decodeURIComponent(request.params.tpopKontrtyp),  // feldkontr oder freiwkontr
        user         = decodeURIComponent(request.params.user),          // der Benutzername
        date         = new Date().toISOString(),                         // wann gespeichert wird
        sql;

    // sql schreiben
    if (tpopKontrtyp === 'tpopfreiwkontr') {
        // Die Freiwilligen-Erfolgskontrolle erhält direkt einen Typ
        sql = 'INSERT INTO tblTeilPopFeldkontrolle (TPopId, TPopKontrTyp, MutWann, MutWer) VALUES (' + tpopId + ', "Freiwilligen-Erfolgskontrolle", "' + date + '", "' + user + '")';
    } else {
        // die feldkontrolle erhält erst später einen Typ
        sql = 'INSERT INTO tblTeilPopFeldkontrolle (TPopId, MutWann, MutWer) VALUES (' + tpopId + ', "' + date + '", "' + user + '")';
    }

    connection.query(
        sql,
        function (err, data) {
            if (err) throw err;
            callback(data.insertId);
        }
    );
};

module.exports = returnFunction;