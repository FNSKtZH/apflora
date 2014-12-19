/*
 * holt die Daten aller zugeordneten Beob
 * lässt sie darstellen mit popnr/tpopnr der Teilpopulation, der sie zugeordnet wurden
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                  = require('jquery'),
    erstelleTPopLayer  = require('./erstelleTPopLayer'),
    melde              = require('../melde');

module.exports = function () {
    // beob zugeordnet holen
    $.ajax({
        type: 'get',
        url: '/api/v1/beobKarte/apId=' + window.apf.ap.ApArtId + '/tpopId=/beobId=/nichtZuzuordnen='
    }).done(function (beobListe) {
        // Layer für Symbole und Beschriftung erstellen
        erstelleLayerBeobZugeordnet(beobListe);
    }).fail(function () {
        melde("Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden");
    });
};