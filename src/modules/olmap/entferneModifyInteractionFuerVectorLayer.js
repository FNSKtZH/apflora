// inputDiv: div des Layers, das jetzt aktiviert wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (inputDiv) {
    var $modifyLayer = $('.modifyLayer');
    inputDiv = inputDiv || null;
    if (window.apf.olmap.modifyInteractionFuerVectorlayer) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modifyInteractionFuerVectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.selectInteractionFuerVectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.drawInteractionFuerVectorlayer);
        delete window.apf.olmap.modifyInteractionFuerVectorlayer;
        delete window.apf.olmap.selectInteractionFuerVectorlayer;
        delete window.apf.olmap.drawInteractionFuerVectorlayer;
    }
    // alle buttons im layer-tool zurückstellen
    $modifyLayer
        .button({
            icons: {primary: 'ui-icon-locked'},
            text: false
        })
        .button('refresh');
    // tooltip zurücksetzen
    $('.modify_layer_label')
        .attr('title', 'Ebene bearbeiten')
        .tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            content: 'Ebene bearbeiten'
        });
    // geom_select ausblenden
    $('.modifyLayerGeomType').hide();
    // übrige Layer deaktivieren
    $modifyLayer.each(function () {
        // sicherstellen, dass der jetzt zu aktivierende Layer nicht deaktiviert wird
        if ($(this).prop('checked') && !$(this).is(inputDiv)) {
            $(this).prop("checked", false).change();
        }
    });
};