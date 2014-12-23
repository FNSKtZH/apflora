// baut das html für den layertree auf
// Muster:
// <li><input type="checkbox" id="olmap_layertree_Ebene 1"><label for="olmap_layertree_Ebene 1">Ebene 1</label></li><hr>
// activeKategorie: der Bereich dieser Kategorie soll offen sein

/*jslint node: true, browser: true, nomen: true, todo: true, plusplus: true */
'use strict';

var _                           = require('underscore'),
    $                           = require('jquery'),
    berechneLayertreeMaxhoehe   = require('./berechneLayertreeMaxhoehe'),
    contentLayertreePop         = require('../../templates/olMap/layertreePop'),
    contentLayertreeTpop        = require('../../templates/olMap/layertreeTpop'),
    contentLayertreeEigeneEbene = require('../../templates/olMap/layertreeEigeneEbene');

module.exports = function (activeKategorie) {
    var layertitel,
        visible,
        kategorie,
        //html_welt_hintergrund = '<h3>Welt Hintergrund</h3><div>',
        htmlChHintergrund        = '<h3>Hintergrund</h3><div>',
        htmlChSachinfos          = '<h3>CH Sachinformationen</h3><div>',
        htmlChBiotopinv          = '<h3>CH Biotopinventare</h3><div>',
        htmlZhSachinfos          = '<h3>ZH Sachinformationen</h3><div>',
        htmlApflora              = '<h3>ZH AP Flora</h3><div>',
        htmlProv,
        html,
        $olMapLayertreeLayers  = $('#olMapLayertreeLayers'),
        $ga_karten_div_accordion = $("#olMapDiv").find(".accordion"),
        layers                   = window.apf.olMap.map.getLayers().getArray(),
        htmlEigeneLayerText,
        htmlEigeneLayer          = '<hr>',
        eigeneLayerZaehler       = 0,
        initializeModifyLayer    = false,
        active,
        exportLayerSelectIds     = [],
        legende,
        legendeUrl,
        initializeLegende        = false;

    htmlEigeneLayerText  = '<h3>Eigene Ebenen</h3>';
    htmlEigeneLayerText += '<div>';
    htmlEigeneLayerText += '<p>Einfach eine der folgenden Dateitypen auf die Karte ziehen:</p>';
    htmlEigeneLayerText += '<ul>';
    htmlEigeneLayerText += '<li>GPX</li>';
    htmlEigeneLayerText += '<li>GeoJSON</li>';
    htmlEigeneLayerText += '<li>IGC</li>';
    htmlEigeneLayerText += '<li>KML</li>';
    htmlEigeneLayerText += '<li>TopoJSON</li>';
    htmlEigeneLayerText += '</ul>';
    htmlEigeneLayerText += '<div id="olmapEigeneEbenenBetaContainer">';
    htmlEigeneLayerText += '<p style="font-size:10px; line-height:0.9em;">Open Layers 3 ist noch in der Beta-Phase.<br>Daher funktionieren eigene Layer nicht immer fehlerfrei.</p>';
    htmlEigeneLayerText += '</div>';
    htmlEigeneLayerText += '<div id="olmap_neues_layer_container">';
    htmlEigeneLayerText += '<input type="checkbox" class="neuesLayer" id="modifyLayerLabel">';
    htmlEigeneLayerText += '<label for="modifyLayerLabel" class="neuesLayerLabel">neue Ebene erstellen</label>';
    htmlEigeneLayerText += '</div>';

    // accordion zerstören, damit es neu aufgebaut werden kann
    // um es zu zerstören muss es initiiert sein!
    $ga_karten_div_accordion
        .accordion({collapsible: true, active: false, heightStyle: 'content'})
        .accordion("destroy");

    _.each(layers, function (layer, index) {
        layertitel = layer.get('title')      || '(Ebene ohne Titel)';
        visible    = layer.get('visible');
        kategorie  = layer.get('kategorie');
        legende    = layer.get('legende')    || false;
        legendeUrl = layer.get('legendeUrl') || null;

        if (layertitel !== 'messen') {
            htmlProv = '<li><input type="checkbox" class="olmapLayertreeCheckbox" id="olMapLayertree' + layertitel + '" value="' + index + '"';
            // sichtbare Layer sollen gecheckt sein
            if (visible) {
                htmlProv += ' checked="checked"';
            }
            htmlProv += '>';
            htmlProv += '<label for="olMapLayertree' + layertitel + '">' + layertitel + '</label>';
            // bei pop und tpop muss style gewählt werden können
            if (layertitel === 'Populationen') {
                htmlProv += contentLayertreePop();
            }
            if (layertitel === 'Teilpopulationen') {
                htmlProv += contentLayertreeTpop();
            }
            if (kategorie === 'Eigene Ebenen') {
                /*htmlProv += '<div class="layeroptionen">';
                htmlProv += '<input type="checkbox" class="modifyLayer" id="modifyLayer' + layertitel.replace(" ", "_") + '">';
                htmlProv += '<label for="modifyLayer' + layertitel.replace(" ", "_") + '" title="Ebene bearbeiten" class="modifyLayerLabel"></label>';
                htmlProv += '<select id="modifyLayerGeomType' + layertitel.replace(" ", "_") + '" class="modifyLayerGeomType apfTooltip" title="Neue Objekte zeichnen oder<br>bestehende Objekte auswählen, um sie zu verändern"><option id="modify_layer_geom_type_leerwert" value="leerwert" selected>Objekt auswählen</option><option value="Point">Punkt zeichnen</option><option value="LineString">Linie zeichnen</option><option value="Polygon">Polygon zeichnen</option></select>';
                htmlProv += '<div class="nonModifyOptions">';
                htmlProv += '<select id="export2_layer_geom_type_' + layertitel.replace(" ", "_") + '" class="exportLayerSelect apfTooltip" title="Ebene exportieren<br>Wählen Sie ein Format"><option value="leerwert" selected>exportieren</option><option value="GeoJSON">GeoJSON</option><option value="KML">KML</option><option value="GPX">GPX</option></select>';
                htmlProv += '<input type="checkbox" class="renameLayer" id="renameLayer' + layertitel.replace(" ", "_") + '">';
                htmlProv += '<label for="renameLayer' + layertitel.replace(" ", "_") + '" title="Ebene umbenennen" class="renameLayerLabel"></label>';
                htmlProv += '<input type="checkbox" class="entferneLayer" id="entferneLayer' + layertitel.replace(" ", "_") + '">';
                htmlProv += '<label for="entferneLayer' + layertitel.replace(" ", "_") + '" title="Ebene entfernen" class="entferneLayerLabel"></label>';
                htmlProv += '</div>';
                htmlProv += '<div id="eigene_layer_meldung_' + layertitel.replace(" ", "_") + '" class="eigene_layer_meldung"></div>';
                htmlProv += '</div>';*/
                htmlProv += contentLayertreeEigeneEbene({'layertitel': layertitel.replace(" ", "_")});
                initializeModifyLayer = true;
                // diese ids werden gebraucht, um tooltips zu erstellen
                exportLayerSelectIds.push('export2_layer_geom_type_' + layertitel.replace(" ", "_"));
            }
            if (legende && legendeUrl) {
                // Symbol ergänzen
                // beim hovern erscheint popup mit Legende
                htmlProv += '<a class="ui-icon ui-icon-info olmapLayertreeLegende" href="' + legendeUrl + '" target="_blank" title="' + legendeUrl + '"></a>';
                initializeLegende = true;
            }
            htmlProv += '</li>';
            htmlProv += '<hr>';
            switch (kategorie) {
            /*case "Welt Hintergrund":
                html_welt_hintergrund += htmlProv;
                break;*/
            case "Hintergrund":
                htmlChHintergrund += htmlProv;
                break;
            case "CH Sachinformationen":
                htmlChSachinfos += htmlProv;
                break;
            case "CH Biotopinventare":
                htmlChBiotopinv += htmlProv;
                break;
            case "ZH Sachinformationen":
                htmlZhSachinfos += htmlProv;
                break;
            case "AP Flora":
                htmlApflora += htmlProv;
                break;
            case "Eigene Ebenen":
                htmlEigeneLayer += htmlProv;
                eigeneLayerZaehler++;
                break;
            default:
                //htmlEigeneLayer += htmlProv;
                //eigeneLayerZaehler++;
                break;
            }
        }
    });

    // letztes <hr> abschneiden
    // aber nur, wenn layers ergänzt wurden
    // wenn keine Layers ergänzt wurden: Layertitel nicht anzeigen (nur bei htmlApflora von Bedeutung)
    //html_welt_hintergrund = html_welt_hintergrund.substring(0, (html_welt_hintergrund.length - 4));
    htmlChHintergrund = htmlChHintergrund.substring(0, (htmlChHintergrund.length - 4));
    htmlChSachinfos   = htmlChSachinfos.substring(0, (htmlChSachinfos.length - 4));
    htmlChBiotopinv   = htmlChBiotopinv.substring(0, (htmlChBiotopinv.length - 4));
    htmlZhSachinfos   = htmlZhSachinfos.substring(0, (htmlZhSachinfos.length - 4));
    if (eigeneLayerZaehler > 0) {
        htmlEigeneLayer = htmlEigeneLayer.substring(0, (htmlEigeneLayer.length - 4));
    }
    if (htmlApflora !== '<h3>ZH AP Flora</h3><div>') {
        htmlApflora = htmlApflora.substring(0, (htmlApflora.length - 4));
    } else {
        htmlApflora = '';
    }
    // unteraccordions abschliessen
    //html_welt_hintergrund += '</div>';
    htmlChHintergrund += '</div>';
    htmlChSachinfos   += '</div>';
    htmlChBiotopinv   += '</div>';
    htmlZhSachinfos   += '</div>';
    htmlApflora       += '</div>';
    if (eigeneLayerZaehler > 0) {
        htmlEigeneLayerText += htmlEigeneLayer;
    }
    htmlEigeneLayerText += '</div>';
    // alles zusammensetzen
    html = /*html_welt_hintergrund + */htmlChHintergrund + htmlChSachinfos + htmlChBiotopinv + htmlZhSachinfos + htmlApflora + htmlEigeneLayerText;
    // und einsetzen
    $olMapLayertreeLayers.html(html);
    // erst jetzt initiieren, sonst stimmt die Höhe nicht
    if (activeKategorie) {
        // ohne die erste Aktivierung funktioniert es nicht
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active:      false,
            heightStyle: 'content'
        });
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active:      0,
            heightStyle: 'content'
        });
        if (activeKategorie === 'Eigene Ebenen') {
            active = 5;
        }
        $('#olMapLayertreeLayers').accordion({
            collapsible: true,
            active:      active,
            heightStyle: 'content'
        });
    } else {
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active:      false,
            heightStyle: 'content'
        });
    }

    // Maximalgrösse des Layertree begrenzen
    $olMapLayertreeLayers.css('max-height', berechneLayertreeMaxhoehe);
    // buttons initiieren
    $('.neuesLayer')
        .button({
            icons: {primary: 'ui-icon-plusthick'}
        })
        .button('refresh');
    $('.exportLayerSelect').selectmenu();
    // jetzt tooltips erstellen
    _.each(exportLayerSelectIds, function (id) {
        // give the selectmenu a tooltip
        $('#' + id + '-button').tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            items:        'span',
            content:      'Ebene exportieren<br>Wählen Sie ein Format',
            position: {
                my: 'left bottom-5',
                at: 'left top'
            }
        });
    });
    if (initializeModifyLayer) {
        // darf erst beginnen, wenn das template fertig gerendert ist. Daher timeout
        setTimeout(function () {
            $('.modifyLayer')
                .button({
                    icons: { primary: 'ui-icon-locked' },
                    text: false
                })
                .button('refresh');
            $('.modifyLayerLabel, .exportLayerSelectLabel, .renameLayerLabel, .entferneLayerLabel, .apfTooltip')
                .tooltip({
                    tooltipClass: "tooltip-styling-hinterlegt",
                    content: function () {
                        return $(this).attr('title');
                    }
                });
            $('#modify_layer_geom_type_test-button')
                .tooltip({
                    position: {
                        my: 'left bottom-5',
                        at: 'left top'
                    }
                });
            $('.renameLayer')
                .button({
                    icons: { primary: 'ui-icon-tag' },
                    text: false
                })
                .button('refresh');
            $('.entferneLayer')
                .button({
                    icons: { primary: 'ui-icon-closethick' },
                    text: false
                })
                .button('refresh');
        }, 0);
    }
    if (initializeLegende) {
        $(".olmapLayertreeLegende").tooltip({
            tooltipClass: "tooltip_olmap_layertree_legende",
            position: {
                my: "right top+15",
                at: "right bottom",
                collision: "flipfit"
            },
            content: function () {
                var url = $(this).attr('href');
                return "<img src='" + url + "'>";
            }
        });
        // die tooltips sind beim ersten Öffnen zu weit rechts > nicht sichtbar!
        // darum alle einmal öffnen
        // ab dem zweiten mal liegen sie am richtigen Ort
        $(".olmapLayertreeLegende").each(function () {
            $(this).tooltip('open');
            $(this).tooltip('close');
        });
    }
};