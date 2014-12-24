// steuert den style von pop
// selected: mit der Maus oder drag_box markierte

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol = require('ol');

module.exports = function (feature, resolution, selected) {
    var icon = 'img/flora_icon_violett.png',
        imageStyle,
        strokeColor = 'white',
        style;

    // markierte: icon ist orange und Text hat roten Hintergrund
    if (selected) {
        icon        = 'img/flora_icon_blau.png';
        strokeColor = 'red';
    }

    imageStyle = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor:       [0.5, 36],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity:      1,
        src:          icon
    }));

    style = new ol.style.Style({
        image: imageStyle
    });

    return [style];
};