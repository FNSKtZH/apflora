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

function tellUserIfNoIssues() {
    var html;

    if (window.apf.qsList.items.length === 0) {
        html = '<li><p>juhui, keine Probleme gefunden!</p></li>';
        $('#qualitaetskontrollen').find('.list').html(html);
    }
}

function addDataFromViewToQsList(qsList, viewName, berichtjahr) {
    var baseUrl = 'api/v1/qkView/' + viewName + '/' + localStorage.apId,
        url     = berichtjahr ? baseUrl + '/' + berichtjahr : baseUrl;

    $.ajax({
        type: 'get',
        url:  url
    }).done(function (data) {
        // data ist Objekt-Array
        // Felder: ApArtId, hw, link
        // remove data without links
        data = _.filter(data, function (dat) {
            return !!dat.link;
        });
        if (data && data.length > 0) {
            qsList.add(data);
        } else {
            setTimeout(function () {
                tellUserIfNoIssues();
            }, 500);
        }
        $("#tree").jstree("rename_node", "#qualitaetskontrollen" + localStorage.apId, 'Qualitätskontrollen (' + window.apf.qsList.items.length + ')');
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
    // diese Daten anfügen

    // AP mit Start im Jahr, ohne Stand Umsetzung
    // AP von AP-Art ohne Stand Umsetzung/Verantwortlich
    // AP ohne Verantwortlich?

    // pop ohne Nr/Name/Status/bekannt seit/Koordinaten/tpop
    addDataFromViewToQsList(qsList, 'v_qk_pop_ohnepopnr');
    addDataFromViewToQsList(qsList, 'v_qk_pop_ohnepopname');
    addDataFromViewToQsList(qsList, 'v_qk_pop_ohnepopstatus');
    addDataFromViewToQsList(qsList, 'v_qk_pop_ohnebekanntseit');
    addDataFromViewToQsList(qsList, 'v_qk_pop_ohnekoord');
    addDataFromViewToQsList(qsList, 'v_qk_pop_ohnetpop');
    // pop mit Status unklar, ohne Begründung
    addDataFromViewToQsList(qsList, 'v_qk_pop_mitstatusunklarohnebegruendung');
    // pop mit mehrdeutiger Nr
    addDataFromViewToQsList(qsList, 'v_qk_pop_popnrmehrdeutig');
    // tpop ohne Nr/Flurname/Status/bekannt seit/Koordinaten
    addDataFromViewToQsList(qsList, 'v_qk_tpop_ohnenr');
    addDataFromViewToQsList(qsList, 'v_qk_tpop_ohneflurname');
    addDataFromViewToQsList(qsList, 'v_qk_tpop_ohnestatus');
    addDataFromViewToQsList(qsList, 'v_qk_tpop_ohnebekanntseit');
    addDataFromViewToQsList(qsList, 'v_qk_tpop_ohnekoordinaten');
    // pop/tpop mit Status unklar ohne Begründung
    addDataFromViewToQsList(qsList, 'v_qk_tpop_mitstatusunklarohnebegruendung');
    // tpop mit mehrdeutiger Kombination von PopNr und TPopNr
    addDataFromViewToQsList(qsList, 'v_qk_tpop_popnrtpopnrmehrdeutig');
    // Massn ohne Jahr/Typ
    addDataFromViewToQsList(qsList, 'v_qk_massn_ohnejahr');
    addDataFromViewToQsList(qsList, 'v_qk_massn_ohnetyp');
    // Massn.-Bericht ohne Jahr/Entwicklung
    addDataFromViewToQsList(qsList, 'v_qk_massnber_ohnejahr');
    addDataFromViewToQsList(qsList, 'v_qk_massnber_ohneerfbeurt');
    // Kontrolle ohne Jahr
    addDataFromViewToQsList(qsList, 'v_qk_feldkontr_ohnejahr');
    addDataFromViewToQsList(qsList, 'v_qk_freiwkontr_ohnejahr');
    // TODO: Kontrolle ohne Zählung
    addDataFromViewToQsList(qsList, 'v_qk_feldkontr_ohnezaehlung');
    addDataFromViewToQsList(qsList, 'v_qk_freiwkontr_ohnezaehlung');
    // Feldkontrolle ohne Kontrolltyp
    addDataFromViewToQsList(qsList, 'v_qk_feldkontr_ohnetyp');
    // Zählung ohne Einheit/Methode/Anzahl
    addDataFromViewToQsList(qsList, 'v_qk_feldkontrzaehlung_ohneeinheit');
    addDataFromViewToQsList(qsList, 'v_qk_freiwkontrzaehlung_ohneeinheit');
    addDataFromViewToQsList(qsList, 'v_qk_feldkontrzaehlung_ohnemethode');
    addDataFromViewToQsList(qsList, 'v_qk_freiwkontrzaehlung_ohnemethode');
    addDataFromViewToQsList(qsList, 'v_qk_feldkontrzaehlung_ohneanzahl');
    addDataFromViewToQsList(qsList, 'v_qk_freiwkontrzaehlung_ohneanzahl');
    // TPop-Bericht ohne Jahr/Entwicklung
    addDataFromViewToQsList(qsList, 'v_qk_tpopber_ohnejahr');
    addDataFromViewToQsList(qsList, 'v_qk_tpopber_ohneentwicklung');
    // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
    addDataFromViewToQsList(qsList, 'v_qk_popber_ohnejahr');
    addDataFromViewToQsList(qsList, 'v_qk_popber_ohneentwicklung');
    addDataFromViewToQsList(qsList, 'v_qk_popmassnber_ohnejahr');
    addDataFromViewToQsList(qsList, 'v_qk_popmassnber_ohneentwicklung');
    // Ziel ohne Jahr/Zieltyp/Ziel
    addDataFromViewToQsList(qsList, 'v_qk_ziel_ohnejahr');
    addDataFromViewToQsList(qsList, 'v_qk_ziel_ohnetyp');
    addDataFromViewToQsList(qsList, 'v_qk_ziel_ohnetyp');
    // Ziel-Bericht ohne Jahr/Entwicklung
    addDataFromViewToQsList(qsList, 'v_qk_ziel_ohneziel');
    addDataFromViewToQsList(qsList, 'v_qk_zielber_ohneentwicklung');
    // AP-Erfolgskriterium ohne Beurteilung/Kriterien
    addDataFromViewToQsList(qsList, 'v_qk_erfkrit_ohnebeurteilung');
    addDataFromViewToQsList(qsList, 'v_qk_erfkrit_ohnekriterien');
    // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung
    // assoziierte Art ohne Art
};