'use strict'

var $ = require('jquery')
var initiiereBeob = require('../initiiereBeob')
var initiiereIdealbiotop = require('../initiiereIdealbiotop')
var initiiereAp = require('../initiiereAp')
var initiierePop = require('../initiierePop')
var initiiereApziel = require('../initiiereApziel')
var initiiereZielber = require('../initiiereZielber')
var initiiereErfkrit = require('../initiiereErfkrit')
var initiiereJber = require('../initiiereJber')
var initiiereJberUebersicht = require('../initiiereJberUebersicht')
var initiiereBer = require('../initiiereBer')
var initiiereAssozart = require('../initiiereAssozart')
var initiierePopMassnBer = require('../initiierePopMassnBer')
var initiiereTPop = require('../initiiereTPop')
var initiierePopBer = require('../initiierePopBer')
var initiiereTPopKontr = require('../initiiereTPopKontr')
var initiiereTPopMassn = require('../initiiereTPopMassn')
var initiiereTPopMassnBer = require('../initiiereTPopMassnBer')
var initiiereTPopBer = require('../initiiereTPopBer')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var initiiereQualitaetskontrollen = require('../initiiereQualitaetskontrollen')

module.exports = function (event, data, ApArtId) {
  var node
  var nodeTyp
  var nodeId

  // Erinnerung an letzten Klick im Baum löschen
  delete window.localStorage.tpopfreiwkontr

  node = data.rslt.obj
  nodeTyp = node.attr('typ')
  // console.log('nodeTyp: ', nodeTyp)

  // in der ID des Nodes enthaltene Texte müssen entfernt werden
  nodeId = erstelleIdAusDomAttributId(node.attr('id'))

  // node öffnen
  $.jstree._reference(node).open_node(node)
  // richtiges Formular initiieren
  if ((nodeTyp.slice(0, 2) === 'ap' && nodeTyp.slice(2, 3).toUpperCase() === nodeTyp.slice(2, 3)) || nodeTyp === 'apzieljahr') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#ap').is(':visible') || window.localStorage.apId !== nodeId) {
      window.localStorage.apId = nodeId
      delete window.localStorage.popId
      initiiereAp(nodeId)
    }
  } else if (nodeTyp === 'pop' || nodeTyp.slice(0, 9) === 'popOrdner') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#pop').is(':visible') || window.localStorage.popId !== nodeId) {
      window.localStorage.popId = nodeId
      initiierePop(ApArtId, nodeId)
    }
  } else if (nodeTyp === 'apziel' || nodeTyp === 'zielberOrdner') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#apziel').is(':visible') || window.localStorage.apzielId !== nodeId) {
      window.localStorage.apzielId = nodeId
      initiiereApziel()
    }
  } else if (nodeTyp === 'zielber') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#zielber').is(':visible') || window.localStorage.zielberId !== nodeId) {
      window.localStorage.zielberId = nodeId
      initiiereZielber()
    }
  } else if (nodeTyp === 'erfkrit') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#erfkrit').is(':visible') || window.localStorage.erfkritId !== nodeId) {
      window.localStorage.erfkritId = nodeId
      initiiereErfkrit()
    }
  } else if (nodeTyp === 'jber') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#jber').is(':visible') || window.localStorage.jberId !== nodeId) {
      window.localStorage.jberId = nodeId
      initiiereJber()
    }
  } else if (nodeTyp === 'jberUebersicht') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#jberUebersicht').is(':visible') || window.localStorage.jberUebersichtId !== nodeId) {
      window.localStorage.jberUebersichtId = nodeId
      initiiereJberUebersicht()
    }
  } else if (nodeTyp === 'ber') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#ber').is(':visible') || window.localStorage.berId !== nodeId) {
      window.localStorage.berId = nodeId
      initiiereBer()
    }
  } else if (nodeTyp === 'idealbiotop') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#idealbiotop').is(':visible')) {
      // eigene id nicht nötig
      // 1:1 mit ap verbunden, gleich id
      // wenn noch kein Datensatz existiert erstellt ihn initiiereIdealbiotop
      initiiereIdealbiotop()
    }
  } else if (nodeTyp === 'assozarten') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#assozarten').is(':visible') || window.localStorage.assozartenId !== nodeId) {
      window.localStorage.assozartenId = nodeId
      initiiereAssozart(window.localStorage.apId, nodeId)
    }
  } else if (nodeTyp === 'popber') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#popber').is(':visible') || window.localStorage.popberId !== nodeId) {
      window.localStorage.popberId = nodeId
      initiierePopBer()
    }
  } else if (nodeTyp === 'popmassnber') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#popmassnber').is(':visible') || window.localStorage.popmassnberId !== nodeId) {
      window.localStorage.popmassnberId = nodeId
      initiierePopMassnBer()
    }
  } else if (nodeTyp === 'tpop' || nodeTyp.slice(0, 10) === 'tpopOrdner') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#tpop').is(':visible') || window.localStorage.tpopId !== nodeId) {
      window.localStorage.tpopId = nodeId
      initiiereTPop()
    }
  } else if (nodeTyp === 'tpopfeldkontr') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#tpopfeldkontr').is(':visible') || window.localStorage.tpopfeldkontrId !== nodeId) {
      window.localStorage.tpopfeldkontrId = nodeId
      initiiereTPopKontr()
    }
  } else if (nodeTyp === 'tpopfreiwkontr') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#tpopfeldkontr').is(':visible') || window.localStorage.tpopfeldkontrId !== nodeId) {
      window.localStorage.tpopfeldkontrId = nodeId
      window.localStorage.tpopfreiwkontr = true
      initiiereTPopKontr()
    }
  } else if (nodeTyp === 'tpopmassn') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#tpopmassn').is(':visible') || window.localStorage.tpopmassnId !== nodeId) {
      window.localStorage.tpopmassnId = nodeId
      initiiereTPopMassn()
    }
  } else if (nodeTyp === 'tpopber') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#tpopber').is(':visible') || window.localStorage.tpopberId !== nodeId) {
      window.localStorage.tpopberId = nodeId
      initiiereTPopBer()
    }
  } else if (nodeTyp === 'beobZugeordnet') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#beob').is(':visible') || window.localStorage.beobId !== nodeId || window.localStorage.beobStatus !== 'zugeordnet') {
      window.localStorage.beobId = nodeId
      window.localStorage.beobtyp = node.attr('beobtyp')
      initiiereBeob(node.attr('beobtyp'), nodeId, 'zugeordnet')
    }
  } else if (nodeTyp === 'beobNichtBeurteilt') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#beob').is(':visible') || window.localStorage.beobId !== nodeId || window.localStorage.beobStatus !== 'nicht_beurteilt') {
      window.localStorage.beobId = nodeId
      window.localStorage.beobtyp = node.attr('beobtyp')
      // den Beobtyp mitgeben
      initiiereBeob(node.attr('beobtyp'), nodeId, 'nicht_beurteilt')
    }
  } else if (nodeTyp === 'beobNichtZuzuordnen') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#beob').is(':visible') || window.localStorage.beobId !== nodeId || window.localStorage.beobStatus !== 'nicht_zuzuordnen') {
      window.localStorage.beobId = nodeId
      window.localStorage.beobtyp = node.attr('beobtyp')
      // den Beobtyp mitgeben
      initiiereBeob(node.attr('beobtyp'), nodeId, 'nicht_zuzuordnen')
    }
  } else if (nodeTyp === 'tpopmassnber') {
    // verhindern, dass bereits offene Seiten nochmals geöffnet werden
    if (!$('#tpopmassnber').is(':visible') || window.localStorage.tpopmassnberId !== nodeId) {
      window.localStorage.tpopmassnberId = nodeId
      initiiereTPopMassnBer()
    }
  } else if (nodeTyp === 'qualitaetskontrollen') {
    initiiereQualitaetskontrollen(nodeId)
  }
}
