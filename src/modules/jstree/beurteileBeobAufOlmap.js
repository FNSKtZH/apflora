/*
 * Karte zeigt an:
 * - alle tpop
 *   - die gewählte ist markiert
 *   - das Fenster, das die markierten Objekte auflistet, wird NICHT angezeigt
 * - alle beob
 *   - zugeordnete sind beschriftet mit PopNr/TPopNr der TPop, der sie zugeordnet sind?
 *   - nicht zugeordnete sind nicht beschriftet
 * - Zuordnungen von Beob zu TPop:
 *   - jede zugeordnete Beob ist durch eine Linie mit ihrer TPop verbunden
 *   - wahlweise können auch Beschriftungen (PopNr/TPopNr) eingeblendet werden
 *   - Zuordnungen können im Layertool geblendet werden
 *
 * Funktionalität:
 * - Kartenausschnitt soll praktisch sein
 * - Beob können per drag and drop einer TPop zugeordnet werden:
 *   - das Symbol der Beob kehrt in die ursprüngliche Lage zurück
 *   - die Symbole und Zuordnungen werden neu aufgebaut oder anders aktualisiert
 *     auch, wenn der Benutzer die Zuordnung im Formular geändert hat!
 *   - das Formular der Beob wird neben der Karte geöffnet
 *     - Optionenliste in der Höhe begrenzt, mit scrollbar
 *     - Status vor Zuordnung wird angezeigt
 *     - Zuordnung kann Rückgängig gemacht werden
 *     - Nicht zuordnen und Bemerkungen sind oberhalb der Optionenliste
 *     - Formular aus Vorlage aufgebaut
 *  - das Formular kann auch durch Klick auf die Beob neben der Karte geöffnet werden (wie pop und tpop)
 *    - Benutzer kann z.B. nicht zuzuordnen setzen - oder hier zuordnen
 *    - Zuordnungen werden in der Karte nachgeführt
 *  - nice to have: die Liste der 100 neusten nicht beurteilten Beob wird ergänzt (jsTree und Karte)
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