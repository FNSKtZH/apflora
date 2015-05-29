/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  _ = require('underscore'),
  dateFormat = require('dateformat'),
  capitaliseFirstLetter = require('../lib/capitaliseFirstLetter'),
  initiiereAp = require('./initiiereAp'),
  zeigeFormular = require('./zeigeFormular'),
  melde = require('./melde'),
  erstelleFelderFuerBeob = require('./erstelleFelderFuerBeob')

var initiiereBeob = function (beobTyp, beobId, beobStatus, ohneZuZeigen) {
  // beobStatus markiert, ob die Beobachtung:
  // - schon zugewiesen ist (zugeordnet)
  // - noch nicht beurteilt ist (nicht_beurteilt)
  // - nicht zuzuordnen ist (nicht_zuzuordnen)
  // beobStatus muss gespeichert werden, damit bei Datenänderungen bekannt ist, ob ein bestehender Datensatz bearbeitet oder ein neuer geschaffen werden muss
  window.localStorage.beobStatus = beobStatus
  // sicherstellen, dass beobtyp immer bekannt ist
  window.localStorage.beobtyp = beobTyp

  var url,
    urlDistzutpop,
    urlZuordnung,
    $BeobBemerkungen,
    idFeld,
    htmlBeobfelder,
    htmlDistzutpop

  if (!beobId && !ohneZuZeigen) {
    // es fehlen benötigte Daten > eine Ebene höher
    if (beobStatus === 'nicht_beurteilt' || beobStatus === 'nicht_zuzuordnen') {
      initiiereAp()
    } else {
      initiiereBeob()
    }
    return
  }

  $BeobBemerkungen = $('#BeobBemerkungen')

  // beobid hat meist 'beob' vorangestellt - entfernen!
  if (beobId.indexOf('beob') > -1) {
    beobId = beobId.replace('beob', '')
  }
  // beobid bereitstellen
  window.localStorage.beobId = beobId

  // EvAB oder Infospezies? > entsprechende url zusammensetzen
  if (beobTyp === 'evab') {
    idFeld = 'NO_NOTE_PROJET'
    url = 'api/v1/beob/tabelle=beob_evab/feld=' + idFeld + '/wertString=' + beobId
  } else {
    idFeld = 'NO_NOTE'
    url = 'api/v1/beob/tabelle=beob_infospezies/feld=' + idFeld + '/wertNumber=' + beobId
  }

  // Daten für die beob aus der DB holen
  $.ajax({
    type: 'get',
    url: url
  }).done(function (dataBeob) {
    // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
    if (dataBeob && dataBeob.length > 0) {
      dataBeob = dataBeob[0]

      window.apf.beob = dataBeob

      // boebfelder bereitstellen
      htmlBeobfelder = erstelleFelderFuerBeob(dataBeob, beobTyp)
      $('#beob_table').html(htmlBeobfelder)

      // Abstand zu TPop aus der DB holen
      urlDistzutpop = 'api/v1/beobDistzutpop' + capitaliseFirstLetter(beobTyp) + '/beobId=' + beobId
      $.ajax({
        type: 'get',
        url: urlDistzutpop
      }).done(function (data) {
        // Tabellenzeile beginnen
        htmlDistzutpop = '<tr class="fieldcontain distZuTPop"><td class="label"><label for="distZuTPop">Einer Teilpopulation zuordnen:</label></td><td class="Datenfelder"><div class="Datenfelder" id="DistZuTPop_Felder">'
        if (data) {
          _.each(data, function (beob, index) {
            /*if (index > 0) {
                htmlDistzutpop += "<br>"
            }*/
            htmlDistzutpop += '<div class="radio-wrapper">'
            htmlDistzutpop += '<input type="radio" name="distZuTPop" id="distZuTPop'
            htmlDistzutpop += beob.TPopId
            htmlDistzutpop += '" class="distZuTPop" formular="beob" value="'
            htmlDistzutpop += beob.TPopId
            htmlDistzutpop += '" distZuTPop="'
            htmlDistzutpop += beob.DistZuTPop
            htmlDistzutpop += '"'
            // jetzt ermitteln, ob das die angezeigte Beob ist
            // wenn ja: checked
            if (beob.TPopId === window.localStorage.tpopId) {
              htmlDistzutpop += ' checked'
            }
            htmlDistzutpop += '>'
            // Label beginnen
            htmlDistzutpop += '<label for="distZuTPop'
            htmlDistzutpop += beob.TPopId
            htmlDistzutpop += '">'
            // Wenn TPop keine Koordinaten haben, dies anzeigen und Anzeige von NAN verhindern
            if (parseInt(beob.DistZuTPop, 10) >= 0) {
              htmlDistzutpop += parseInt(beob.DistZuTPop, 10) + 'm: ' + beob.TPopFlurname
            } else {
              htmlDistzutpop += beob.TPopFlurname
            }
            // Label abschliessen
            htmlDistzutpop += '</label>'
            htmlDistzutpop += '</div>'
          })

          // Tabellenzeile abschliessen
          htmlDistzutpop += '</div></td></tr>'

          // distzutpop bereitstellen
          $('#beob_zuordnungsfelder').html(htmlDistzutpop)

          $BeobBemerkungen.attr('placeholder', '')

          if (beobStatus !== 'nicht_beurteilt') {
            // Daten der Zuordnung holen
            if (beobTyp === 'evab') {
              urlZuordnung = 'api/v1/apflora/tabelle=beobzuordnung/feld=NO_NOTE/wertString=' + beobId
            } else {
              urlZuordnung = 'api/v1/apflora/tabelle=beobzuordnung/feld=NO_NOTE/wertNumber=' + beobId
            }
            $.ajax({
              type: 'get',
              url: urlZuordnung
            }).done(function (data) {
              if (data && data[0]) {
                data = data[0]
                window.apf.beob.zuordnung = data
                // Felder mit Daten beliefern
                $('#beobNichtBeurteilt').prop('checked', false)
                if (data.BeobNichtZuordnen === 1) {
                  $('#beobNichtZuordnen').prop('checked', true)
                } else {
                  $('#beobNichtZuordnen').prop('checked', false)
                }
                $('#distZuTPop' + data.TPopId).prop('checked', true)
                $('#BeobBemerkungen').val(data.BeobBemerkungen)
                $('#BeobMutWann').val(dateFormat(data.BeobMutWann, 'dd.mm.yyyy'))
                $('#BeobMutWer').val(data.BeobMutWer)

                // Formulare blenden
                // nur, wenn ohneZuZeigen nicht true ist (true, um in dialog anzuzeigen)
                if (!ohneZuZeigen) {
                  zeigeFormular('beob')
                  if (beobStatus === 'zugeordnet') {
                    window.history.pushState(null, null, 'index.html?ap=' + window.localStorage.apId + '&pop=' + window.localStorage.popId + '&tpop=' + window.localStorage.tpopId + '&beobZugeordnet=' + beobId)
                  } else if (beobStatus === 'nicht_zuzuordnen') {
                    window.history.pushState(null, null, 'index.html?ap=' + window.localStorage.apId + '&beobNichtZuzuordnen=' + beobId)
                  }
                }
              }
            })
          } else {
            // beobStatus ist "nicht beurteilt"
            $('#beobNichtBeurteilt').prop('checked', true)
            $('#beobNichtZuordnen').prop('checked', false)

            // allfällige im letzen beob enthaltene Werte entfernen
            $BeobBemerkungen
              .val('')
              .attr('placeholder', 'Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich')

            // Formulare blenden
            // nur, wenn ohneZuZeigen nicht true ist (true, um in dialog anzuzeigen)
            if (!ohneZuZeigen) {
              zeigeFormular('beob')
              window.history.pushState(null, null, 'index.html?ap=' + window.localStorage.apId + '&beobNichtBeurteilt=' + beobId)
            }
          }
        }
      })
    }
  }).fail(function () {
    melde('Fehler: Keine Daten für die Beobachtung erhalten')
  })
}

module.exports = initiiereBeob
