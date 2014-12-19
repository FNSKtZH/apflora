/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodeApId) {
    $.ajax({
        type: 'post',
        url: 'api/v1/popInsertKopie/apId=' + erstelleIdAusDomAttributId(nodeApId) + '/popId=' + erstelleIdAusDomAttributId($(window.apf.popNodeKopiert).attr("id")) + '/user=' + encodeURIComponent(sessionStorage.user)
    }).done(function (id) {
        var strukturtyp = "pop",
            beschriftung = window.apf.popObjektKopiert.PopName;
        if (window.apf.popObjektKopiert.PopNr) {
            beschriftung = window.apf.popObjektKopiert.PopNr + ': ' + window.apf.popObjektKopiert.PopName;
        }
        if ($(aktiverNode).attr("id") === nodeApId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Die Teilpopulation wurde nicht erstellt");
    });
};