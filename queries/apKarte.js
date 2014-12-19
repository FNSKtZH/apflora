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

    // Daten abfragen
    connection.query(
        'SELECT apflora.tblAp.ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname, apflora.domApUmsetzung.DomainTxt AS ApUmsetzung, apflora.tblPop.PopId, apflora.tblPop.PopNr, apflora.tblPop.PopName, apflora.domPopHerkunft.HerkunftTxt AS PopHerkunft, apflora.tblPop.PopBekanntSeit, apflora.tblTPop.TPopId, apflora.tblTPop.TPopFlurname, apflora.tblTPop.TPopNr, apflora.tblTPop.TPopGemeinde, apflora.tblTPop.TPopXKoord, apflora.tblTPop.TPopYKoord, domPopHerkunft_1.HerkunftTxt AS TPopHerkunft FROM (((((apflora.tblAp INNER JOIN apflora.tblPop ON apflora.tblAp.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId) INNER JOIN apfloraBeob.ArtenDb_Arteigenschaften ON apflora.tblAp.ApArtId = apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN apflora.domPopHerkunft ON apflora.tblPop.PopHerkunft = apflora.domPopHerkunft.HerkunftId) LEFT JOIN apflora.domApUmsetzung ON apflora.tblAp.ApUmsetzung = apflora.domApUmsetzung.DomainCode) LEFT JOIN apflora.domPopHerkunft AS domPopHerkunft_1 ON apflora.tblTPop.TPopHerkunft = domPopHerkunft_1.HerkunftId WHERE apflora.tblTPop.TPopXKoord Is Not Null AND apflora.tblTPop.TPopYKoord Is Not Null AND apflora.tblAp.ApArtId = ' + apId,
        function (err, data) {
            callback(err, data);
        }
    );
};