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
  $('#loeschen_dialog_mitteilung').html("Der Teilpopulations-Bericht '" + bezeichnung + "' wird gelöscht.")
  $('#loeschen_dialog').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      'ja, löschen!': function () {
        $(this).dialog('close')
        // Variable zum rückgängig machen erstellen
        window.apf.deleted = window.apf.tpopber
        window.apf.deleted.typ = 'tpopber'
        $.ajax({
          type: 'delete',
          url: getApiHost() + '/apflora/tabelle=tpopber/tabelleIdFeld=TPopBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
        }).done(function () {
          delete window.localStorage.tpopberId
          delete window.apf.tpopber
          $.jstree._reference(aktiverNode).delete_node(aktiverNode)
          // Parent Node-Beschriftung: Anzahl anpassen
          beschrifteOrdner(parentNode)
          // Hinweis zum rückgängig machen anzeigen
          frageObUndeleteDatensatz("Der Teilpopulations-Bericht '" + bezeichnung + "' wurde gelöscht.")
        }).fail(function () {
          melde('Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht')
        })
      },
      'abbrechen': function () {
        $(this).dialog('close')
      }
    }
  })
}
