/*
 * Erzeugt eine Liste von Hinweisen auf Daten, die geprüft werden sollten
 * Ziel: Datenverantwortliche kontrollieren die Qualität ihrer Daten weitgehend selbst
 * Felder:
 * - Datensatz (Datensatzbeschreibung): ist Link, der in neuem Tab öffnet
 * - Hinweis (Begründung, wieso der Datensatz angezeigt wird)
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    _             = require('underscore'),
    zeigeFormular = require('./zeigeFormular');

function addDataFromViewToQsList(qsList, viewName) {
    $.ajax({
        type: 'get',
        url: 'api/v1/qkView/' + viewName + '/' + localStorage.apId
    }).done(function (data) {
        // data ist Objekt-Array
        // Felder: ApArtId, hw, link
        qsList.add(data);
    });
}

module.exports = function (apId) {
    var listOptions = {
            valueNames: ['hw', 'link'],
            item: '<li><p class="hw"></p><p class="link"></p></li>'
        },
        qsList = new window.List('qualitaetskontrollen', listOptions);

    $('#qkRefresh').button({
        icons: {
            primary: 'ui-icon-refresh'
        }
    });

    // clear list, otherwise items are added repeatedly
    qsList.clear();

    // make global so search can be cancelled
    window.apf.qsList = qsList;

    zeigeFormular('qualitaetskontrollen');
    history.pushState(null, null, "index.html?ap=" + apId + "&qualitaetskontrollen=true");

    // jede Kontrollabfrage aufrufen
    // aus Daten ein Array values machen
    // diese Daten anfügen:

    // AP mit Start im Jahr, ohne Stand Umsetzung
    // AP von AP-Art ohne Stand Umsetzung/Verantwortlich
    // AP ohne Verantwortlich?
    // pop ohne Nr/Name/Status/bekannt seit/Koordinaten?/tpop
    // pop mit mehrdeutiger Nr
    // pop ohne Name
    // tpop ohne Nr/Flurname/Status/bekannt seit/Koordinaten
    // pop/tpop mit Status unklar ohne Begründung?
    // tpop mit mehrdeutiger Kombination von PopNr und TPopNr
    addDataFromViewToQsList(qsList, 'v_qk_tpop_popnrtpopnrmehrdeutig');
    /*$.ajax({
        type: 'get',
        url: 'api/v1/qkView/v_qk_tpop_popnrtpopnrmehrdeutig'
    }).done(function (data) {
        // data ist Objekt-Array
        // Felder: hw, link
        qsList.add(data);
    });*/
    // Massn ohne Jahr/Typ
    // Massn.-Bericht ohne Jahr/Entwicklung
    // Kontrolle ohne Jahr/Zählung
    // Feldkontrolle ohne Kontrolltyp
    // Zählung ohne Einheit/Methode/Anzahl
    // TPop-Bericht ohne Jahr/Entwicklung
    // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
    // Ziel ohne Jahr/Zieltyp/Ziel
    // Ziel-Bericht ohne Jahr/Entwicklung
    // AP-Erfolgskriterium ohne Beurteilung/Kriterien
    // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung/was noch?
    // assoziierte Art ohne Art
};