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
        'SELECT ZaehleinheitCode as value, ZaehleinheitTxt as label FROM tpopkontrzaehl_einheit_werte ORDER BY ZaehleinheitOrd',
        function (err, data) {
            callback(err, data);
        }
    );
};