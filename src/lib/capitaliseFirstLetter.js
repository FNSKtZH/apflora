/**
 * übernimmt einen string
 * der erste Buchstabe wird mit einem Grossbuchstaben ersetzt
 */

'use strict';

var capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = capitalizeFirstLetter;