/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (event.keyCode === 46) {
        // verhindern, dass im tree nodes gelöscht werden
        event.stopPropagation();
    }
};