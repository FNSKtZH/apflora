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
        'SELECT NO_NOTE, NO_ISFS, apflora.tblTPop.TPopId, FNS_XGIS, FNS_YGIS, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((FNS_XGIS-TPopXKoord)*(FNS_XGIS-TPopXKoord)+(FNS_YGIS-TPopYKoord)*(FNS_YGIS-TPopYKoord)) AS DistZuTPop FROM apfloraBeob.tblBeobInfospezies INNER JOIN (apflora.tblPop INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE ="' + beobId + '" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND FNS_XGIS IS NOT NULL AND FNS_YGIS IS NOT NULL ORDER BY DistzuTPop, TPopFlurname',
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};