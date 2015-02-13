// wird von allen Formularen benutzt
// speichert den Wert eines Feldes in einem Formular
// übernimmt das Objekt, in dem geändert wurde
// kann nicht modularisiert werden, weil jstree verwendet wird und dieses nicht mit node kompatibel ist

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    _                            = require('underscore'),
    configuration                = require('../../configuration'),
    melde                        = require('./melde'),
    pruefeSchreibvoraussetzungen = require('./pruefeSchreibvoraussetzungen'),
    speichern2                   = require('./speichern2');

module.exports = function (that) {
    var feldtyp,
        formular,
        tabelleInDb,
        tabelleIdFeld,
        tabelleId,
        feldname,
        feldwert,
        table,
        apJahr,
        bekanntSeit;

    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }

    formular = $(that).attr("formular") || $(that).data('formular');

    // infos über die betroffene Tabelle holen
    table         = _.findWhere(configuration.tables, {form: formular});
    tabelleInDb   = table.tabelleInDb;
    tabelleIdFeld = table.tabelleIdFeld;
    feldname      = $(that).data('feld') || that.name;   // tpopkontrzahl: die Namen müssen die id enthalten
    feldtyp       = $(that).attr("type") || null;

    // Feldwert ermitteln
    // wenn in speichern.js selbst ein nächster Speichervorgang ausgelöst wird, wird ein Objekt mitgegeben
    // daher nicht nur $(that), sondern auch that prüfen
    feldwert = $(that).val();
    if (feldtyp && feldtyp === "checkbox" && !$(that).is(':checked')) {
        // die geklickte Box hat den ermittelten value
        // aber sie ist jetzt nicht gechecked! > Wert = ''
        feldwert = '';
    }

    // kontrollieren, ob der Benutzer das Datum im verlangten Format erfasst hat
    if (feldwert && feldtyp && feldtyp === "date") {
        if (/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/.test(feldwert)) {
            // ja: Reihenfolge kehren - mysql will das so
            //var dataArray = feldwert.split('.');
            feldwert = feldwert.split('.').reverse().join('.');
        } else if (/[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}/.test(feldwert)) {
            // so übergibt der Kalender von Chrome
            feldwert = feldwert.split('-').join('.');
        } else {
            $(that).focus();
            return;
        }
    }

    // TPopHerkunft bzw. PopHerkunft 200 und 210 werden in derselben Schaltfläche dargestellt
    // Feldwert hängt von PopBekanntSeit bzw. TPopBekanntSeit ab:
    // PopBekanntSeit/TPopBekanntSeit >= ApJahr: 200 ("angesiedelt (nach Beginn AP), aktuell"), sonst 210 ("angesiedelt vor Beginn AP, aktuell")
    if (feldname === 'PopHerkunft') {
        apJahr = window.apf.ap.ApJahr;
        bekanntSeit = $('#PopBekanntSeit').val();
        if (apJahr && !bekanntSeit) {
            // muss gesetzt sein
            melde('Wert wird noch nicht gespeichert:<br><br>Erfassen Sie zuerst "bekannt seit",<br><br>damit die Anwendung weiss, ob die Ansiedlung vor oder nach Beginn des AP erfolgte');
            // Markierung entfernen
            $(that).prop('checked', false);
            // bekannt seit fokussieren
            $('#PopBekanntSeit').focus();
            return;
        }
        if (feldwert == 200 && apJahr && bekanntSeit < apJahr) {
            feldwert = 210;
        }
        if (feldwert == 200 && !apJahr) {
            feldwert = 210;
        }
    }
    if (feldname === 'TPopHerkunft') {
        apJahr = window.apf.ap.ApJahr;
        bekanntSeit = $('#TPopBekanntSeit').val();
        if (apJahr && !bekanntSeit) {
            // muss gesetzt sein
            melde('Wert wird noch nicht gespeichert:<br><br>Erfassen Sie zuerst "bekannt seit",<br><br>damit die Anwendung weiss, ob die Ansiedlung vor oder nach Beginn des AP erfolgte');
            // Markierung entfernen
            $(that).prop('checked', false);
            // bekannt seit fokussieren
            $('#TPopBekanntSeit').focus();
            return;
        }
        if (feldwert == 200 && apJahr && bekanntSeit < apJahr) {
            feldwert = 210;
        }
        if (feldwert == 200 && !apJahr) {
            feldwert = 210;
        }
    }

    // ja/nein Felder zu boolean umbauen
    if (feldname === "PopHerkunftUnklar" || feldname === "TPopHerkunftUnklar" || feldname === "TPopMassnPlan" || feldname === "TPopKontrPlan") {
        feldwert = (feldwert ? 1 : '');
    }
    if (feldname === "BeobBemerkungen" && localStorage.beobStatus === "nicht_beurteilt") {
        // hier soll nicht gespeichert werden
        $("#BeobBemerkungen").val("");
        melde("Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich", "Aktion abgebrochen");
        return;
    }

    tabelleId = localStorage[formular + "Id"];

    if (formular === 'tpopkontrzaehl') {
        tabelleId = $(that).closest('table').find('[name="TPopKontrZaehlId"]').val();
        // TODO: Wenn keine tabelleId, neuen Datensatz anfügen
        if (!tabelleId) {
            $.ajax({
                type: 'post',
                url: 'api/v1/insert/apflora/tabelle=tpopkontrzaehl/feld=TPopKontrId/wert=' + localStorage.tpopfeldkontrId + '/user=' + encodeURIComponent(sessionStorage.user)
            }).done(function (TPopKontrZaehlId) {
                // die Felder dieser Zählung mit der neuen id aktualisieren
                tabelleId = TPopKontrZaehlId;
                $(that).closest('table').find('[name="TPopKontrZaehlId"]').val(tabelleId);
                speichern2(that, formular, tabelleInDb, tabelleIdFeld, tabelleId, feldname, feldwert);
            });
            return;
        }
        if (!$(that).closest('table').find('[data-feld="Methode"]:checked').val() && !$(that).closest('table').find('[name="Anzahl"]').val() && !$(that).closest('table').find('[name="Zaehleinheit"]').val()) {
            // Zählung enthält keine Daten > löschen
            $.ajax({
                type: 'delete',
                url: '/api/v1/apflora/tabelle=tpopkontrzaehl/tabelleIdFeld=TPopKontrZaehlId/tabelleId=' + tabelleId
            }).done(function () {
                // die Felder dieser Zählung mit der neuen id aktualisieren
                $(that).closest('table').find('[name="TPopKontrZaehlId"]').val('');
                return;
            });
        }
    }

    speichern2(that, formular, tabelleInDb, tabelleIdFeld, tabelleId, feldname, feldwert);
};