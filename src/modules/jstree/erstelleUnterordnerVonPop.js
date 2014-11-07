// erstellt alle Unterordner des Ordners vom Typ pop
// erwartet den node des pop-ordners

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');
$.jstree = require('jquery.jstree');

var returnFunction = function (popNode, popId) {
    $.jstree._reference(popNode).create_node(popNode, "last", {
        "data": "Teilpopulationen",
        "attr": {
            "id": popId,
            "typ": "pop_ordner_tpop"
        }
    });
    $.jstree._reference(popNode).create_node(popNode, "last", {
        "data": "Populations-Berichte",
        "attr": {
            "id": popId,
            "typ": "pop_ordner_popber"
        }
    });
    $.jstree._reference(popNode).create_node(popNode, "last", {
        "data": "Massnahmen-Berichte",
        "attr": {
            "id": popId,
            "typ": "pop_ordner_massnber"
        }
    });
};

module.exports = returnFunction;