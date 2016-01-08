'use strict'

var $ = require('jquery'),
  erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
  melde = require('../melde'),
  frageObUndeleteDatensatz = require('../frageObUndeleteDatensatz'),
  pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen'),
  beschrifteOrdner = require('../beschrifteOrdner'),
  getApiHost = require('../getApiHost')

module.exports = function (aktiverNode, parentNode) {
  var bezeichnung

  // nur aktualisieren, wenn Schreibrechte bestehen
  if (!pruefeSchreibvoraussetzungen()) return
  bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode)
  $('#loeschen_dialog_mitteilung').html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.")
  $('#loeschen_dialog').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      'ja, löschen!': function () {
        $(this).dialog('close')
        // Variable zum rückgängig machen erstellen
        window.apf.deleted = window.apf.popmassnber
        window.apf.deleted.typ = 'popmassnber'
        $.ajax({
          type: 'delete',
          url: getApiHost() + '/apflora/tabelle=popmassnber/tabelleIdFeld=PopMassnBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
        }).done(function () {
          delete window.localStorage.popmassnberId
          delete window.apf.popmassnber
          $.jstree._reference(aktiverNode).delete_node(aktiverNode)
          // Parent Node-Beschriftung: Anzahl anpassen
          beschrifteOrdner(parentNode)
          // Hinweis zum rückgängig machen anzeigen
          frageObUndeleteDatensatz("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.")
        }).fail(function () {
          melde('Fehler: Der Massnahmen-Bericht wurde nicht gelöscht')
        })
      },
      'abbrechen': function () {
        $(this).dialog('close')
      }
    }
  })
}
