// erstellt alle Unterordner des Ordners vom Typ tpop
// erwartet den node des tpop-ordners

'use strict'

var $ = require('jquery')

module.exports = function (tpopNode, tpopId) {
  $.jstree._reference(tpopNode).create_node(tpopNode, 'last', {
    'data': 'Massnahmen',
    'attr': {
      'id': tpopId,
      'typ': 'tpopOrdnerMassn'
    }
  })
  $.jstree._reference(tpopNode).create_node(tpopNode, 'last', {
    'data': 'Massnahmen-Berichte',
    'attr': {
      'id': tpopId,
      'typ': 'tpopOrdnerMassnber'
    }
  })
  $.jstree._reference(tpopNode).create_node(tpopNode, 'last', {
    'data': 'Feldkontrollen',
    'attr': {
      'id': tpopId,
      'typ': 'tpopOrdnerFeldkontr'
    }
  })
  $.jstree._reference(tpopNode).create_node(tpopNode, 'last', {
    'data': 'Freiwilligen-Kontrollen',
    'attr': {
      'id': tpopId,
      'typ': 'tpopOrdnerFreiwkontr'
    }
  })
  $.jstree._reference(tpopNode).create_node(tpopNode, 'last', {
    'data': 'Teilpopulations-Berichte',
    'attr': {
      'id': tpopId,
      'typ': 'tpopOrdnerTpopber'
    }
  })
}
