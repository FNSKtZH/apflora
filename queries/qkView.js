/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../configuration'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'apflora_views'
    });

module.exports = function (request, callback) {
    var sql,
        viewName = request.params.viewName,
        apId     = request.params.apId;

    // url setzen
    sql = "SELECT * from " + viewName + " where ApArtId=" + apId;

    // Daten abfragen
    connection.query(
        sql,
        function (err, data) {
            callback(err, data);
        }
    );
};