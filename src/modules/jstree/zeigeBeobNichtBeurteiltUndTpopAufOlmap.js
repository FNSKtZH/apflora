/*
 * Karte zeigt an:
 * - alle tpop, die gewählte ist markiert / anderst dargestellt
 * - alle der markierten tpop zugeordneten beob
 * - alle übrigen zugeordneten beob, beschriftet mit popnr / tpopnr, der sie zugeordnet sind
 * - alle nicht zugeordenten beob. nicht beschriftet?
 */


/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeBeobUmTpopZuzuordnen  = require('../olMap/zeigeBeobUmTpopZuzuordnen');

module.exports = function (nodeTpopId) {
    var tpopId = erstelleIdAusDomAttributId(nodeTpopId);

    $.ajax({
        type: 'get',
        url: '/api/v1/beobKarte/apId=' + apId + '/tpopId=/beobId=' + beobId + '/nichtZuzuordnen='
    }).done(function (beob) {
        if (beob.length > 0) {
            $.ajax({
                type: 'get',
                url: 'api/v1/apKarte/apId=' + apId
            }).done(function (tpop) {
                if (tpop && tpop.length > 0) {
                    zeigeBeobUmTpopZuzuordnen(tpop);
                }
            });
        } else {
            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Daten erhalten");
    });
};