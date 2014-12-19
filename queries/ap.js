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
    var apId = escapeStringForSql(request.params.apId);

    connection.query(
        'SELECT apflora.tblAp.ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname, apflora.tblAp.ApStatus, apflora.tblAp.ApJahr, apflora.tblAp.ApUmsetzung, apflora.tblAp.ApBearb, apflora.tblAp.ApArtwert, apflora.tblAp.MutWann, apflora.tblAp.MutWer FROM apflora.tblAp INNER JOIN apfloraBeob.ArtenDb_Arteigenschaften ON apflora.tblAp.ApArtId = apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId WHERE ApArtId = ' + apId,
        function (err, data) {
            callback(err, data);
        }
    );
};