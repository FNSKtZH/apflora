/**
 * übernimmt einen string
 * der erste Buchstabe wird mit einem Grossbuchstaben ersetzt
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var capitaliseFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = capitaliseFirstLetter;