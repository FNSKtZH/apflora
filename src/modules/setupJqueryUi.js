// diese Einstellungen funktionieren nur, wenn sie von index.html direkt ausgelöst werden
// ursprünglich waren sie in index.html selber enthalten
// es klappt aber auch, wenn index.html sie via globale Variable aufruft

'use strict'

var $ = require('jquery')
var initializeTooltipsInElement = require('./initializeTooltipsInElement')

module.exports = function () {
  // jQuery ui widgets initiieren
  // aus unerfindlichem Grund muss das in index.html passieren. Schade
  $('#programmWahl').buttonset({
    create: function () {
      // erst jetzt einblenden, weil sonst die normalen checkboxen aufblitzen
      $('#programmWahl').show()
    }
  })
  $('#olMapMessen').buttonset()
  $('button').button()
  $("input[type='button']").button()
  $('#tpopfeldkontrTabs').tabs()

  // tooltip: Klasse zuweisen, damit gestylt werden kann
  $('#label_olmap_infos_abfragen, #label_olmap_distanz_messen, #label_olmap_flaeche_messen, #label_olmap_auswaehlen, #olMapExportierenDiv, .apfTooltip').tooltip({
    tooltipClass: 'tooltip-styling-hinterlegt',
    content: function () {
      return $(this).attr('title')
    }
  })

  $('.exportAbschnitt').tooltip({
    tooltipClass: 'export_abschnitt_tooltip_class',
    content: function () {
      return $(this).attr('title')
    }
  })

  $('#olMapExportieren').button({
    icons: { primary: 'ui-icon-circle-arrow-s' },
    text: false,
    disabled: true
  })

  // Datumsfelder: Widget initiieren
  var monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  var wochentageKurz = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  var wochentageLang = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

  $.datepicker.setDefaults({
    buttonImage: 'style/images/calendar.gif',
    buttonImageOnly: true,
    dateFormat: 'dd.mm.yy',
    altFormat: 'dd.mm.yy',
    monthNames: monate,
    dayNamesMin: wochentageKurz,
    dayNames: wochentageLang,
    firstDay: 1,
    showOn: 'button',
    defaultDate: +0,
    onSelect: function () {
      $(this).trigger('change')
    }
  })

  // datepicker nur initialisieren, wenn der Browser keinen eigenen hat (z.B. Chrome)
  if (!window.apf.isDateSupported()) {
    $('#TPopKontrDatum, #TPopMassnDatum, #JBerDatum, #IbErstelldatum').datepicker()
  }

  initializeTooltipsInElement($('body'))
}
