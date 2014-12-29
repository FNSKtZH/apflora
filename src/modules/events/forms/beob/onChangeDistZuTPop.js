/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    // TODO: prüfen, ob ein node existiert
    // wenn nein: anders aktualisieren (ausgelöst in olmap)
    var tpopId = $(this).val();
    $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#tpopOrdnerBeobZugeordnet' + tpopId, 'first');
};