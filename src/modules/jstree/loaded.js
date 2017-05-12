'use strict'

var $ = require('jquery')
var initiiereAp = require('../initiiereAp')
var setzeTreehoehe = require('./setzeTreehoehe')

module.exports = function (ApArtId) {
  setzeTreehoehe()
  $('#suchen').show()
  $('#exportieren2').show()
  $('#exportieren1').hide()
  $('#hilfe').show()
  if (window.apf.popZeigen) {
    $('#tree').jstree('select_node', "[typ='pop']#" + window.localStorage.popId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese Pop geöffnet wird
    delete window.apf.popZeigen
  }
  if (window.apf.popberZeigen) {
    $('#tree').jstree('select_node', "[typ='popber']#" + window.localStorage.popberId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese Popber geöffnet wird
    delete window.apf.popberZeigen
  }
  if (window.apf.popmassnberZeigen) {
    $('#tree').jstree('select_node', "[typ='popmassnber']#" + window.localStorage.popmassnberId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese popmassnber geöffnet wird
    delete window.apf.popmassnberZeigen
  }
  if (window.apf.tpopZeigen) {
    $('#tree').jstree('select_node', "[typ='tpop']#" + window.localStorage.tpopId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese TPop geöffnet wird
    delete window.apf.tpopZeigen
  }
  if (window.apf.tpopfeldkontrZeigen) {
    $('#tree').jstree('select_node', "[typ='tpopfeldkontr']#" + window.localStorage.tpopfeldkontrId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfeldkontr geöffnet wird
    delete window.apf.tpopfeldkontrZeigen
  }
  if (window.apf.tpopfreiwkontrZeigen) {
    $('#tree').jstree('select_node', '#tpopfreiwkontr' + window.localStorage.tpopfeldkontrId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfreiwkontr geöffnet wird
    delete window.apf.tpopfreiwkontrZeigen
  }
  if (window.apf.tpopmassnZeigen) {
    $('#tree').jstree('select_node', "[typ='tpopmassn']#" + window.localStorage.tpopmassnId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassn geöffnet wird
    delete window.apf.tpopmassnZeigen
  }
  if (window.apf.tpopberZeigen) {
    $('#tree').jstree('select_node', "[typ='tpopber']#" + window.localStorage.tpopberId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopber geöffnet wird
    delete window.apf.tpopberZeigen
  }
  if (window.apf.tpopmassnberZeigen) {
    $('#tree').jstree('select_node', "[typ='tpopmassnber']#" + window.localStorage.tpopmassnberId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassnber geöffnet wird
    delete window.apf.tpopmassnberZeigen
  }
  if (window.apf.apzielZeigen) {
    $('#tree').jstree('select_node', "[typ='apziel']#" + window.localStorage.apzielId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese apziel geöffnet wird
    delete window.apf.apzielZeigen
  }
  if (window.apf.zielberZeigen) {
    $('#tree').jstree('select_node', "[typ='zielber']#" + window.localStorage.zielberId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese zielber geöffnet wird
    delete window.apf.zielberZeigen
  }
  if (window.apf.erfkritZeigen) {
    $('#tree').jstree('select_node', "[typ='erfkrit']#" + window.localStorage.erfkritId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese erfkrit geöffnet wird
    delete window.apf.erfkritZeigen
  }
  if (window.apf.jberZeigen) {
    $('#tree').jstree('select_node', "[typ='jber']#" + window.localStorage.jberId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber geöffnet wird
    delete window.apf.jberZeigen
  }
  if (window.apf.jberUebersichtZeigen) {
    $('#tree').jstree('select_node', "[typ='jberUebersicht']#" + window.localStorage.jberUebersichtId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese jberUebersicht geöffnet wird
    delete window.apf.jberUebersichtZeigen
  }
  if (window.apf.berZeigen) {
    $('#tree').jstree('select_node', "[typ='ber']#" + window.localStorage.berId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese ber geöffnet wird
    delete window.apf.berZeigen
  }
  if (window.apf.idealbiotopZeigen) {
    $('#tree').jstree('select_node', "[typ='idealbiotop']#" + window.localStorage.idealbiotopId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese idealbiotop geöffnet wird
    delete window.apf.idealbiotopZeigen
  }
  if (window.apf.assozartenZeigen) {
    $('#tree').jstree('select_node', "[typ='assozarten']#" + window.localStorage.assozartenId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese assozarten geöffnet wird
    delete window.apf.assozartenZeigen
  }
  if (window.apf.apZeigen) {
    initiiereAp(ApArtId)
    // window.localStorage.apId = ApArtId
    // $('#apWaehlen').trigger('change')
    // diese Markierung entfernen, damit das nächste mal nicht mehr dieser AP geöffnet wird
    delete window.apf.apZeigen
  }
  if (window.apf.qualitaetskontrollenZeigen) {
    $('#tree').jstree('select_node', '#qualitaetskontrollen' + ApArtId)
    // diese Markierung entfernen, damit das nächste mal nicht mehr diese QK geöffnet wird
    delete window.apf.qualitaetskontrollenZeigen
  }
}
