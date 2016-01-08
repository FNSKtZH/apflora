'use strict'

var $ = require('jquery')
var erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId')
var melde = require('../melde')
var frageObUndeleteDatensatz = require('../frageObUndeleteDatensatz')
var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen')
var beschrifteOrdner = require('../beschrifteOrdner')
var getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode) {
  var bezeichnung

  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode)
  $('#loeschen_dialog_mitteilung').html("Die Massnahme '" + bezeichnung + "' wird gelöscht.")
  $('#loeschen_dialog').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      'ja, löschen!': function () {
        $(this).dialog('close')
        // Variable zum rückgängig machen erstellen
        window.apf.deleted = window.apf.tpopmassn
        window.apf.deleted.typ = 'tpopmassn'
        $.ajax({
          type: 'delete',
          url: getApiHost() + '/apflora/tabelle=tpopmassn/tabelleIdFeld=TPopMassnId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
        }).done(function () {
          delete window.localStorage.tpopmassnId
          delete window.apf.tpopmassn
          $.jstree._reference(aktiverNode).delete_node(aktiverNode)
          // Parent Node-Beschriftung: Anzahl anpassen
          beschrifteOrdner(parentNode)
          // Hinweis zum rückgängig machen anzeigen
          frageObUndeleteDatensatz("Die Massnahme '" + bezeichnung + "' wurde gelöscht.")
        }).fail(function () {
          melde('Fehler: Die Massnahme wurde nicht gelöscht')
        })
      },
      'abbrechen': function () {
        $(this).dialog('close')
      }
    }
  })
}
