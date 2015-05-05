/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var turf           = require('turf'),
    _              = require('underscore'),
    kantoneGeoJson = require('../../geojson/chKantoneWgs84.json');

module.exports = function () {
    var zhGeojson;
    // convert koord to wgs84

    // get geojson of zh
    zhGeojson = _.find(kantoneGeoJson.features, function (feature) {
        return feature.properties.NAME === 'Zürich';
    });

    console.log('kantoneGeoJson: ', kantoneGeoJson);
    console.log('zhGeojson: ', zhGeojson);
};