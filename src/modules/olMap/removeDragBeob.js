/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (window.apf.olMap.dragBeobInteraction) {
        window.apf.olMap.map.removeInteraction(window.apf.olMap.dragBeobInteraction);
        delete window.apf.olMap.dragBeobInteraction;
    }
};