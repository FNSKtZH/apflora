/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (event) {
    $(event.target).prev('input').val('').focus();
    // cancel filter
    window.apf.qsList.search();
};