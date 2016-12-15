'use strict'

var $ = require('jquery')
var treeKontextmenu = require('./treeKontextmenu')
var melde = require('../melde')
var initiierePop = require('../initiierePop')
var initiiereTPop = require('../initiiereTPop')
var initiiereTPopKontr = require('../initiiereTPopKontr')
var initiiereTPopMassn = require('../initiiereTPopMassn')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var crrmCheckMove = require('./crrmCheckMove')
var types = require('./types.json')
var loaded = require('./loaded')
var select_node = require('./select_node')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')
var beschrifteOrdner = require('../beschrifteOrdner')
var setzeTreehoehe = require('./setzeTreehoehe')
var ordneBeobEinerTpopZu = require('../ordneBeobEinerTpopZu')
var getApiHost = require('../getApiHost')

module.exports = function (ApArtId) {
  var jstreeErstellt = $.Deferred()

  window.localStorage.apId = ApArtId
  $('#tree').jstree({
    'json_data': {
      'ajax': {
        url: getApiHost() + '/tree/apId=' + ApArtId,
        'progressive_render': true
      }
    },
    'core': {
      'open_parents': true, // wird ein node programmatisch geöffnet, öffnen sich alle parents
      'strings': { // Deutsche Übersetzungen
        'loading': 'hole Daten...',
        'new_node': 'neuer Knoten'
      }
    },
    'ui': {
      'select_limit': 1, // nur ein Datensatz kann aufs mal gewählt werden
      'selected_parent_open': true, // wenn Code einen node wählt, werden alle parents geöffnet
      'select_prev_on_delete': true
    },
    'search': {
      'case_insensitive': true
    },
    'sort': function (a, b) {
      if ($(a).attr('sort') && $(b).attr('sort')) {
        return parseInt($(a).attr('sort'), 10) > parseInt($(b).attr('sort'), 10) ? 1 : -1
      }
    },
    'themes': {
      'icons': false
    },
    'contextmenu': {
      select_node: false,
      show_at_node: false,
      items: treeKontextmenu,
    },
    'crrm': {
      'move': {
        'default_position': 'first',
        'check_move': function (m) {
          // hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind
          return crrmCheckMove(m)
        }
      }
    },
    'types': types,
    'plugins': ['themes', 'json_data', 'ui', 'hotkeys', 'search', 'contextmenu', 'crrm', 'types']
  // dnd ausgeschaltet, weil es Speichern verhindert im letzten Feld vor Klick in Baum
  // "plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "dnd", "types"]
  }).show().bind('loaded.jstree', function () {
    // function erhält event und data
    // bisher nicht benötigt
    jstreeErstellt.resolve()
    loaded(ApArtId)
  }).hammer().bind('hold doubletap', function () {
    // bind erhält event. Momentan nicht benötigt
    // auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
    // auf PC's verhindern: Menu erscheint sonst beim Scrollen
    if ($(window).width() < 1000) {
      setTimeout(function () {
        $('#tree').jstree('get_selected').children('a').trigger('contextmenu')
      }, 500)
    }
  }).bind('select_node.jstree', function (event, data) {
    select_node(event, data, ApArtId)
  }).bind('after_open.jstree', function () {
    setzeTreehoehe()
  }).bind('after_close.jstree', function () {
    setzeTreehoehe()
  }).bind('prepare_move.jstree', function (event, data) {
    // herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
    window.apf.herkunftParentNode = $.jstree._reference(data.rslt.o)._get_parent(data.rslt.o)
  }).bind('create_node.jstree', function (event, data) {
    if (data.rslt.parent[0].attributes.typ.value === 'apzieljahr') {
      $('#ZielJahr')
        .val(data.rslt.parent[0].innerText.slice(1, 5))
        .trigger('change')
        .focus()
    }
  }).bind('move_node.jstree', function (e, data) {
    var herkunftNode
    var herkunftNodeId
    var herkunftNodeTyp
    var zielNode
    var zielNodeId
    var zielNodeTyp
    var zielParentNode
    var zielParentNodeId
    var beobId
    var beobStatus
    var tpopId
    var beobTpopId
    var olmapCallback
    var jstreeCallback

    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!pruefeSchreibvoraussetzungen()) {
      return
    }

    // Variablen setzen
    herkunftNode = data.rslt.o
    herkunftNodeId = erstelleIdAusDomAttributId($(herkunftNode).attr('id'))
    herkunftNodeTyp = herkunftNode.attr('typ')
    zielNode = data.rslt.r
    zielNodeId = erstelleIdAusDomAttributId($(zielNode).attr('id'))
    zielNodeTyp = zielNode.attr('typ')
    zielParentNode = $.jstree._reference(data.rslt.r)._get_parent(data.rslt.r)
    if ($(zielParentNode).attr('id')) {
      zielParentNodeId = erstelleIdAusDomAttributId($(zielParentNode).attr('id'))
    }

    if (herkunftNodeTyp === 'pop') {
      if (zielNodeTyp === 'pop') {
        $.ajax({
          type: 'put',
          url: getApiHost() + '/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=' + zielNodeId + '/feld=ApArtId/wert=' + zielParentNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielParentNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(zielNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.popId = herkunftNodeId
          delete window.apf.pop
          delete window.apf.herkunftParentNode
          initiierePop()
        }).fail(function () {
          melde('Fehler: Die Teilpopulation wurde nicht verschoben')
        })
      }
      if (zielNodeTyp === 'tpop') {
        $.ajax({
          type: 'put',
          url: getApiHost() + '/update/apflora/tabelle=tpop/tabelleIdFeld=PopId/tabelleId=' + zielParentNodeId + '/feld=TPopId/wert=' + zielNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielParentNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(zielNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopId = herkunftNodeId
          delete window.apf.tpop
          delete window.apf.tpopNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          initiiereTPop()
        }).fail(function () {
          melde('Fehler: Die Teilpopulation wurde nicht verschoben')
        })
      }
      if (zielNodeTyp === 'popOrdnerTpop') {
        $.ajax({
          type: 'put',
          url: getApiHost() + '/update/apflora/tabelle=tpop/tabelleIdFeld=PopId/tabelleId=' + zielNodeId + '/feld=TPopId/wert=' + herkunftNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // select steuern
          $.jstree._reference(zielNode).deselect_all()
          $.jstree._reference(zielNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopId = herkunftNodeId
          delete window.apf.tpop
          delete window.apf.tpopNodeAusgeschnitten
          initiiereTPop()
        }).fail(function () {
          melde('Fehler: Die Teilpopulation wurde nicht verschoben')
        })
      }
    }
    if (herkunftNodeTyp === 'tpop') {
      if (zielNodeTyp === 'tpop') {
        $.ajax({
          type: 'put',
          url: getApiHost() + '/update/apflora/tabelle=tpop/tabelleIdFeld=TPopId/tabelleId=' + herkunftNodeId + '/feld=PopId/wert=' + zielParentNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielParentNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(zielParentNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopId = herkunftNodeId
          delete window.apf.tpop
          delete window.apf.tpopNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          initiiereTPop()
        }).fail(function () {
          melde('Fehler: Die Teilpopulation wurde nicht verschoben')
        })
      }
      if (zielNodeTyp === 'popOrdnerTpop') {
        $.ajax({
          type: 'put',
          url: getApiHost() + '/update/apflora/tabelle=tpop/tabelleIdFeld=TPopId/tabelleId=' + herkunftNodeId + '/feld=PopId/wert=' + zielNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopId = herkunftNodeId
          delete window.apf.tpop
          delete window.apf.tpopNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          initiiereTPop()
        }).fail(function () {
          melde('Fehler: Die Teilpopulation wurde nicht verschoben')
        })
      }
    }
    if (herkunftNodeTyp === 'tpopmassn') {
      if (zielNodeTyp === 'tpopmassn') {
        $.ajax({
          type: 'put',
          url: getApiHost() + '/update/apflora/tabelle=tpopmassn/tabelleIdFeld=TPopMassnId/tabelleId=' + herkunftNodeId + '/feld=TPopId/wert=' + zielParentNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielParentNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(zielParentNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopmassnId = herkunftNodeId
          delete window.apf.tpopmassn
          delete window.apf.tpopmassnNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          initiiereTPopMassn()
        }).fail(function () {
          melde('Fehler: Die Massnahme wurde nicht verschoben')
        })
      }
      if (zielNodeTyp === 'tpopOrdnerMassn') {
        $.ajax({
          type: 'put',
          url: getApiHost() + '/update/apflora/tabelle=tpopmassn/tabelleIdFeld=TPopMassnId/tabelleId=' + herkunftNodeId + '/feld=TPopId/wert=' + zielNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopmassnId = herkunftNodeId
          delete window.apf.tpopmassn
          delete window.apf.tpopmassnNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          initiiereTPopMassn()
        }).fail(function () {
          melde('Fehler: Die Massnahme wurde nicht verschoben')
        })
      }
    }
    if (herkunftNodeTyp === 'tpopfeldkontr') {
      if (zielNodeTyp === 'tpopfeldkontr') {
        $.ajax({
          type: 'post',
          url: getApiHost() + '/insert/apflora/tabelle=tpopkontr/feld=TPopId/wert=' + zielParentNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielParentNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopfeldkontrId = herkunftNodeId
          delete window.apf.tpopfeldkontr
          delete window.apf.tpopfeldkontrNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          initiiereTPopKontr()
        }).fail(function () {
          melde('Fehler: Die Feldkontrolle wurde nicht verschoben')
        })
      }
      if (zielNodeTyp === 'tpopOrdnerFeldkontr') {
        $.ajax({
          type: 'post',
          url: getApiHost() + '/insert/apflora/tabelle=tpopkontr/feld=TPopId/wert=' + zielNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopfeldkontrId = herkunftNodeId
          delete window.apf.tpopfeldkontr
          delete window.apf.tpopfeldkontrNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          initiiereTPopKontr()
        }).fail(function () {
          melde('Fehler: Die Feldkontrolle wurde nicht verschoben')
        })
      }
    }
    if (herkunftNodeTyp === 'tpopfreiwkontr') {
      if (zielNodeTyp === 'tpopfreiwkontr') {
        $.ajax({
          type: 'post',
          url: getApiHost() + '/insert/apflora/tabelle=tpopkontr/feld=TPopId/wert=' + zielParentNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielParentNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopfeldkontrId = herkunftNodeId
          delete window.apf.tpopfeldkontr
          delete window.apf.tpopfreiwkontrNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          window.localStorage.tpopfreiwkontr = true
          initiiereTPopKontr()
        }).fail(function () {
          melde('Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben')
        })
      }
      if (zielNodeTyp === 'tpopOrdnerFreiwkontr') {
        $.ajax({
          type: 'post',
          url: getApiHost() + '/insert/apflora/tabelle=tpopkontr/feld=TPopId/wert=' + zielNodeId + '/user=' + encodeURIComponent(window.sessionStorage.user)
        }).done(function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          beschrifteOrdner(zielNode)
          beschrifteOrdner(window.apf.herkunftParentNode)
          // selection steuern
          $.jstree._reference(herkunftNode).deselect_all()
          $.jstree._reference(herkunftNode).select_node(herkunftNode)
          // Variablen aufräumen
          window.localStorage.tpopfeldkontrId = herkunftNodeId
          delete window.apf.tpopfeldkontr
          delete window.apf.tpopfreiwkontrNodeAusgeschnitten
          delete window.apf.herkunftParentNode
          window.localStorage.tpopfreiwkontr = true
          initiiereTPopKontr()
        }).fail(function () {
          melde('Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben')
        })
      }
    }
    if (herkunftNodeTyp === 'beobZugeordnet') {
      // zugeordnet
      if (zielNodeTyp === 'beobNichtBeurteilt' || zielNodeTyp === 'apOrdnerBeobNichtBeurteilt') {
        // zugeordnet > nicht beurteilt
        beobId = herkunftNodeId
        beobStatus = 'nicht_beurteilt'
        tpopId = null
        beobTpopId = null
        olmapCallback = null
        jstreeCallback = function () {
          // Zuordnung entfernen
          $('[name="distZuTPop"]').each(function () {
            if ($(this).prop('checked') === true) $(this).prop('checked', false)
          })

          // typ des nodes anpassen
          herkunftNode.attr('typ', 'beobNichtBeurteilt')
          window.localStorage.beobtyp = 'beobNichtBeurteilt'

          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          if (zielNodeTyp === 'beobNichtBeurteilt') {
            beschrifteOrdner(zielParentNode)
          } else {
            beschrifteOrdner(zielNode)
          }
          beschrifteOrdner(window.apf.herkunftParentNode)

          // Variablen aufräumen
          delete window.apf.beobNodeAusgeschnitten
          delete window.apf.herkunftParentNode
        }
        ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
      }
      if (zielNodeTyp === 'beobZugeordnet' || zielNodeTyp === 'tpopOrdnerBeobZugeordnet') {
        // zugeordnet > zugeordnet
        beobId = window.localStorage.beobId
        beobStatus = 'zugeordnet'
        tpopId = zielNodeTyp === 'tpopOrdnerBeobZugeordnet' ? zielNodeId : zielParentNodeId
        beobTpopId = 1 // wird nur benutzt, um zu wissen, ob ein insert nötig ist
        olmapCallback = null
        jstreeCallback = function () {
          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          if (zielNodeTyp === 'tpopOrdnerBeobZugeordnet') {
            beschrifteOrdner(zielNode)
          } else {
            beschrifteOrdner(zielParentNode)
          }
          beschrifteOrdner(window.apf.herkunftParentNode)

          // selection steuern
          if (window.localStorage.karteFokussieren) {
            delete window.localStorage.karteFokussieren
          }

          // Variablen aufräumen
          delete window.apf.beobNodeAusgeschnitten
          delete window.apf.herkunftParentNode
        }
        ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
      }
      if (zielNodeTyp === 'beobNichtZuzuordnen' || zielNodeTyp === 'apOrdnerBeobNichtZuzuordnen') {
        // zugeordnet > nicht zuzuordnen
        beobId = herkunftNodeId
        beobStatus = 'nicht_zuordnen'
        tpopId = null
        beobTpopId = null
        olmapCallback = null
        jstreeCallback = function () {
          // Zuordnung entfernen
          $('[name="distZuTPop"]').each(function () {
            if ($(this).prop('checked') === true) $(this).prop('checked', false)
          })

          // typ des nodes anpassen
          herkunftNode.attr('typ', 'beobNichtZuzuordnen')
          window.localStorage.beobtyp = 'beobNichtZuzuordnen'

          // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
          if (zielNodeTyp === 'apOrdnerBeobNichtZuzuordnen') {
            beschrifteOrdner(zielNode)
          } else {
            beschrifteOrdner(zielParentNode)
          }
          beschrifteOrdner(window.apf.herkunftParentNode)

          // Variablen aufräumen
          delete window.apf.beobNodeAusgeschnitten
          delete window.apf.herkunftParentNode
        }
        ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
      }
    }
    if (herkunftNodeTyp === 'beobNichtBeurteilt') {
      // nicht beurteilt
      if (zielNodeTyp === 'beobZugeordnet' || zielNodeTyp === 'tpopOrdnerBeobZugeordnet') {
        // nicht beurteilt > zugeordnet
        beobId = herkunftNodeId
        beobStatus = 'zugeordnet'
        tpopId = zielNodeTyp === 'tpopOrdnerBeobZugeordnet' ? zielNodeId : zielParentNodeId
        beobTpopId = null
        olmapCallback = null
        jstreeCallback = function () {
          // typ des nodes anpassen
          herkunftNode.attr('typ', 'beobZugeordnet')
          window.localStorage.beobtyp = 'beobZugeordnet'

          // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
          beschrifteOrdner(window.apf.herkunftParentNode)
          if (zielNodeTyp === 'tpopOrdnerBeobZugeordnet') {
            beschrifteOrdner(zielNode)
          } else {
            beschrifteOrdner(zielParentNode)
          }

          // Nicht beurteilt: Deaktivieren
          $('#beobNichtBeurteilt').prop('checked', false)

          // selection steuern
          if (window.localStorage.karteFokussieren) {
            delete window.localStorage.karteFokussieren
          }

          // Variablen aufräumen
          delete window.apf.beobNodeAusgeschnitten
          delete window.apf.herkunftParentNode
        }
        ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
      }
      if (zielNodeTyp === 'beobNichtZuzuordnen' || zielNodeTyp === 'apOrdnerBeobNichtZuzuordnen') {
        // nicht beurteilt > nicht zuordnen
        beobId = herkunftNodeId
        beobStatus = 'nicht_zuordnen'
        tpopId = null
        beobTpopId = null
        olmapCallback = null
        jstreeCallback = function () {
          // typ des nodes anpassen
          $(herkunftNode).attr('typ', 'beobNichtZuzuordnen')
          window.localStorage.beobtyp = 'beobNichtZuzuordnen'

          // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
          beschrifteOrdner(window.apf.herkunftParentNode)
          if (zielNodeTyp === 'apOrdnerBeobNichtZuzuordnen') {
            beschrifteOrdner(zielNode)
          } else {
            beschrifteOrdner(zielParentNode)
          }

          // Nicht beurteilt: Deaktivieren
          $('#beobNichtBeurteilt').prop('checked', false)

          // Variablen aufräumen
          delete window.apf.beobNodeAusgeschnitten
          delete window.apf.herkunftParentNode
        }
        ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
      }
    }
    if (herkunftNodeTyp === 'beobNichtZuzuordnen') {
      // nicht zuzuordnen
      if (zielNodeTyp === 'beobNichtBeurteilt' || zielNodeTyp === 'apOrdnerBeobNichtBeurteilt') {
        // nicht zuzuordnen > nicht beurteilt
        beobId = herkunftNodeId
        beobStatus = 'nicht_beurteilt'
        tpopId = null
        beobTpopId = null
        olmapCallback = null
        jstreeCallback = function () {
          // typ des nodes anpassen
          $(herkunftNode).attr('typ', 'beobNichtBeurteilt')
          window.localStorage.beobtyp = 'beobNichtBeurteilt'

          // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
          beschrifteOrdner(window.apf.herkunftParentNode)
          if (zielNodeTyp === 'apOrdnerBeobNichtBeurteilt') {
            beschrifteOrdner(zielNode)
          } else {
            beschrifteOrdner(zielParentNode)
          }

          // nicht zuzuordnen deaktivieren
          $('#beobNichtZuordnen').prop('checked', false)

          // Variablen aufräumen
          delete window.apf.beobNodeAusgeschnitten
          delete window.apf.herkunftParentNode
        }
        ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
      }
      if (zielNodeTyp === 'beobZugeordnet' || zielNodeTyp === 'tpopOrdnerBeobZugeordnet') {
        // nicht zuzuordnen > zugeordnet
        beobId = herkunftNodeId
        beobStatus = 'zugeordnet'
        tpopId = zielNodeTyp === 'tpopOrdnerBeobZugeordnet' ? zielNodeId : zielParentNodeId
        beobTpopId = null
        olmapCallback = null
        jstreeCallback = function () {
          // typ des nodes anpassen
          $(herkunftNode).attr('typ', 'beobZugeordnet')
          window.localStorage.beobtyp = 'beobZugeordnet'

          // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
          beschrifteOrdner(window.apf.herkunftParentNode)
          if (zielNodeTyp === 'tpopOrdnerBeobZugeordnet') {
            beschrifteOrdner(zielNode)
          } else {
            beschrifteOrdner(zielParentNode)
          }

          // nicht zuzuordnen deaktivieren
          $('#beobNichtZuordnen').prop('checked', false)

          // Variablen aufräumen
          delete window.apf.beobNodeAusgeschnitten
          delete window.apf.herkunftParentNode
        }
        ordneBeobEinerTpopZu(beobId, beobStatus, tpopId, beobTpopId, olmapCallback, jstreeCallback)
      }
    }
  })
  return jstreeErstellt.promise()
}
