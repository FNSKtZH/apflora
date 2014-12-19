/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql              = require('mysql'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:      config.db.userName,
        password:  config.db.passWord,
        database: 'apfloraBeob'
    });

module.exports = function (request, callback) {
    var apId            = escapeStringForSql(request.params.apId),
        tpopId          = escapeStringForSql(request.params.tpopId),
        beobId          = escapeStringForSql(request.params.beobId),
        nichtZuzuordnen = request.params.nichtZuzuordnen,
        url;

    if (beobId) {
        // beobid wurde übergeben > auf eine Beobachtung filtern
        url = 'SELECT tblBeobInfospezies.NO_NOTE, tblBeobInfospezies.NO_ISFS, tblBeobInfospezies.FNS_XGIS AS X, tblBeobInfospezies.FNS_YGIS AS Y, tblBeobInfospezies.A_NOTE, tblBeobBereitgestellt.Datum AS Datum, tblBeobBereitgestellt.Autor, tblBeobInfospezies.PROJET, tblBeobInfospezies.DESC_LOCALITE FROM tblBeobInfospezies INNER JOIN tblBeobBereitgestellt ON tblBeobInfospezies.NO_NOTE = tblBeobBereitgestellt.NO_NOTE WHERE tblBeobInfospezies.FNS_XGIS>0 AND tblBeobInfospezies.FNS_YGIS>0 AND tblBeobInfospezies.NO_NOTE="' + beobId + '" UNION SELECT tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, tblBeobEvab.NO_ISFS, tblBeobEvab.COORDONNEE_FED_E AS X, tblBeobEvab.COORDONNEE_FED_N AS Y, tblBeobEvab.A_NOTE, tblBeobBereitgestellt.Datum AS Datum, tblBeobBereitgestellt.Autor, tblBeobEvab.Projekt_ZH AS PROJET, tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE FROM tblBeobBereitgestellt INNER JOIN tblBeobEvab ON tblBeobBereitgestellt.NO_NOTE_PROJET = tblBeobEvab.NO_NOTE_PROJET WHERE tblBeobEvab.COORDONNEE_FED_E>0 AND tblBeobEvab.COORDONNEE_FED_N>0 AND tblBeobEvab.NO_NOTE_PROJET="' + beobId + '" ORDER BY Datum DESC LIMIT 100';
    } else if (tpopId) {
        // tpopId wurde übergeben > auf tpop filtern
        url = 'SELECT apfloraBeob.tblBeobInfospezies.NO_NOTE, apfloraBeob.tblBeobInfospezies.NO_ISFS, apfloraBeob.tblBeobInfospezies.FNS_XGIS AS X, apfloraBeob.tblBeobInfospezies.FNS_YGIS AS Y, apfloraBeob.tblBeobInfospezies.A_NOTE, apfloraBeob.tblBeobBereitgestellt.Datum AS Datum, apfloraBeob.tblBeobBereitgestellt.Autor, apfloraBeob.tblBeobInfospezies.PROJET, apfloraBeob.tblBeobInfospezies.DESC_LOCALITE, apflora.tblBeobZuordnung.TPopId, apflora.tblTPop.TPopXKoord, apflora.tblTPop.TPopYKoord FROM (apfloraBeob.tblBeobInfospezies INNER JOIN apfloraBeob.tblBeobBereitgestellt ON apfloraBeob.tblBeobInfospezies.NO_NOTE = apfloraBeob.tblBeobBereitgestellt.NO_NOTE) INNER JOIN (apflora.tblTPop INNER JOIN apflora.tblBeobZuordnung ON apflora.tblTPop.TPopId = apflora.tblBeobZuordnung.TPopId) ON apfloraBeob.tblBeobInfospezies.NO_NOTE = apflora.tblBeobZuordnung.NO_NOTE WHERE apfloraBeob.tblBeobInfospezies.FNS_XGIS>0 AND apfloraBeob.tblBeobInfospezies.FNS_YGIS>0 AND apflora.tblBeobZuordnung.TPopId=' + tpopId + ' UNION SELECT apfloraBeob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, apfloraBeob.tblBeobEvab.NO_ISFS, apfloraBeob.tblBeobEvab.COORDONNEE_FED_E AS X, apfloraBeob.tblBeobEvab.COORDONNEE_FED_N AS Y, apfloraBeob.tblBeobEvab.A_NOTE, apfloraBeob.tblBeobBereitgestellt.Datum AS Datum, apfloraBeob.tblBeobBereitgestellt.Autor, apfloraBeob.tblBeobEvab.Projekt_ZH AS PROJET, apfloraBeob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, apflora.tblBeobZuordnung.TPopId, apflora.tblTPop.TPopXKoord, apflora.tblTPop.TPopYKoord FROM (apfloraBeob.tblBeobBereitgestellt INNER JOIN apfloraBeob.tblBeobEvab ON apfloraBeob.tblBeobBereitgestellt.NO_NOTE_PROJET = apfloraBeob.tblBeobEvab.NO_NOTE_PROJET) INNER JOIN (apflora.tblTPop INNER JOIN apflora.tblBeobZuordnung ON apflora.tblTPop.TPopId = apflora.tblBeobZuordnung.TPopId) ON apfloraBeob.tblBeobEvab.NO_NOTE_PROJET = apflora.tblBeobZuordnung.NO_NOTE WHERE apfloraBeob.tblBeobEvab.COORDONNEE_FED_E>0 AND apfloraBeob.tblBeobEvab.COORDONNEE_FED_N>0 AND apflora.tblBeobZuordnung.TPopId=' + tpopId + ' ORDER BY Datum DESC LIMIT 100';
    } else if (apId) {
        // apart_id wurde übergeben > auf Art filtern
        if (nichtZuzuordnen) {
            // die nicht zuzuordnenden
            url = 'SELECT apfloraBeob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, apfloraBeob.tblBeobEvab.NO_ISFS, apfloraBeob.tblBeobEvab.COORDONNEE_FED_E AS X, apfloraBeob.tblBeobEvab.COORDONNEE_FED_N AS Y, apfloraBeob.tblBeobEvab.A_NOTE, apfloraBeob.tblBeobBereitgestellt.Datum AS Datum, apfloraBeob.tblBeobBereitgestellt.Autor, apfloraBeob.tblBeobEvab.Projekt_ZH AS PROJET, apfloraBeob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, apflora.tblBeobZuordnung.TPopId FROM (apfloraBeob.tblBeobBereitgestellt INNER JOIN apfloraBeob.tblBeobEvab ON apfloraBeob.tblBeobBereitgestellt.NO_NOTE_PROJET = apfloraBeob.tblBeobEvab.NO_NOTE_PROJET) LEFT JOIN apflora.tblBeobZuordnung ON apfloraBeob.tblBeobEvab.NO_NOTE_PROJET = apflora.tblBeobZuordnung.NO_NOTE WHERE apfloraBeob.tblBeobEvab.COORDONNEE_FED_E>0 AND apfloraBeob.tblBeobEvab.COORDONNEE_FED_N>0 AND apflora.tblBeobZuordnung.beobNichtZuordnen =1 AND apfloraBeob.tblBeobEvab.NO_ISFS=' + apId + ' UNION SELECT apfloraBeob.tblBeobInfospezies.NO_NOTE, apfloraBeob.tblBeobInfospezies.NO_ISFS, apfloraBeob.tblBeobInfospezies.FNS_XGIS AS X, apfloraBeob.tblBeobInfospezies.FNS_YGIS AS Y, apfloraBeob.tblBeobInfospezies.A_NOTE, apfloraBeob.tblBeobBereitgestellt.Datum AS Datum, apfloraBeob.tblBeobBereitgestellt.Autor, apfloraBeob.tblBeobInfospezies.PROJET, apfloraBeob.tblBeobInfospezies.DESC_LOCALITE, apflora.tblBeobZuordnung.TPopId FROM (apfloraBeob.tblBeobInfospezies INNER JOIN apfloraBeob.tblBeobBereitgestellt ON apfloraBeob.tblBeobInfospezies.NO_NOTE = apfloraBeob.tblBeobBereitgestellt.NO_NOTE) LEFT JOIN apflora.tblBeobZuordnung ON apfloraBeob.tblBeobInfospezies.NO_NOTE = apflora.tblBeobZuordnung.NO_NOTE WHERE apfloraBeob.tblBeobInfospezies.FNS_XGIS>0 AND apfloraBeob.tblBeobInfospezies.FNS_YGIS>0 AND apflora.tblBeobZuordnung.beobNichtZuordnen=1 AND apfloraBeob.tblBeobInfospezies.NO_ISFS=' + apId + ' ORDER BY Datum DESC LIMIT 100';
        } else {
            // die nicht beurteilten
            url = 'SELECT apfloraBeob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, apfloraBeob.tblBeobEvab.NO_ISFS, apfloraBeob.tblBeobEvab.COORDONNEE_FED_E AS X, apfloraBeob.tblBeobEvab.COORDONNEE_FED_N AS Y, apfloraBeob.tblBeobEvab.A_NOTE, apfloraBeob.tblBeobBereitgestellt.Datum AS Datum, apfloraBeob.tblBeobBereitgestellt.Autor, apfloraBeob.tblBeobEvab.Projekt_ZH AS PROJET, apfloraBeob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, apflora.tblBeobZuordnung.TPopId FROM (apfloraBeob.tblBeobBereitgestellt INNER JOIN apfloraBeob.tblBeobEvab ON apfloraBeob.tblBeobBereitgestellt.NO_NOTE_PROJET = apfloraBeob.tblBeobEvab.NO_NOTE_PROJET) LEFT JOIN apflora.tblBeobZuordnung ON apfloraBeob.tblBeobEvab.NO_NOTE_PROJET = apflora.tblBeobZuordnung.NO_NOTE WHERE apfloraBeob.tblBeobEvab.COORDONNEE_FED_E>0 AND apfloraBeob.tblBeobEvab.COORDONNEE_FED_N>0 AND apflora.tblBeobZuordnung.TPopId Is Null AND apfloraBeob.tblBeobEvab.NO_ISFS=' + apId + ' UNION SELECT apfloraBeob.tblBeobInfospezies.NO_NOTE, apfloraBeob.tblBeobInfospezies.NO_ISFS, apfloraBeob.tblBeobInfospezies.FNS_XGIS AS X, apfloraBeob.tblBeobInfospezies.FNS_YGIS AS Y, apfloraBeob.tblBeobInfospezies.A_NOTE, apfloraBeob.tblBeobBereitgestellt.Datum AS Datum, apfloraBeob.tblBeobBereitgestellt.Autor, apfloraBeob.tblBeobInfospezies.PROJET, apfloraBeob.tblBeobInfospezies.DESC_LOCALITE, apflora.tblBeobZuordnung.TPopId FROM (apfloraBeob.tblBeobInfospezies INNER JOIN apfloraBeob.tblBeobBereitgestellt ON apfloraBeob.tblBeobInfospezies.NO_NOTE = apfloraBeob.tblBeobBereitgestellt.NO_NOTE) LEFT JOIN apflora.tblBeobZuordnung ON apfloraBeob.tblBeobInfospezies.NO_NOTE = apflora.tblBeobZuordnung.NO_NOTE WHERE apfloraBeob.tblBeobInfospezies.FNS_XGIS>0 AND apfloraBeob.tblBeobInfospezies.FNS_YGIS>0 AND apflora.tblBeobZuordnung.TPopId Is Null AND apfloraBeob.tblBeobInfospezies.NO_ISFS=' + apId + ' ORDER BY Datum DESC LIMIT 100';
        }
    }
    // Daten abfragen
    connection.query(
        url,
        function (err, data) {
            callback(err, data);
        }
    );
};