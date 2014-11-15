/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _ = require('underscore'),
    $ = require('jquery');

$.jstree = require('jquery.jstree');

var returnFunction = function (node) {
    var items,
        aktiverNode,
        aktiver_nodeText,
        parentNode,
        parent_nodeText,
        grandparentNode,
        neue_apziele_node,
        zeigeTPop                                  = require('../zeigeTPop'),
        insertNeuenNodeEineHierarchiestufeTiefer   = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
        insertNeuenNodeAufGleicherHierarchiestufe  = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
        frageObUndeleteDatensatz                   = require('../frageObUndeleteDatensatz'),
        melde                                      = require('../melde'),
        zeigeBeobKoordinatenImGisBrowser           = require('../zeigeBeobKoordinatenImGisBrowser'),
        erstelleIdAusDomAttributId                 = require('../erstelleIdAusDomAttributId');

    // relevante nodes zwischenspeichern
    aktiverNode = node;
    aktiver_nodeText = $.jstree._reference(aktiverNode).get_text(aktiverNode);
    // parent nur ermitteln, wenn parents exisiteren - sonst gibt es einen Fehler
    if ($(aktiverNode).attr("typ").slice(0, 9) !== "ap_ordner" && $(aktiverNode).attr("typ") !== "idealbiotop") {
        parentNode = $.jstree._reference(aktiverNode)._get_parent(aktiverNode);
        parent_nodeText = $.jstree._reference(parentNode).get_text(parentNode);
    }
    switch ($(aktiverNode).attr("typ")) {
    case "ap_ordner_pop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Population",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPop = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopulation/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertPop.done(function (id) {
                        var strukturtyp = "pop",
                            beschriftung = "neue Population";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPop.fail(function () {
                        melde("Fehler: Keine neue Population erstellt");
                    });
                }
            },
            "GeoAdminMaps": {
                "label": "auf CH-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_gelb.png",
                "action": function () {
                    var zeigePop = require('../olmap/zeigePop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/popsChKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data && data.length > 0) {
                            zeigePop(data);
                        } else {
                            melde("Die Population hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GoogleMaps": {
                "label": "auf Google-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    var getApKarte = $.ajax({
                        type: 'get',
                        url: 'api/v1/apKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    });
                    getApKarte.done(function (data) {
                        if (data && data.length > 0) {
                            zeigeTPop(data);
                        } else {
                            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                        }
                    });
                    getApKarte.fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            }
        };
        if (window.apf.pop_zum_verschieben_gemerkt) {
            items.einfuegen = {
                "label": "'" + window.apf.pop_bezeichnung + "' einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    // db aktualisieren
                    var updatePop = $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + window.apf.pop_id + '/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    updatePop.done(function () {
                        // Baum neu aufbauen
                        $.when(window.apf.erstelle_tree(erstelleIdAusDomAttributId($(aktiverNode).attr("id"))))
                            .then(function () {
                                // dann den eingefügten Node wählen
                                $("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id);
                            });
                        // einfügen soll nicht mehr angezeigt werden
                        delete window.apf.pop_zum_verschieben_gemerkt;
                        // nicht mehr benötigte Variablen entfernen
                        delete window.apf.pop_bezeichnung;
                        delete window.apf.pop_id;
                    });
                    updatePop.fail(function () {
                        melde("Fehler: Die Population wurde nicht verschoben");
                    });
                }
            };
        }
        return items;
    case "ap_ordner_apziel":
        return {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neues Ziel",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertApziel = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblZiel/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertApziel.done(function (id) {
                        var strukturtyp = "apziel",
                            beschriftung = "neues Ziel";
                        // mitteilen, dass von ganz oben ein apziel erstellt wird und daher noch ein Zwischenordner erstellt werden muss
                        localStorage.apziel_von_ordner_apziel = true;
                        // zur Sicherheit den anderen Zeiger löschen
                        delete localStorage.apziel_von_apzieljahr;
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertApziel.fail(function () {
                        melde("Fehler: Keine neues AP-Ziel erstellt");
                    });
                }
            }
        };
    case "apzieljahr":
        return {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neues Ziel",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertApziel_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblZiel/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertApziel_2.done(function (id) {
                        var strukturtyp = "apziel",
                            beschriftung = "neues Ziel";
                        localStorage.apziel_von_apzieljahr = true;
                        // zur Sicherheit den anderen Zeiger löschen
                        delete localStorage.apziel_von_ordner_apziel;
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertApziel_2.fail(function () {
                        melde("Fehler: Keine neues Ziel erstellt");
                    });
                }
            }
        };
    case "apziel":
        return {
            "neu": {
                "label": "neues Ziel",
                "icon": "style/images/neu.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    grandparentNode = $.jstree._reference(parentNode)._get_parent(parentNode);
                    var insertApziel_3 = $.ajax( {
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblZiel/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(grandparentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertApziel_3.done(function (id) {
                        var strukturtyp = "apziel",
                            beschriftung = "neues Ziel";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertApziel_3.fail(function () {
                        melde("Fehler: Kein neues AP-Ziel erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Das AP-Ziel '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.apziel;
                                window.apf.deleted.typ = "apziel";
                                var deleteApziel = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblZiel/tabelleIdFeld=ZielId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteApziel.done(function () {
                                    delete localStorage.apziel_id;
                                    delete window.apf.apziel;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // grandparent Node-Beschriftung: Anzahl anpassen
                                    grandparentNode = $.jstree._reference(parentNode)._get_parent(parentNode);
                                    window.apf.beschrifte_ordner_apziel(grandparentNode);
                                    // parent Node-Beschriftung: Anzahl anpassen
                                    if ($.jstree._reference(parentNode).get_text(parentNode) !== "neue AP-Ziele") {
                                        window.apf.beschrifte_ordner_apzieljahr(parentNode);
                                    }
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Das AP-Ziel '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteApziel.fail(function () {
                                    melde("Fehler: Das AP-Ziel wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "zielber_ordner":
        return {
            "neu": {
                "label": "neuer Ziel-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertZielber = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblZielBericht/feld=ZielId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertZielber.done(function (id) {
                        var strukturtyp = "zielber",
                            beschriftung = "neuer Ziel-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertZielber.fail(function () {
                        melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
                    });
                }
            }
        };
    case "zielber":
        return {
            "neu": {
                "label": "neuer Ziel-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertZielber_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblZielBericht/feld=ZielId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertZielber_2.done(function (id) {
                        var strukturtyp = "zielber",
                            beschriftung = "neuer Ziel-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertZielber_2.fail(function () {
                        melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Ziel-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.zielber;
                                window.apf.deleted.typ = "zielber";
                                var deleteZielber = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblZielBericht/tabelleIdFeld=ZielBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteZielber.done(function () {
                                    delete localStorage.zielber_id;
                                    delete window.apf.zielber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_zielber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Ziel-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteZielber.fail(function () {
                                    melde("Fehler: Der Ziel-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "ap_ordner_erfkrit":
        return {
            "neu": {
                "label": "neues Erfolgskriterium",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertErfkrit = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblErfKrit/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertErfkrit.done(function (id) {
                        var strukturtyp = "erfkrit",
                            beschriftung = "neues Erfolgskriterium";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertErfkrit.fail(function () {
                        melde("Fehler: Kein neues Erfolgskriterium erstellt");
                    });
                }
            }
        };
    case "erfkrit":
        return {
            "neu": {
                "label": "neues Erfolgskriterium",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertErfkrit_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblErfKrit/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertErfkrit_2.done(function (id) {
                        var strukturtyp = "erfkrit",
                            beschriftung = "neues Erfolgskriterium";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertErfkrit_2.fail(function () {
                        melde("Fehler: Kein neues Erfolgskriterium erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Das Erfolgskriterium '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.erfkrit;
                                window.apf.deleted.typ = "erfkrit";
                                var deleteErfkrit = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblErfKrit/tabelleIdFeld=ErfkritId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteErfkrit.done(function () {
                                    delete localStorage.erfkrit_id;
                                    delete window.apf.erfkrit;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_erfkrit(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Das Erfolgskriterium '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteErfkrit.fail(function () {
                                    melde("Fehler: Das Erfolgskriterium wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "ap_ordner_jber":
        return {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neuer AP-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertJber = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblJBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertJber.done(function (id) {
                        var strukturtyp = "jber",
                            beschriftung = "neuer AP-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertJber.fail(function () {
                        melde("Fehler: Keinen neuen AP-Bericht erstellt");
                    });
                }
            }
        };
    case "jber":
        items = {
            "neu": {
                "label": "neuer AP-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertJber_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblJBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertJber_2.done(function (id) {
                        var strukturtyp = "jber",
                            beschriftung = "neuer AP-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertJber_2.fail(function () {
                        melde("Fehler: Keinen neuen AP-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der AP-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.jber;
                                window.apf.deleted.typ = "jber";
                                var deleteJber = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblJBer/tabelleIdFeld=JBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteJber.done(function () {
                                    delete localStorage.jber_id;
                                    delete window.apf.jber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_jber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der AP-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteJber.fail(function () {
                                    melde("Fehler: Der AP-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
        // Wenn noch keine existiert, kann einen neue Übersicht zu allen Arten erstellt werden
        if ($.jstree._reference(aktiverNode)._get_children(aktiverNode).length === 0) {
            items.neu_jber_uebersicht = {
                "label": "neue Übersicht zu allen Arten",
                "separator_before": true,
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertJberUebersicht = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblJBerUebersicht/feld=JbuJahr/wert=' + $.jstree._reference(aktiverNode).get_text(aktiverNode) + '/user=' + sessionStorage.User
                    });
                    insertJberUebersicht.done(function () {
                        var strukturtyp = "jber_uebersicht",
                            dsId = $.jstree._reference(aktiverNode).get_text(aktiverNode),
                            beschriftung = "neue Übersicht zu allen Arten";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, dsId, beschriftung);
                    });
                    insertJberUebersicht.fail(function () {
                        melde("Fehler: Keine Übersicht zu allen Arten erstellt");
                    });
                }
            };
        }
        return items;
    case "jber_uebersicht":
        return {
            "loeschen": {
                "label": "lösche Übersicht zu allen Arten",
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Übersicht zu allen Arten wird gelöscht");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.jber_übersicht;
                                window.apf.deleted.typ = "jber_uebersicht";
                                var deleteJberUebersicht = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblJBerUebersicht/tabelleIdFeld=JbuJahr/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteJberUebersicht.done(function () {
                                    delete localStorage.jber_uebersicht_id;
                                    delete window.apf.jber_übersicht;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz('Die Übersicht für den AP-Bericht des Jahrs "' + window.apf.deleted.JbuJahr + '" wurde gelöscht.');
                                });
                                deleteJberUebersicht.fail(function () {
                                    melde("Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "ap_ordner_ber":
        return {
            "neu": {
                "label": "neuer Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) +'/user=' + sessionStorage.User
                    });
                    insertBer.done(function (id) {
                        var strukturtyp = "ber",
                            beschriftung = "neuer Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertBer.fail(function () {
                        melde("Fehler: Keinen neuen Bericht erstellt");
                    });
                }
            }
        };
    case "ber":
        return {
            "neu": {
                "label": "Neuer Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) +'/user=' + sessionStorage.User
                    });
                    insertBer_2.done(function (id) {
                        var strukturtyp = "ber",
                            beschriftung = "neuer Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertBer_2.fail(function () {
                        melde("Fehler: Keinen neuen Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.ber;
                                window.apf.deleted.typ = "ber";
                                var deleteBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblBer/tabelleIdFeld=BerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteBer.done(function () {
                                    delete localStorage.ber_id;
                                    delete window.apf.ber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_ber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteBer.fail(function () {
                                    melde("Fehler: Der Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "ap_ordner_assozarten":
        return {
            "neu": {
                "label": "neue assoziierte Art",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertAssozarten = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblAssozArten/feld=AaApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertAssozarten.done(function (id) {
                        var strukturtyp = "assozarten",
                            beschriftung = "neue assoziierte Art";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertAssozarten.fail(function () {
                        melde("Fehler: keine assoziierte Art erstellt");
                    });
                }
            }
        };
    case "assozarten":
        return {
            "neu": {
                "label": "neue assoziierte Art",
                "icon": "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblAssozArten/feld=AaApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    }).done(function (id) {
                        var strukturtyp = "assozarten",
                            beschriftung = "neue assoziierte Art";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keine assoziierte Art erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die assoziierte Art '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.assozarten;
                                window.apf.deleted.typ = "assozarten";
                                var deleteAssozarten = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblAssozArten/tabelleIdFeld=AaId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteAssozarten.done(function () {
                                    delete localStorage.assozarten_id;
                                    delete window.apf.assozarten;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_assozarten(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die assoziierte Art '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteAssozarten.fail(function () {
                                    melde("Fehler: Die assoziierte Art wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "pop":
        items = {
            "neu": {
                "label": "neue Population",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPop_2 = $.ajax( {
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopulation/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertPop_2.done(function (id) {
                        var strukturtyp = "pop",
                            beschriftung = "neue Population";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPop_2.fail(function () {
                        melde("Fehler: Keine neue Population erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Population '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.pop;
                                window.apf.deleted.typ = "pop";
                                var deletePop = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deletePop.done(function () {
                                    delete localStorage.pop_id;
                                    delete window.apf.pop;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_pop(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Population '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deletePop.fail(function () {
                                    melde("Fehler: Die Population wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            },
            "GeoAdminMaps": {
                "label": "auf CH-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_gelb.png",
                "action": function () {
                    var zeigePop = require('../olmap/zeigePop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/popChKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data && data.length > 0) {
                            zeigePop(data);
                        } else {
                            melde("Die Population hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Populationen erhalten");
                    });
                }
            },
            "GoogleMaps": {
                "label": "auf Google-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    var getPopKarte = $.ajax({
                        type: 'get',
                        url: 'api/v1/popKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    });
                    getPopKarte.done(function (data) {
                        if (data && data.length > 0) {
                            zeigeTPop(data);
                        } else {
                            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                        }
                    });
                    getPopKarte.fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            }
        };
        if (!window.apf.pop_zum_verschieben_gemerkt) {
            items.ausschneiden = {
                "label": "zum Verschieben merken",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // Jetzt die PopId merken - ihr muss danach eine andere ApArtId zugeteilt werden
                    window.apf.pop_id = erstelleIdAusDomAttributId($(aktiverNode).attr("id"));
                    // merken, dass ein node ausgeschnitten wurde
                    window.apf.pop_zum_verschieben_gemerkt = true;
                    // und wie er heisst (um es später im Kontextmenü anzuzeigen)
                    window.apf.pop_bezeichnung = $("#PopNr").val() + " " + $("#PopName").val();

                }
            };
        }
        if (window.apf.pop_zum_verschieben_gemerkt) {
            items.einfuegen = {
                "label": "'" + window.apf.pop_bezeichnung + "' einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var popid = window.apf.pop_id;
                    var apartid = erstelleIdAusDomAttributId($(parentNode).attr("id"));
                    // db aktualisieren
                    var updatePop_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + popid + '/feld=ApArtId/wert=' + apartid + '/user=' + sessionStorage.User
                    });
                    updatePop_2.done(function () {
                        // Baum wieder aufbauen
                        $.when(window.apf.erstelle_tree(apartid))
                            .then(function () {
                                // dann den eingefügten Node wählen
                                $("#tree").jstree("select_node", "[typ='pop']#" + popid);
                            });
                        // einfügen soll nicht mehr angezeigt werden
                        delete window.apf.pop_zum_verschieben_gemerkt;
                        // nicht mehr benötigte Variablen entfernen
                        delete window.apf.pop_bezeichnung;
                        delete window.apf.pop_id;
                    });
                    updatePop_2.fail(function () {
                        melde("Fehler: Die Population wurde nicht verschoben");
                    });
                }
            };
        }
        return items;
    case "pop_ordner_tpop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Teilpopulation",
                "icon": "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilpopulation/feld=PopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    }).done(function (id) {
                        var strukturtyp = "tpop",
                            beschriftung = "neue Teilpopulation";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keine neue Teilpopulation erstellt");
                    });
                }
            },
            "GeoAdminMaps": {
                "label": "auf CH-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_gelb.png",
                "action": function () {
                    var zeigeTPop = require('../olmap/zeigeTPop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/tpopsKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeTPop(data);
                        } else {
                            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            },
            "GoogleMaps": {
                "label": "auf Google-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    var getPopKarte_2 = $.ajax({
                        type: 'get',
                        url: 'api/v1/popKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    });
                    getPopKarte_2.done(function (data) {
                        if (data && data.length > 0) {
                            zeigeTPop(data);
                        } else {
                            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                        }
                    });
                    getPopKarte_2.fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            }
        };
        if (window.apf.tpop_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpop_node_ausgeschnitten).get_text(window.apf.tpop_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpop_node_ausgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpop_node_kopiert) {
            label = "";
            if (window.apf.tpopObjektKopiert.TPopNr) {
                label += window.apf.tpopObjektKopiert.TPopNr;
            } else {
                label += "(keine Nr.)";
            }
            label += ": ";
            if (window.apf.tpopObjektKopiert.TPopFlurname) {
                label += window.apf.tpopObjektKopiert.TPopFlurname;
            } else {
                label += "(kein Flurname)";
            }
            items.einfuegen = {
                //"label": $.jstree._reference(window.apf.tpop_node_kopiert).get_text(window.apf.tpop_node_kopiert) + " einfügen",
                "label": label + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    window.apf.tpopKopiertInPopOrdnerTpopEinfügen(aktiverNode);
                }
            };
        }
        return items;
    case "tpop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Teilpopulation",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPop_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilpopulation/feld=PopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPop_2.done(function (id) {
                        var strukturtyp = "tpop",
                            beschriftung = "neue Teilpopulation";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPop_2.fail(function () {
                        melde("Fehler: Keine neue Teilpopulation erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Teilpopulation '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpop;
                                window.apf.deleted.typ = "tpop";
                                // löschen
                                var deleteTPop = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPop.done(function () {
                                    delete localStorage.tpop_id;
                                    delete window.apf.tpop;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_tpop(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Teilpopulation '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPop.fail(function () {
                                    melde("Fehler: Die Teilpopulation wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            },
            "GeoAdminMaps": {
                "label": "auf CH-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_gelb.png",
                "action": function () {
                    var zeigeTPop = require('../olmap/zeigeTPop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/tpopKarte/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeTPop(data);
                        } else {
                            melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            },
            "verortenGeoAdmin": {
                "label": "auf CH-Karten verorten",
                "separator_before": true,
                "icon": "style/images/flora_icon_rot.png",
                "action": function () {
                    var verorteTPop = require('../olmap/verorteTPop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        verorteTPop(data[0]);
                    }).fail(function () {
                        melde("Fehler: Keine Teilpopulation erhalten");
                    });
                }
            },
            "GoogleMaps": {
                "label": "auf Google-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/tpopKarte/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeTPop(data);
                        } else {
                            melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "verorten": {
                "label": "auf Google-Karten verorten",
                "separator_before": true,
                "icon": "style/images/flora_icon_rot.png",
                "action": function () {
                    var verorteTPop = require('../gmap/verorteTPop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        verorteTPop(data[0]);
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.tpop_node_ausgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpop_node_ausgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpop_node_kopiert;
                    delete window.apf.tpopObjektKopiert;
                }
            };
        }
        if (!window.apf.tpop_node_ausgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpop_node_kopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPop_4 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId($(tpop_node_kopiert).attr("id"))
                    });
                    getTPop_4.done(function (data) {
                        window.apf.tpopObjektKopiert = data[0];
                    });
                    getTPop_4.fail(function () {
                        melde("Fehler: Die Teilpopulation wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpop_node_kopiert) {
            var label = "";
            if (window.apf.tpopObjektKopiert.TPopNr) {
                label += window.apf.tpopObjektKopiert.TPopNr;
            } else {
                label += "(keine Nr.)";
            }
            label += ": ";
            if (window.apf.tpopObjektKopiert.TPopFlurname) {
                label += window.apf.tpopObjektKopiert.TPopFlurname;
            } else {
                label += "(kein Flurname)";
            }
            items.einfuegen = {
                "label": label + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    window.apf.tpopKopiertInPopOrdnerTpopEinfügen(parentNode);
                }
            };
        }
        if (window.apf.tpop_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpop_node_ausgeschnitten).get_text(window.apf.tpop_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpop_node_ausgeschnitten, parentNode, "first", false);
                }
            };
        }
        return items;
    case "pop_ordner_popber":
        return {
            "neu": {
                "label": "neuer Populations-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopber = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertPopber.done(function (id) {
                        var strukturtyp = "popber",
                            beschriftung = "neuer Populations-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopber.fail(function () {
                        melde("Fehler: Keinen neuen Populations-Bericht erstellt");
                    });
                }
            }
        };
    case "popber":
        return {
            "neu": {
                "label": "neuer Populations-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopber_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertPopber_2.done(function (id) {
                        var strukturtyp = "popber",
                            beschriftung = "neuer Populations-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopber_2.fail(function () {
                        melde("Fehler: Keinen neuen Populations-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Populations-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.popber;
                                window.apf.deleted.typ = "popber";
                                var deletePopber = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblPopBericht/tabelleIdFeld=PopBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deletePopber.done(function () {
                                    delete localStorage.popber_id;
                                    delete window.apf.popber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_popber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Populations-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deletePopber.fail(function () {
                                    melde("Fehler: Der Populations-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "pop_ordner_massnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopMassnBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopMassnBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertPopMassnBer.done(function (id) {
                        var strukturtyp = "popmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopMassnBer.fail(function () {
                        melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
                    });
                }
            }
        };
    case "popmassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopMassnBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopMassnBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertPopMassnBer_2.done(function (id) {
                        var strukturtyp = "popmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopMassnBer_2.fail(function () {
                        melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.popmassnber;
                                window.apf.deleted.typ = "popmassnber";
                                var deletePopMassnBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblPopMassnBericht/tabelleIdFeld=PopMassnBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deletePopMassnBer.done(function () {
                                    delete localStorage.popmassnber_id;
                                    delete window.apf.popmassnber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_popmassnber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deletePopMassnBer.fail(function () {
                                    melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "tpop_ordner_feldkontr":
        items = {
            "neu": {
                "label": "neue Feldkontrolle",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrtyp=tpopfeldkontr/user=' + sessionStorage.User
                    });
                    insertTPopFeldKontr.done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = "neue Feldkontrolle";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr.fail(function () {
                        melde("Fehler: Keine neue Feldkontrolle erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopfeldkontr_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontr_node_ausgeschnitten).get_text(window.apf.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopfeldkontr_node_ausgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopfeldkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.User
                    }).done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopfeldkontr":
        items = {
            "neu": {
                "label": "neue Feldkontrolle",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrtyp=tpopfeldkontr/user=' + sessionStorage.User
                    });
                    insertTPopFeldKontr_2.done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = "neue Feldkontrolle";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr_2.fail(function () {
                        melde("Fehler: Keine neue Feldkontrolle erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Feldkontrolle '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopfeldkontr;
                                window.apf.deleted.typ = "tpopfeldkontr";
                                var deleteTPopFeldKontr = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/tabelleIdFeld=TPopKontrId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopFeldKontr.done(function () {
                                    delete localStorage.tpopfeldkontr_id;
                                    delete window.apf.tpopfeldkontr;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_tpopfeldkontr(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Feldkontrolle '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopFeldKontr.fail(function () {
                                    melde("Fehler: Die Feldkontrolle wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            },
            "biotop_kopieren": {
                "label": "Biotop kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    delete window.apf.feldkontr_biotop;
                    window.apf.feldkontr_biotop = {};
                    var $TPopKontrFlaeche = $("#TPopKontrFlaeche");
                    if ($TPopKontrFlaeche.val()) {
                        window.apf.feldkontr_biotop.TPopKontrFlaeche = $TPopKontrFlaeche.val();
                    }
                    var $TPopKontrLeb = $("#TPopKontrLeb");
                    if ($TPopKontrLeb.val()) {
                        window.apf.feldkontr_biotop.TPopKontrLeb = $TPopKontrLeb.val();
                    }
                    var $TPopKontrLebUmg = $("#TPopKontrLebUmg");
                    if ($TPopKontrLebUmg.val()) {
                        window.apf.feldkontr_biotop.TPopKontrLebUmg = $TPopKontrLebUmg.val();
                    }
                    var $TPopKontrVegTyp = $("#TPopKontrVegTyp");
                    if ($TPopKontrVegTyp.val()) {
                        window.apf.feldkontr_biotop.TPopKontrVegTyp = $TPopKontrVegTyp.val();
                    }
                    var $TPopKontrKonkurrenz = $("#TPopKontrKonkurrenz");
                    if ($TPopKontrKonkurrenz.val()) {
                        window.apf.feldkontr_biotop.TPopKontrKonkurrenz = $TPopKontrKonkurrenz.val();
                    }
                    var $TPopKontrMoosschicht = $("#TPopKontrMoosschicht");
                    if ($TPopKontrMoosschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrMoosschicht = $TPopKontrMoosschicht.val();
                    }
                    var $TPopKontrKrautschicht = $("#TPopKontrKrautschicht");
                    if ($TPopKontrKrautschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrKrautschicht = $TPopKontrKrautschicht.val();
                    }
                    var $TPopKontrStrauchschicht = $("#TPopKontrStrauchschicht");
                    if ($TPopKontrStrauchschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrStrauchschicht = $TPopKontrStrauchschicht.val();
                    }
                    var $TPopKontrBaumschicht = $("#TPopKontrBaumschicht");
                    if ($TPopKontrBaumschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrBaumschicht = $TPopKontrBaumschicht.val();
                    }
                    var $TPopKontrBodenTyp = $("#TPopKontrBodenTyp");
                    if ($TPopKontrBodenTyp.val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenTyp = $TPopKontrBodenTyp.val();
                    }
                    var $TPopKontrBodenKalkgehalt = $("#TPopKontrBodenKalkgehalt");
                    if ($TPopKontrBodenKalkgehalt.val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenKalkgehalt = $TPopKontrBodenKalkgehalt.val();
                    }
                    if ($("#TPopKontrBodenDurchlaessigkeit").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenDurchlaessigkeit = $("#TPopKontrBodenDurchlaessigkeit").val();
                    }
                    if ($("#TPopKontrBodenHumus").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenHumus = $("#TPopKontrBodenHumus").val();
                    }
                    if ($("#TPopKontrBodenNaehrstoffgehalt").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenNaehrstoffgehalt = $("#TPopKontrBodenNaehrstoffgehalt").val();
                    }
                    if ($("#TPopKontrBodenAbtrag").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenAbtrag = $("#TPopKontrBodenAbtrag").val();
                    }
                    if ($("#TPopKontrWasserhaushalt").val()) {
                        window.apf.feldkontr_biotop.TPopKontrWasserhaushalt = $("#TPopKontrWasserhaushalt").val();
                    }
                    if ($("#TPopKontrHandlungsbedarf").val()) {
                        window.apf.feldkontr_biotop.TPopKontrHandlungsbedarf = $("#TPopKontrHandlungsbedarf").val();
                    }
                }
            }
        };
        if (window.apf.feldkontr_biotop) {
            items.biotop_einfuegen = {
                "label": "Biotop einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var data = {};
                    data.id = erstelleIdAusDomAttributId($(aktiverNode).attr("id"));
                    data.user = sessionStorage.User;
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    _.each(window.apf.feldkontr_biotop, function (value, key) {
                        $("#" + key).val(value);
                        data[key] = value;
                    });
                    // jetzt alles speichern
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/updateMultiple/apflora/tabelle=tblTeilPopFeldkontrolle/felder=' + JSON.stringify(data)
                    }).fail(function () {
                        melde("Fehler: Das kopierte Biotop wurde nicht eingefügt");
                    });
                }
            };
        }
        if (!window.apf.tpopfeldkontr_node_ausgeschnitten) {
            items.ausschneiden = {
                //"label": "Feldkontrolle ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfeldkontr_node_ausgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopfeldkontr_node_kopiert;
                    delete window.apf.tpopfeldkontr_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopfeldkontr_node_ausgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfeldkontr_node_kopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopFeldkontr_2 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
                    });
                    getTPopFeldkontr_2.done(function (data) {
                        window.apf.tpopfeldkontr_objekt_kopiert = data[0];
                    });
                    getTPopFeldkontr_2.fail(function () {
                        melde("Fehler: Die Feldkontrolle wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpopfeldkontr_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontr_node_ausgeschnitten).get_text(window.apf.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopfeldkontr_node_ausgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.tpopfeldkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.User
                    }).done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpop_ordner_freiwkontr":
        items = {
            "neu": {
                "label": "neue Freiwilligen-Kontrolle",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr_3 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrtyp=tpopfreiwkontr/user=' + sessionStorage.User
                    });
                    insertTPopFeldKontr_3.done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = "neue Freiwilligen-Kontrolle";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr_3.fail(function () {
                        melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopfreiwkontr_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_ausgeschnitten).get_text(window.apf.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopfreiwkontr_node_ausgeschnitten, aktiverNode, "first", false);
                }
            }
        }
        if (window.apf.tpopfreiwkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.User
                    }).done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopfreiwkontr":
        items = {
            "neu": {
                "label": "neue Freiwilligen-Kontrolle",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr_4 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrtyp=tpopfreiwkontr/user=' + sessionStorage.User
                    });
                    insertTPopFeldKontr_4.done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = "neue Freiwilligen-Kontrolle";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr_4.fail(function () {
                        melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopfeldkontr;
                                window.apf.deleted.typ = "tpopfreiwkontr";
                                var deleteTPopFeldKontr_2 = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/tabelleIdFeld=TPopKontrId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopFeldKontr_2.done(function () {
                                    delete localStorage.tpopfeldkontr_id;
                                    delete localStorage.tpopfreiwkontr;
                                    delete window.apf.tpopfeldkontr;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_tpopfreiwkontr(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopFeldKontr_2.fail(function () {
                                    melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
        if (!window.apf.tpopfreiwkontr_node_ausgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfreiwkontr_node_ausgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopfreiwkontr_node_kopiert;
                    delete window.apf.tpopfreiwkontr_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopfreiwkontr_node_ausgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfreiwkontr_node_kopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopFeldkontr_3 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
                    });
                    getTPopFeldkontr_3.done(function (data) {
                        window.apf.tpopfreiwkontr_objekt_kopiert = data[0];
                    });
                    getTPopFeldkontr_3.fail(function () {
                        melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpopfreiwkontr_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_ausgeschnitten).get_text(window.apf.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopfreiwkontr_node_ausgeschnitten, parentNode, "first", false);
                    localStorage.tpopfreiwkontr = true;
                }
            };
        }
        if (window.apf.tpopfreiwkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.User
                    }).done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpop_ordner_massn":
        items = {
            "neu": {
                "label": "neue Massnahme",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopMassn = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnahme/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopMassn.done(function (id) {
                        var strukturtyp = "tpopmassn",
                            beschriftung = "neue Massnahme";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassn.fail(function () {
                        melde("Fehler: Keine neue Massnahme erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopmassn_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassn_node_ausgeschnitten).get_text(window.apf.tpopmassn_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopmassn_node_ausgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopmassn_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var insertTPopMassnKopie = $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopMassnKopie.done(function (id) {
                        var strukturtyp = "tpopmassn",
                            beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassnKopie.fail(function () {
                        melde("Fehler: Die Massnahme wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopmassn":
        items = {
            "neu": {
                "label": "neue Massnahme",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopMassn_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnahme/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopMassn_2.done(function (id) {
                        var strukturtyp = "tpopmassn",
                            beschriftung = "neue Massnahme";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassn_2.fail(function () {
                        melde("Fehler: Keine neue Massnahme erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Massnahme '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopmassn;
                                window.apf.deleted.typ = "tpopmassn";
                                var deleteTPopMassn = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/tabelleIdFeld=TPopMassnId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopMassn.done(function () {
                                    delete localStorage.tpopmassn_id;
                                    delete window.apf.tpopmassn;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_tpopmassn(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Massnahme '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopMassn.fail(function () {
                                    melde("Fehler: Die Massnahme wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
        if (!window.apf.tpopmassn_node_ausgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopmassn_node_ausgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopmassn_node_kopiert;
                    delete window.apf.tpopmassn_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopmassn_node_ausgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopmassn_node_kopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopMassn_2 = $.ajax({
                            type: 'get',
                            url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
                        }),
                        $TPopMassnTypChecked = $("#TPopMassnTyp option:checked");
                    getTPopMassn_2.done(function (data) {
                        if (data && data[0]) {
                            window.apf.tpopmassn_objekt_kopiert = data[0];
                            // den Beurteilungstext holen - ist nur mühsam aus der DB zu holen
                            window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = "";
                            if ($TPopMassnTypChecked.text()) {
                                window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = $TPopMassnTypChecked.text();
                            }
                        }
                    });
                    getTPopMassn_2.fail(function () {
                        melde("Fehler: Die Massnahme wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpopmassn_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassn_node_ausgeschnitten).get_text(window.apf.tpopmassn_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopmassn_node_ausgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.tpopmassn_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var insertTPopMassnKopie_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopMassnKopie_2.done(function (id) {
                        var strukturtyp = "tpopmassn",
                            beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassnKopie_2.fail(function () {
                        melde("Fehler: Die Massnahme wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpop_ordner_tpopber":
        return {
            "neu": {
                "label": "neuer Teilpopulations-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopBer.done(function (id) {
                        var strukturtyp = "tpopber",
                            beschriftung = "neuer Teilpopulations-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopBer.fail(function () {
                        melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
                    });
                }
            }
        };
    case "tpopber":
        return {
            "neu": {
                "label": "neuer Teilpopulations-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopBer_2.done(function (id) {
                        var strukturtyp = "tpopber",
                            beschriftung = "neuer Teilpopulations-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopBer_2.fail(function () {
                        melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Teilpopulations-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopber;
                                window.apf.deleted.typ = "tpopber";
                                var deleteTPopBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopBericht/tabelleIdFeld=TPopBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopBer.done(function () {
                                    delete localStorage.tpopber_id;
                                    delete window.apf.tpopber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_tpopber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Teilpopulations-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopBer.fail(function () {
                                    melde("Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "tpop_ordner_beob_zugeordnet":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    var zeigeTPopBeob = require('../gmap/zeigeTPopBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/beobId=/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data) {
                            zeigeTPopBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtungen mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            }
        };
        if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
            items = {};
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.beob_zugeordnet_node_ausgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.beob_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beob_node_ausgeschnitten).get_text(window.apf.beob_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beob_node_ausgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beob_zugeordnet":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    var zeigeTPopBeob = require('../gmap/zeigeTPopBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data) {
                            zeigeTPopBeob(data);
                        } else {
                            melde("Die Beobachtung hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GoogleMapsMitTPopTPopBeob": {
                "label": "auf Luftbild einer neuen<br>&nbsp;&nbsp;&nbsp;Teilpopulation zuordnen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeobUndTPop = require('../gmap/zeigeBeobUndTPop'),
                        zeigeBeob        = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (beob) {
                        if (beob && beob[0]) {
                            beob = beob[0];
                            $.ajax({
                                type: 'get',
                                url: 'api/v1/apKarte/apId=' + localStorage.ap_id
                            }).done(function (tpop) {
                                if (tpop && tpop.length > 0) {
                                    zeigeBeobUndTPop(beob, tpop);
                                } else {
                                    zeigeBeob(beob);
                                }
                            });
                        } else {
                            melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beob_zugeordnet_node_ausgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.beob_zugeordnet_node_ausgeschnitten = aktiverNode;
                }
            };
        }
        if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
            items.einfuegen_beob_zugeordnet = {
                "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.beob_zugeordnet_node_ausgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.beob_node_ausgeschnitten) {
            items.einfuegen_beob = {
                "label": $.jstree._reference(window.apf.beob_node_ausgeschnitten).get_text(window.apf.beob_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.beob_node_ausgeschnitten, parentNode, "first", false);
                }
            };
        }
        return items;
    case "tpop_ordner_massnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopMassnBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopMassnBer.done(function (id) {
                        var strukturtyp = "tpopmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassnBer.fail(function () {
                        melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
                    });
                }
            }
        };
    case "tpopmassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopMassBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.User
                    });
                    insertTPopMassBer_2.done(function (id) {
                        var strukturtyp = "tpopmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassBer_2.fail(function () {
                        melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopmassnber;
                                window.apf.deleted.typ = "tpopmassnber";
                                var deleteTPopMassnBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopMassnBericht/tabelleIdFeld=TPopMassnBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopMassnBer.done(function () {
                                    delete localStorage.tpopmassnber_id;
                                    delete window.apf.tpopmassnber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifte_ordner_popmassnber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopMassnBer.fail(function () {
                                    melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "ap_ordner_beob_nicht_beurteilt":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GoogleMapsMitTPop": {
                "label": "auf Luftbild Teilpopulationen<br>&nbsp;&nbsp;&nbsp;zuordnen<br>&nbsp;&nbsp;&nbsp;Tipp: Beobachtungen auf<br>&nbsp;&nbsp;&nbsp;Teilpopulationen ziehen!",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeobUndTPop = require('../gmap/zeigeBeobUndTPop'),
                        zeigeBeob        = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen='
                    }).done(function (beob) {
                        if (beob.length > 0) {
                            $.ajax({
                                type: 'get',
                                url: 'api/v1/apKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                            }).done(function (tpop) {
                                if (tpop && tpop.length > 0) {
                                    zeigeBeobUndTPop(beob, tpop);
                                } else {
                                    zeigeBeob(beob);
                                } 
                            });
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            }
        };
        if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beob_nicht_beurteilt":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data && data[0]) {
                            zeigeBeob(data[0]);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GoogleMapsMitTPopBeob": {
                "label": "auf Luftbild einer Teilpopulation<br>&nbsp;&nbsp;&nbsp;zuordnen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeobUndTPop = require('../gmap/zeigeBeobUndTPop'),
                        zeigeBeob        = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (beob) {
                        if (beob && beob[0]) {
                            beob = beob[0];
                            $.ajax({
                                type: 'get',
                                url: 'api/v1/apKarte/apId=' + erstelleIdAusDomAttributId($(parentNode).attr("id"))
                            }).done(function (tpop) {
                                if (tpop && tpop.length > 0) {
                                    zeigeBeobUndTPop(beob, tpop);
                                } else {
                                    zeigeBeob(beob);
                                }
                            });
                        } else {
                            melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beob_node_ausgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.beob_node_ausgeschnitten = aktiverNode;
                }
            };
        }
        if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, parentNode, "first");
                }
            };
        }
        return items;
    case "ap_ordner_beob_nicht_zuzuordnen":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen=1'
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            }
        };
        if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beob_nicht_zuzuordnen":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data && data[0]) {
                            zeigeBeob(data[0]);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beob_node_ausgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.beob_node_ausgeschnitten = aktiverNode;
                }
            };
        }
        if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, parentNode, "first");
                }
            };
        }
        return items;
    }
};

module.exports = returnFunction;