/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var turf      = require('turf'),
    ol        = require('ol'),
    _         = require('underscore'),
    zhGeojson = require('../../geojson/ktZh.json');

module.exports = function (x, y) {
    var koordLv03  = [x, y],
        koordWgs84,
        koordPt,
        isInsideZh = false;

    // convert koordinates to wgs84
    koordWgs84 = ol.proj.transform(koordLv03, 'EPSG:21781', 'EPSG:4326');

    // convert coordinates into a geoJson point
    koordPt = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": koordWgs84
        }
    };

    // let turf check if the point is in zh
    isInsideZh = turf.inside(koordPt, zhGeojson);

    return isInsideZh;
};