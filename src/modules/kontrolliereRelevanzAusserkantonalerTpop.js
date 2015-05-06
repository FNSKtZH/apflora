/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                    = require('jquery'),
    _                    = require('underscore'),
    isPointInsidePolygon = require('./isPointInsidePolygon'),
    zhGeojson            = require('../../geojson/ktZh.json'),
    melde                = require('./melde');

module.exports = function () {
    var qsList = window.apf.qsList;

    // get list of tpop's of this localStorage.apId
    $.ajax({
        type: 'get',
        url: 'api/v1/tpopKoordFuerProgramm/apId=' + localStorage.apId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            _.each(data, function (tpop) {
                if (tpop.TPopApBerichtRelevant === 1 && !isPointInsidePolygon(zhGeojson, tpop.TPopXKoord, tpop.TPopYKoord)) {
                    // diese tpop liegt ausserhalb des Kantons, daher sollte sie nicht relevant sein
                    // von qsList benötigte Daten anfügen

                    // an qsList anfügen

                }
            });
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für Teilpopulationen erhalten');
    });
};