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
    var beobId = escapeStringForSql(request.params.beobId);

    connection.query(
        'SELECT NO_NOTE_PROJET, NO_ISFS, apflora.tblTPop.TPopId, COORDONNEE_FED_E, COORDONNEE_FED_N, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((COORDONNEE_FED_E-TPopXKoord)*(COORDONNEE_FED_E-TPopXKoord)+(COORDONNEE_FED_N-TPopYKoord)*(COORDONNEE_FED_N-TPopYKoord)) AS DistZuTPop FROM apfloraBeob.tblBeobEvab INNER JOIN (apflora.tblPop INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE_PROJET ="' + beobId + '" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND COORDONNEE_FED_E IS NOT NULL AND COORDONNEE_FED_N IS NOT NULL ORDER BY DistzuTPop, TPopFlurname',
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};