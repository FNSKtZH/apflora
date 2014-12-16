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
    connection.query(
        'SELECT DomainCode, DomainTxt FROM domTPopKontrIdBiotUebereinst ORDER BY DomainOrd',
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};