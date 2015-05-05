/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var turf           = require('turf'),
    ol             = require('ol'),
    _              = require('underscore'),
    kantoneGeoJson = require('../../geojson/chKantone.json');

module.exports = function (x, y) {
    var zhGeojson,
        koordLv03  = [x, y],
        koordWgs84,
        koordPt,
        isInsideZh = false;

    // convert koordinates to wgs84
    window.proj4.defs("EPSG:21781", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs");

    koordWgs84 = ol.proj.transform(koordLv03, 'EPSG:21781', 'EPSG:4326');

    // convert coordinates into a geoJson point
    koordPt = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": koordWgs84
        }
    };

    // get geojson of zh
    zhGeojson = _.find(kantoneGeoJson.features, function (feature) {
        return feature.properties.NAME === 'Zürich';
    });

    // let turf check if the point is in zh
    isInsideZh = turf.inside(koordPt, zhGeojson);
    return isInsideZh;
};