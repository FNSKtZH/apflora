'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var frageObUndeleteDatensatz = require('../frageObUndeleteDatensatz')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode) {
  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
  $.jstree._reference(aktiverNode).deselect_all()
  // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
  $.jstree._reference(aktiverNode).open_all(aktiverNode)
  $.jstree._reference(aktiverNode).deselect_all()
  $.jstree._reference(aktiverNode).select_node(aktiverNode)
  $('#loeschen_dialog_mitteilung').html('Die Übersicht zu allen Arten wird gelöscht')
  $('#loeschen_dialog').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      'ja, löschen!': function () {
        $(this).dialog('close')
        // Variable zum rückgängig machen erstellen
        window.apf.deleted = window.apf.jberUebersicht
        window.apf.deleted.typ = 'jberUebersicht'
        $.ajax({
          type: 'delete',
          url: getApiHost() + '/apflora/tabelle=apberuebersicht/tabelleIdFeld=JbuJahr/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
        }).done(function () {
          delete window.localStorage.jberUebersichtId
          delete window.apf.jberUebersicht
          $.jstree._reference(aktiverNode).delete_node(aktiverNode)
          // Hinweis zum rückgängig machen anzeigen
          frageObUndeleteDatensatz('Die Übersicht für den AP-Bericht des Jahrs "' + window.apf.deleted.JbuJahr + '" wurde gelöscht.')
        }).fail(function () {
          melde('Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht')
        })
      },
      'abbrechen': function () {
        $(this).dialog('close')
      }
    }
  })
}
