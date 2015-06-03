'use strict'

var $ = require('jquery'),
  melde = require('./melde'),
  getApiHost = require('./getApiHost')

module.exports = function (tpop) {
  var koordAktualisiert = $.Deferred(),
    felder = {}

  // Objekt vorbereiten, das die Felder, ihre Werte und übrige benötigte Angaben enthält
  felder.id = tpop.TPopId
  felder.user = window.sessionStorage.user
  felder.TPopXKoord = tpop.TPopXKoord
  felder.TPopYKoord = tpop.TPopYKoord

  // Datensatz updaten
  // /updateMultiple/apflora/tabelle={tabelle}/felder={felder}
  $.ajax({
    type: 'post',
    url: getApiHost() + '/updateMultiple/apflora/tabelle=tpop/felder=' + JSON.stringify(felder)
  }).done(function () {
    koordAktualisiert.resolve()
  }).fail(function () {
    melde('Fehler: Die Koordinaten wurden nicht aktualisiert')
    koordAktualisiert.resolve()
  })
  return koordAktualisiert.promise()
}
