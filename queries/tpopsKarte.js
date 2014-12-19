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
    var popId = escapeStringForSql(request.params.popId);

    // Daten abfragen
    connection.query(
        'SELECT tblAp.ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname, domApUmsetzung.DomainTxt AS ApUmsetzung, tblPop.PopId, tblPop.PopNr, tblPop.PopName, domPopHerkunft.HerkunftTxt AS PopHerkunft, tblPop.PopBekanntSeit, tblTPop.TPopId, tblTPop.TPopFlurname, tblTPop.TPopNr, tblTPop.TPopGemeinde, tblTPop.TPopXKoord, tblTPop.TPopYKoord, domPopHerkunft_1.HerkunftTxt AS TPopHerkunft FROM (((((tblAp INNER JOIN tblPop ON tblAp.ApArtId = tblPop.ApArtId) INNER JOIN tblTPop ON tblPop.PopId = tblTPop.PopId) INNER JOIN apfloraBeob.ArtenDb_Arteigenschaften ON tblAp.ApArtId = apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN domPopHerkunft ON tblPop.PopHerkunft = domPopHerkunft.HerkunftId) LEFT JOIN domApUmsetzung ON tblAp.ApUmsetzung = domApUmsetzung.DomainCode) LEFT JOIN domPopHerkunft AS domPopHerkunft_1 ON tblTPop.TPopHerkunft = domPopHerkunft_1.HerkunftId WHERE tblTPop.TPopXKoord Is Not Null AND tblTPop.TPopYKoord Is Not Null AND tblPop.PopId = ' + popId,
        function (err, data) {
            callback(err, data);
        }
    );
};