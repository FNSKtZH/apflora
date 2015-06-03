'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  frageObUndeleteDatensatz = require('../frageObUndeleteDatensatz'),
  pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen'),
  beschrifteOrdner = require('../beschrifteOrdner'),
  getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode) {
  var grandparentNode,
    bezeichnung

  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) { return }
  // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
  $.jstree._reference(aktiverNode).deselect_all()
  // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
  $.jstree._reference(aktiverNode).open_all(aktiverNode)
  $.jstree._reference(aktiverNode).deselect_all()
  $.jstree._reference(aktiverNode).select_node(aktiverNode)
  bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode)
  $('#loeschen_dialog_mitteilung').html("Das AP-Ziel '" + bezeichnung + "' wird gelöscht.")
  $('#loeschen_dialog').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      'ja, löschen!': function () {
        $(this).dialog('close')
        // Variable zum rückgängig machen erstellen
        window.apf.deleted = window.apf.apziel
        window.apf.deleted.typ = 'apziel'
        $.ajax({
          type: 'delete',
          url: getApiHost() + '/apflora/tabelle=ziel/tabelleIdFeld=ZielId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
        }).done(function () {
          delete window.localStorage.apzielId
          delete window.apf.apziel
          $.jstree._reference(aktiverNode).delete_node(aktiverNode)
          // grandparent Node-Beschriftung: Anzahl anpassen
          grandparentNode = $.jstree._reference(parentNode)._get_parent(parentNode)
          beschrifteOrdner(grandparentNode)
          // parent Node-Beschriftung: Anzahl anpassen
          if ($.jstree._reference(parentNode).get_text(parentNode) !== 'neue AP-Ziele') {
            beschrifteOrdner(parentNode)
          }
          // Hinweis zum rückgängig machen anzeigen
          frageObUndeleteDatensatz("Das AP-Ziel '" + bezeichnung + "' wurde gelöscht.")
        }).fail(function () {
          melde('Fehler: Das AP-Ziel wurde nicht gelöscht')
        })
      },
      'abbrechen': function () {
        $(this).dialog('close')
      }
    }
  })
}
