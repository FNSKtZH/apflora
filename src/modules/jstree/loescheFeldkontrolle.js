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
  $('#loeschen_dialog_mitteilung').html("Die Feldkontrolle '" + bezeichnung + "' wird gelöscht.")
  $('#loeschen_dialog').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      'ja, löschen!': function () {
        $(this).dialog('close')
        // Variable zum rückgängig machen erstellen
        window.apf.deleted = window.apf.tpopfeldkontr
        window.apf.deleted.typ = 'tpopfeldkontr'
        $.ajax({
          type: 'delete',
          url: getApiHost() + '/apflora/tabelle=tpopkontr/tabelleIdFeld=TPopKontrId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr('id'))
        }).done(function () {
          delete window.localStorage.tpopfeldkontrId
          delete window.apf.tpopfeldkontr
          $.jstree._reference(aktiverNode).delete_node(aktiverNode)
          // Parent Node-Beschriftung: Anzahl anpassen
          beschrifteOrdner(parentNode)
          // Hinweis zum rückgängig machen anzeigen
          frageObUndeleteDatensatz("Die Feldkontrolle '" + bezeichnung + "' wurde gelöscht.")
        }).fail(function () {
          melde('Fehler: Die Feldkontrolle wurde nicht gelöscht')
        })
      },
      'abbrechen': function () {
        $(this).dialog('close')
      }
    }
  })
}
