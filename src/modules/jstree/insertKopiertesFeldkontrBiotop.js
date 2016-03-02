'use strict'

var $ = require('jquery')
var _ = require('underscore')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')
var getApiHost = require('../getApiHost')

module.exports = function (nodeFeldkontrId) {
  var data = {}
  data.id = erstelleIdAusDomAttributId(nodeFeldkontrId)
  data.user = window.sessionStorage.user
  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  _.each(window.apf.feldkontrBiotop, function (value, key) {
    $('#' + key).val(value)
    data[key] = value
  })
  // jetzt alles speichern
  $.ajax({
    type: 'put',
    url: getApiHost() + '/updateMultiple/apflora/tabelle=tpopkontr/felder=' + JSON.stringify(data)
  }).fail(function () {
    melde('Fehler: Das kopierte Biotop wurde nicht eingefügt')
  })
}
