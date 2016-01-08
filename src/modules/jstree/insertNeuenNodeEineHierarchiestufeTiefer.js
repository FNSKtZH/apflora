// Baut einen neuen Knoten auf der näcshttieferen Hierarchiestufe, als der Befehl aufgerufen wurde
// parentNode wird nur von Strukturtyp apziel benutzt

'use strict'

var $ = require('jquery')
var initiiereFormularMitStrukturtyp = require('../initiiereFormularMitStrukturtyp')
var erstelleUnterordnerVonTpop = require('./erstelleUnterordnerVonTpop')
var erstelleUnterordnerVonPop = require('./erstelleUnterordnerVonPop')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var beschrifteOrdner = require('../beschrifteOrdner')

module.exports = function (aktiverNode, parentNode, strukturtyp, dsId, beschriftung) {
  var neuerNode,
    neueApzieleNode

  // Beschriftung muss String sein
  if (beschriftung && typeof beschriftung !== 'string') {
    beschriftung = beschriftung.toString()
  }

  // id global verfügbar machen
  window.localStorage[strukturtyp + 'Id'] = dsId
  // letzte globale Variable entfernen
  delete window.apf[strukturtyp]
  if (strukturtyp === 'apziel' && window.localStorage.apzielVonOrdnerApziel) {
    // window.localStorage.apzielVonOrdnerApziel sagt: apziel wird vom ordner_apziel aus angelegt > temporären Unterordner anlegen
    neueApzieleNode = $.jstree._reference(aktiverNode).create_node(aktiverNode, 'last', {
      'data': 'neue AP-Ziele',
      'attr': {
        'id': erstelleIdAusDomAttributId($(aktiverNode).attr('id')),
        'typ': 'apzieljahr'
      }
    })
    // darunter neuen Node bauen
    neuerNode = $.jstree._reference(neueApzieleNode).create_node(neueApzieleNode, 'last', {
      'data': beschriftung,
      'attr': {
        'id': dsId,
        'typ': 'apziel'
      }
    })
    delete window.localStorage.apzielVonOrdnerApziel
  } else {
    // Normalfall
    // neuen Node bauen
    neuerNode = $.jstree._reference(aktiverNode).create_node(aktiverNode, 'last', {
      'data': beschriftung,
      'attr': {
        'id': dsId,
        'typ': strukturtyp
      }
    })
  }
  // allfällige Unterordner anlegen
  if (strukturtyp === 'pop') {
    erstelleUnterordnerVonPop(neuerNode, dsId)
  }
  if (strukturtyp === 'tpop') {
    erstelleUnterordnerVonTpop(neuerNode, dsId)
  }
  if (strukturtyp === 'apziel') {
    $.jstree._reference(neuerNode).create_node(neuerNode, 'last', {
      'data': '0 Ziel-Berichte',
      'attr': {
        'id': dsId,
        'typ': 'zielberOrdner'
      }
    })
  // im create_node-Event von jstree wird Jahr eingefügt und gespeichert
  }
  // Node-Beschriftung: Anzahl anpassen
  if (strukturtyp === 'apziel' && window.localStorage.apzielVonApzieljahr) {
    // hier ist ein Ordner zwischengeschaltet
    // Parent Node-Beschriftung: Anzahl anpassen, wenns nicht der neue Ordner ist
    if ($.jstree._reference(parentNode).get_text(parentNode) !== 'neue AP-Ziele') {
      beschrifteOrdner(parentNode)
    }
    // aktiver Node-Beschriftung: Anzahl anpassen
    beschrifteOrdner(aktiverNode)
    delete window.localStorage.apzielVonApzieljahr
  } else if (strukturtyp !== 'jberUebersicht') {
    beschrifteOrdner(aktiverNode)
  }
  // node selecten
  $.jstree._reference(aktiverNode).deselect_all()
  $.jstree._reference(neuerNode).select_node(neuerNode)
  // Formular initiieren
  initiiereFormularMitStrukturtyp(strukturtyp)
}
