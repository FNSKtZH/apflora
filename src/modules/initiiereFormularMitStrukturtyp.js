'use strict'

/**
 * nimmt einen Strukturtyp des tree entgegen
 * sucht die Funktion, welche dessen Formular initiiert
 * ruft diese Funktion auf
 */

var _ = require('underscore')
var conf = require('../../configuration')
var fn = {}
var fnInitiiereFunktion

// diese Funktionen werden in ein Objekt gepackt
// Grund: Ihr Name kann für die Ausführung als String übergeben werden
fn.initiiereIdealbiotop = require('./initiiereIdealbiotop')
fn.initiiereAp = require('./initiiereAp')
fn.initiierePop = require('./initiierePop')
fn.initiiereApziel = require('./initiiereApziel')
fn.initiiereZielber = require('./initiiereZielber')
fn.initiiereErfkrit = require('./initiiereErfkrit')
fn.initiiereJber = require('./initiiereJber')
fn.initiiereJberUebersicht = require('./initiiereJberUebersicht')
fn.initiiereBer = require('./initiiereBer')
fn.initiiereAssozart = require('./initiiereAssozart')
fn.initiierePopMassnBer = require('./initiierePopMassnBer')
fn.initiiereTPop = require('./initiiereTPop')
fn.initiierePopBer = require('./initiierePopBer')
fn.initiiereTPopKontr = require('./initiiereTPopKontr')
fn.initiiereTPopMassn = require('./initiiereTPopMassn')
fn.initiiereTPopMassnBer = require('./initiiereTPopMassnBer')
fn.initiiereTPopBer = require('./initiiereTPopBer')

module.exports = function (strukturtyp) {
  if (strukturtyp === 'tpopfreiwkontr') {
    // der Initiierung mitteilen, dass es eine Freiwilligenkontrolle ist und keine Feldkontrolle
    window.localStorage.tpopfreiwkontr = true
    // Freiwilligen-Kontrollen werden von derselben Funktion initiiert, wie Feldkontrollen
    fn.initiiereTPopKontr()
    return
  }
  fnInitiiereFunktion = _.filter(conf.tables, function (table) {
    return table.treeTyp === strukturtyp
  })[0].initiiereFunktion

  fn[fnInitiiereFunktion]()
}
