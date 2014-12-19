/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var mysql              = require('mysql'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'apflora'
    });

module.exports = function (request, callback) {
    var apId  = escapeStringForSql(request.params.apId),
        popId = escapeStringForSql(request.params.popId),
        user  = escapeStringForSql(request.params.user),   // der Benutzername
        date  = new Date().toISOString(),                  // wann gespeichert wird
        sql   = '';

    // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
    sql += 'INSERT INTO tblPop (PopNr, PopName, PopHerkunft, PopHerkunftUnklar, PopHerkunftUnklarBegruendung, PopBekanntSeit, PopXKoord, PopYKoord, PopGuid, MutWann, MutWer, ApArtId)';
    sql += ' SELECT tblPop.PopNr, tblPop.PopName, tblPop.PopHerkunft, tblPop.PopHerkunftUnklar, tblPop.PopHerkunftUnklarBegruendung, tblPop.PopBekanntSeit, tblPop.PopXKoord, tblPop.PopYKoord, tblPop.PopGuid, "' + date + '", "' + user + '", ' + apId;
    sql += ' FROM tblPop';
    sql += ' WHERE tblPop.PopId=' + popId;
    connection.query(
        sql,
        function (err, data) {
            // neue Id zurück liefern
            callback(err, data.insertId);
        }
    );
};