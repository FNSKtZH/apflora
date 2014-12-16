/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'apfloraBeob'
    });

module.exports = function (request, callback) {
    // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
    connection.query(
        "SELECT TaxonomieId AS id, IF(Status NOT LIKE 'akzeptierter Name', CONCAT(Artname, ' (', Status, ')'), Artname) AS label FROM apfloraBeob.ArtenDb_Arteigenschaften ORDER BY Artname",
        function (err, data) {
            callback(err, data);
        }
    );
};