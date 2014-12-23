/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (beob) {
    var initiiereBeob  = require('./initiiereBeob'),
        oeffneTPopBeob = require('./oeffneTPopBeob'),
        beobStatus,
        beobTyp;

    if (typeof beob === 'number' || typeof beob === 'string') {
        // die TPopId wurde übergeben
        oeffneTPopBeob(beob);
        return;
    }

    beobStatus = (beob.beobNichtZuordnen ? 'nicht_zuzuordnen' : 'nicht_beurteilt');

    beobTyp = (isNaN(beob.NO_NOTE) ? 'evab' : 'infospezies');

    localStorage.beobtyp = beobTyp;
    initiiereBeob(beobTyp, beob.NO_NOTE, beobStatus);
};