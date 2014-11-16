// wird aufgerufen, wenn der ap geändert wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (apId) {
    var initiiereAp = require('./initiiereAp'),
        programm = $("[name='programm_wahl']:checked").attr("id"),
        ap_waehlen_text,
        placeholderText = 'Artförderprogramm wählen',
        zeigeFormular   = require('./zeigeFormular'),
        waehleApliste   = require('./waehleApliste'),
        melde           = require('./melde');

    if (apId) {
        // einen AP gewählt
        localStorage.apId = apId;

        if (programm === "programm_neu") {
            // zuerst einen neuen Datensatz anlegen
            $.ajax({
                type: 'post',
                url: 'api/v1/apInsert/apId=' + apId + '/user=' + sessionStorage.User
            }).done(function () {
                // nachdem ein neues Programm erstellt wurde, soll nicht mehr "neu" zur Wahl stehen, sondern "alle"
                $("#programm_neu").attr("checked", false);
                $("#programm_alle").attr("checked", true);
                $("#programm_wahl").buttonset();
                // alle zwischengespeicherten aplisten löschen
                delete window.apf.apliste;
                // Auswahlliste für Programme updaten
                $.when(waehleApliste("programm_alle")).then(function () {
                    // Strukturbaum updaten
                    $.when(window.apf.erstelle_tree(apId)).then(function () {
                        // gewählte Art in Auswahlliste anzeigen
                        ap_waehlen_text = _.find(window.apf.apliste.programm_alle, function (art) {
                            return art.id == apId;
                        });
                        if (ap_waehlen_text) {
                            $('#ap_waehlen').val(apId);
                            $('#ap_waehlen_text').val(ap_waehlen_text.label);
                        }
                        $("#ApArtId").val(apId);
                        // gewählte Art in Formular anzeigen
                        initiiereAp(apId);
                    });
                });
            }).fail(function () {
                melde("Fehler: Keine Daten für Programme erhalten");
            });
        } else {
            window.apf.erstelle_tree(apId);
            $("#ap").show();
            initiiereAp(apId);
        }
    } else {
        // leeren Wert gewählt
        $('#ap_waehlen_text').val('');
        if (programm === 'programm_neu') { placeholderText = 'Art für neues Förderprogramm wählen'; }
        if (programm === 'programm_ap')  { placeholderText = 'Aktionsplan wählen' };
        $("#ap_waehlen_text").attr('placeholder', placeholderText);
        $("#tree").hide();
        $("#suchen").hide();
        $("#exportieren_2").hide();
        $("#hilfe").hide();
        $("#ap_loeschen").hide();
        $("#exportieren_1").show();
        $("#ap").hide();
        zeigeFormular();
        history.pushState(null, null, "index.html");
    }
};

module.exports = returnFunction;