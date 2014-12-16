/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'apflora'
    });

module.exports = function (request, callback) {
    // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
    var sql,
        programm = request.params.programm;

    // url setzen
    switch (programm) {
    case 'programmAp':
        sql = "SELECT apfloraBeob.ArtenDb_Arteigenschaften.Artname AS label, apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId=apflora.tblAp.ApArtId WHERE apflora.tblAp.ApStatus BETWEEN 1 AND 3 ORDER BY label";
        break;
    case 'programmNeu':
        sql = "SELECT IF(apfloraBeob.ArtenDb_Arteigenschaften.Status NOT LIKE 'akzeptierter Name', CONCAT(apfloraBeob.ArtenDb_Arteigenschaften.Artname, ' (', apfloraBeob.ArtenDb_Arteigenschaften.Status, ')'), apfloraBeob.ArtenDb_Arteigenschaften.Artname) AS label, apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM apfloraBeob.ArtenDb_Arteigenschaften WHERE apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId not in (SELECT apflora.tblAp.ApArtId FROM apflora.tblAp) ORDER BY label";
        break;
    // 'programmAlle' ist auch default
    default:
        sql = "SELECT apfloraBeob.ArtenDb_Arteigenschaften.Artname AS label, apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId=apflora.tblAp.ApArtId ORDER BY label";
        break;
    }

    // Daten abfragen
    connection.query(
        sql,
        function (err, data) {
            callback(err, data);
        }
    );
};