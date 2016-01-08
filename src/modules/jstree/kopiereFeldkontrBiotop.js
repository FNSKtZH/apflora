/* jslint node: true, browser: true, nomen: true, todo: true, white: true, asi: true */
'use strict'

var $ = require('jquery')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')

module.exports = function () {
  var tpopKontrFlaeche = $('#TPopKontrFlaeche').val()
  var tpopKontrLeb = $('#TPopKontrLeb').val()
  var tpopKontrLebUmg = $('#TPopKontrLebUmg').val()
  var tpopKontrVegTyp = $('#TPopKontrVegTyp').val()
  var tpopKontrKonkurrenz = $('#TPopKontrKonkurrenz').val()
  var tpopKontrMoosschicht = $('#TPopKontrMoosschicht').val()
  var tpopKontrKrautschicht = $('#TPopKontrKrautschicht').val()
  var tpopKontrStrauchschicht = $('#TPopKontrStrauchschicht').val()
  var tpopKontrBaumschicht = $('#TPopKontrBaumschicht').val()
  var tpopKontrBodenTyp = $('#TPopKontrBodenTyp').val()
  var tpopKontrBodenKalkgehalt = $('#TPopKontrBodenKalkgehalt').val()
  var tpopKontrBodenDurchlaessigkeit = $('#TPopKontrBodenDurchlaessigkeit').val()
  var tpopKontrBodenHumus = $('#TPopKontrBodenHumus').val()
  var tpopKontrBodenNaehrstoffgehalt = $('#TPopKontrBodenNaehrstoffgehalt').val()
  var tpopKontrBodenAbtrag = $('#TPopKontrBodenAbtrag').val()
  var tpopKontrWasserhaushalt = $('#TPopKontrWasserhaushalt').val()
  var tpopKontrHandlungsbedarf = $('#TPopKontrHandlungsbedarf').val()
  var fkb

  // nur fortfahren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  delete window.apf.feldkontrBiotop
  window.apf.feldkontrBiotop = fkb = {}
  if (tpopKontrFlaeche) { fkb.TPopKontrFlaeche = tpopKontrFlaeche }
  if (tpopKontrLeb) { fkb.TPopKontrLeb = tpopKontrLeb }
  if (tpopKontrLebUmg) { fkb.TPopKontrLebUmg = tpopKontrLebUmg }
  if (tpopKontrVegTyp) { fkb.TPopKontrVegTyp = tpopKontrVegTyp }
  if (tpopKontrKonkurrenz) { fkb.TPopKontrKonkurrenz = tpopKontrKonkurrenz }
  if (tpopKontrMoosschicht) { fkb.TPopKontrMoosschicht = tpopKontrMoosschicht }
  if (tpopKontrKrautschicht) { fkb.TPopKontrKrautschicht = tpopKontrKrautschicht }
  if (tpopKontrStrauchschicht) { fkb.TPopKontrStrauchschicht = tpopKontrStrauchschicht }
  if (tpopKontrBaumschicht) { fkb.TPopKontrBaumschicht = tpopKontrBaumschicht }
  if (tpopKontrBodenTyp) { fkb.TPopKontrBodenTyp = tpopKontrBodenTyp }
  if (tpopKontrBodenKalkgehalt) { fkb.TPopKontrBodenKalkgehalt = tpopKontrBodenKalkgehalt }
  if (tpopKontrBodenDurchlaessigkeit) { fkb.TPopKontrBodenDurchlaessigkeit = tpopKontrBodenDurchlaessigkeit }
  if (tpopKontrBodenHumus) { fkb.TPopKontrBodenHumus = tpopKontrBodenHumus }
  if (tpopKontrBodenNaehrstoffgehalt) { fkb.TPopKontrBodenNaehrstoffgehalt = tpopKontrBodenNaehrstoffgehalt }
  if (tpopKontrBodenAbtrag) { fkb.TPopKontrBodenAbtrag = tpopKontrBodenAbtrag }
  if (tpopKontrWasserhaushalt) { fkb.TPopKontrWasserhaushalt = tpopKontrWasserhaushalt }
  if (tpopKontrHandlungsbedarf) { fkb.TPopKontrHandlungsbedarf = tpopKontrHandlungsbedarf }
}
