'use strict'

var $ = require('jquery')
var _ = require('underscore')
var getApiHost = require('./getApiHost')


function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}

module.exports = function () {
  // nur machen, wenn noch nicht passiert - sonst werden die html dauernd ersetzt
  if (!window.apf.artliste) {
    $.ajax({
      type: 'get',
      url: getApiHost() + '/artliste'
    }).done(function (data) {
      // data ist Objekt-Array
      // Felder: id, label
      // globale Variable setzen, damit initiiereAssozart sie verwenden kann
      window.apf.artliste = data

      $('#AaSisfNrText').autocomplete({
        minLength: 0,
        delay: 500,
        source: window.apf.artliste,
        select: function (event, ui) {
          $(this).val(ui.item.label)
          // das versteckte Feld mit der ID nachführen
          $('#AaSisfNr')
            .val(ui.item.id)
            .trigger('change')
          return false
        },
        change: function (event, ui) {
          // sicherstellen, dass nur Werte aus der Liste gewählt werden können
          var textPasstZuId = true
          var $AaSisfNr = $('#AaSisfNr')
          var id = $AaSisfNr.val()
          var text

          if (id) {
            text = _.find(window.apf.artliste, function (art) {
              return art.id === id
            })
            if (text && text.label) {
              if (text.label !== $(this).val()) {
                textPasstZuId = false
              }
            }
          }
          if (!textPasstZuId) {
            // kein zulässiger Eintrag > Feld wiederherstellen
            $(this).val(text.label)
          }
        }
      })

      $('#TPopMassnAnsiedWirtspfl')
        // don't navigate away from the field on tab when selecting an item
        .on('keydown', function( event ) {
          if (event.keyCode === $.ui.keyCode.TAB &&
              $(this).autocomplete('instance').menu.active) {
            event.preventDefault();
          }
        })
        .autocomplete({
          minLength: 0,
          delay: 0,
          source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(
              window.apf.artliste, extractLast( request.term ) ) );
          },
          focus: function() {
            // prevent value inserted on focus
            return false;
          },
          select: function( event, ui ) {
            var terms = split( this.value );
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push( ui.item.value );
            // add placeholder to get the comma-and-space at the end
            terms.push( "" );
            this.value = terms.join( ", " );
            $(this).trigger('change')
            return false;
          },
        })
    })
  }
}
