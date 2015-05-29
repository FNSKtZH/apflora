/*
 * Erzeugt eine Liste von Hinweisen auf Daten, die geprüft werden sollten
 * Ziel: Datenverantwortliche kontrollieren die Qualität ihrer Daten weitgehend selbst
 * Felder:
 * - Datensatz (Datensatzbeschreibung): ist Link, der in neuem Tab öffnet
 * - Hinweis (Begründung, wieso der Datensatz angezeigt wird)
 *
 * jahresabhängige Daten: bei den meisten werden nur die Daten
 * des aktuellen oder manuell übersteuerten Berichtjahrs geprüft
 * Ausnahme: Ziele
 */

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  _ = require('underscore'),
  aktuellesBerichtjahr = require('./aktuellesBerichtjahr'),
  kontrolliereRelevanzAusserkantonalerTpop = require('./kontrolliereRelevanzAusserkantonalerTpop')

function tellUserIfNoIssues () {
  var html

  if (window.apf.qsList.items.length === 0) {
    html = '<li><p>juhui, keine Probleme gefunden!</p></li>'
    $('#qualitaetskontrollen').find('.list').html(html)
  }
}

function addDataToQsList (qsList, url) {
  $.ajax({
    type: 'get',
    url: url
  }).done(function (data) {
    // data ist Objekt-Array
    // Felder: ApArtId, hw, link
    // remove data without links
    data = _.filter(data, function (dat) {
      return !!dat.link
    })
    if (data && data.length > 0) {
      qsList.add(data)
    } else {
      setTimeout(function () {
        tellUserIfNoIssues()
      }, 500)
    }
    $('#tree').jstree('rename_node', '#qualitaetskontrollen' + window.localStorage.apId, 'Qualitätskontrollen (' + qsList.items.length + ')')
  })
}

function createUrlToAddDataFromViewToQsList (qsList, viewName, berichtjahr) {
  var baseUrl = 'api/v1/qkView/' + viewName + '/' + window.localStorage.apId,
    url = berichtjahr ? baseUrl + '/' + berichtjahr : baseUrl

  addDataToQsList(qsList, url)
}

function createUrlToAddDataFromQueryToQsList (qsList, queryName, berichtjahr) {
  var url = 'api/v1/' + queryName + '/' + window.localStorage.apId + '/' + berichtjahr

  addDataToQsList(qsList, url)
}

module.exports = function (berichtjahr) {
  var qsList = window.apf.qsList

  // clear list, otherwise items are added repeatedly
  qsList.clear()

  berichtjahr = berichtjahr || aktuellesBerichtjahr()
  // Berichtjahr anzeigen
  $('#qkBerichtjahr').val(berichtjahr)

  // jede Kontrollabfrage aufrufen
  // aus Daten ein Array values machen
  // diese Daten anfügen

  // AP mit Start im Jahr, ohne Stand Umsetzung
  // AP von AP-Art ohne Stand Umsetzung/Verantwortlich
  // AP ohne Verantwortlich?

  // pop ohne Nr/Name/Status/bekannt seit/Koordinaten/tpop
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_ohnepopnr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_ohnepopname')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_ohnepopstatus')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_ohnebekanntseit')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_ohnekoord')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_ohnetpop')
  // pop mit Status unklar, ohne Begründung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_mitstatusunklarohnebegruendung')
  // pop mit mehrdeutiger Nr
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_popnrmehrdeutig')
  // Pop ohne verlangten Pop-Bericht im Berichtjahr
  createUrlToAddDataFromQueryToQsList(qsList, 'qkPopOhnePopber', berichtjahr)
  // Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr
  createUrlToAddDataFromQueryToQsList(qsList, 'qkPopOhnePopmassnber', berichtjahr)
  // Entsprechen Koordinaten der Pop einer der TPops?
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_koordentsprechenkeinertpop')
  // pop mit Status ansaatversuch, es gibt tpop mit status aktuell
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_statusansaatversuchmitaktuellentpop')
  // pop mit Status ansaatversuch, es gibt tpop mit status ursprünglich erloschen
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_statusansaatversuchmittpopursprerloschen')
  // Population: Status ist "erloschen" (ursprünglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (ursprünglich oder angesiedelt)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_statuserloschenmittpopaktuell')
  // Population: Status ist "erloschen" (ursprünglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_statuserloschenmittpopansaatversuch')
  // Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "ursprünglich":
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_statusangesiedeltmittpopurspruenglich')
  // Population: Status ist "potenzieller Wuchs-/Ansiedlungsort", es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "ursprünglich":
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_pop_statuspotwuchsortmittpopanders')
  // tpop ohne Nr/Flurname/Status/bekannt seit/Koordinaten
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_ohnenr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_ohneflurname')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_ohnestatus')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_ohnebekanntseit')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_ohneapberrelevant')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_statuspotentiellfuerapberrelevant')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_erloschenundrelevantaberletztebeobvor1950')

  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_ohnekoordinaten')
  // pop/tpop mit Status unklar ohne Begründung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_mitstatusunklarohnebegruendung')
  // tpop mit mehrdeutiger Kombination von PopNr und TPopNr
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_popnrtpopnrmehrdeutig')
  // TPop ohne verlangten TPop-Bericht im Berichtjahr
  createUrlToAddDataFromQueryToQsList(qsList, 'qkTpopOhneTpopber', berichtjahr)
  // TPop ohne verlangten TPop-Massn.-Bericht im Berichtjahr
  createUrlToAddDataFromQueryToQsList(qsList, 'qkTpopOhneMassnber', berichtjahr)
  // Teilpopulation mit Status "Ansaatversuch", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_mitstatusansaatversuchundzaehlungmitanzahl')
  // Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_mitstatuspotentiellundmassnansiedlung')
  // Teilpopulation mit Status "aktuell", gemäss einem Teilpopulationsbericht erloschen
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpop_mitstatusaktuellundtpopbererloschen')
  // Massn ohne Jahr/Typ
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_massn_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_massn_ohnetyp', berichtjahr)
  // Massn.-Bericht ohne Jahr/Entwicklung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_massnber_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_massnber_ohneerfbeurt', berichtjahr)
  // Kontrolle ohne Jahr
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_feldkontr_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_freiwkontr_ohnejahr')
  // TODO: Kontrolle ohne Zählung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_feldkontr_ohnezaehlung', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_freiwkontr_ohnezaehlung', berichtjahr)
  // Feldkontrolle ohne Kontrolltyp
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_feldkontr_ohnetyp', berichtjahr)
  // Zählung ohne Einheit/Methode/Anzahl
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_feldkontrzaehlung_ohneeinheit', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_freiwkontrzaehlung_ohneeinheit', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_feldkontrzaehlung_ohnemethode', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_freiwkontrzaehlung_ohnemethode', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_feldkontrzaehlung_ohneanzahl', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_freiwkontrzaehlung_ohneanzahl', berichtjahr)
  // TPop-Bericht ohne Jahr/Entwicklung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpopber_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_tpopber_ohneentwicklung', berichtjahr)
  // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_popber_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_popber_ohneentwicklung', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_popmassnber_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_popmassnber_ohneentwicklung', berichtjahr)
  // Ziel ohne Jahr/Zieltyp/Ziel
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_ziel_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_ziel_ohnetyp')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_ziel_ohneziel')
  // Ziel-Bericht ohne Jahr/Entwicklung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_zielber_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_zielber_ohneentwicklung', berichtjahr)
  // AP-Erfolgskriterium ohne Beurteilung/Kriterien
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_erfkrit_ohnebeurteilung')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_erfkrit_ohnekriterien')
  // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_apber_ohnejahr')
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_apber_ohnevergleichvorjahrgesamtziel', berichtjahr)
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_apber_ohnebeurteilung', berichtjahr)
  // assoziierte Art ohne Art
  createUrlToAddDataFromViewToQsList(qsList, 'v_qk_assozart_ohneart')

  kontrolliereRelevanzAusserkantonalerTpop()
}
