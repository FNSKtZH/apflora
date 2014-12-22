/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $         = require('jquery'),
    styleTPop = require('../../../../olMap/styleTPop');

module.exports = function () {
    var layers = window.apf.olMap.map.getLayers().getArray(),
        layer  = $('#olMapLayertreeTeilpopulationen').val(),
        that   = this;

    console.log('onClickLayertreeTpopStyle');

    // style setzen
    layers[layer].setStyle(styleTPop);
};