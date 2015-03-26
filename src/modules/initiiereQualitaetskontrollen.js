/*
 * Erzeugt eine Liste von Hinweisen auf Daten, die geprüft werden sollten
 * Ziel: Datenverantwortliche kontrollieren die Qualität ihrer Daten weitgehend selbst
 * Felder:
 * - Datensatz (Datensatzbeschreibung): ist Link, der in neuem Tab öffnet
 * - Hinweis (Begründung, wieso der Datensatz angezeigt wird)
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    zeigeFormular                = require('./zeigeFormular'),
    melde                        = require('./melde');

module.exports = function (apId) {
    var options = {
            valueNames: ['datensatz', 'hinweis'],
            item: '<li><p class="datensatz"></p><p class="hinweis"></p></li>'
        },
        values = [
            {
                datensatz: 'Teilpopulation abies alba > 1 > 1',
                hinweis: 'hier stinkt\'s, muss wohl was faul sein'
            },
            {
                datensatz: 'Feldkontrolle abies alba > 1 > 2 > 2014',
                hinweis: 'na so was, dann schau ich doch mal'
            }
        ],
        qsList = new window.List('qualitaetskontrollen', options);

    // clear list, otherwise items are added repeatedly
    qsList.clear();

    zeigeFormular('qualitaetskontrollen');
    // jede Kontrollabfrage aufrufen
    // aus Daten ein Array values machen
    // diese Daten anfügen:
    qsList.add(values);
};