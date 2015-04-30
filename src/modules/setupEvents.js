/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                   = require('jquery'),
    onWindowResize                      = require('./events/onWindowResize'),
    onClickUndelete                     = require('./events/onClickUndelete'),
    onKeydownSuchen                     = require('./events/menu/onKeydownSuchen'),
    onClickExportieren                  = require('./events/menu/onClickExportieren'),
    onClickProgrammWahl                 = require('./events/menu/onClickProgrammWahl'),
    onClickApLoeschen                   = require('./events/menu/onClickApLoeschen'),
    onChangeApWaehlen                   = require('./events/menu/onChangeApWaehlen'),
    onClickApWaehlenTextLoeschen        = require('./events/menu/onClickApWaehlenTextLoeschen'),
    onKeyupClickSuchen                  = require('./events/menu/onKeyupClickSuchen'),
    onKeydownForm                       = require('./events/forms/onKeydownForm'),
    onChangeSpeichern                   = require('./events/forms/onChangeSpeichern'),
    onClickKopiereKoordinatenInPop      = require('./events/forms/onClickKopiereKoordinatenInPop'),
    onClickGuid                         = require('./events/forms/onClickGuid'),
    onKeyupFocusTextarea                = require('./events/forms/onKeyupFocusTextarea'),
    onClickExportPop                    = require('./events/forms/onClickExportPop'),
    onClickExportKontr                  = require('./events/forms/onClickExportKontr'),
    onClickExportTpop                   = require('./events/forms/onClickExportTpop'),
    onClickExportTpopMassn              = require('./events/forms/onClickExportTpopMassn'),
    onChangeBerUrl                      = require('./events/forms/onChangeBerUrl'),
    onClickExport                       = require('./events/forms/onClickExport'),
    onClickExportDatenstrukturGrafisch  = require('./events/forms/onClickExportDatenstrukturGrafisch'),
    onClickOlMapExportieren             = require('./events/forms/olMap/onClickOlMapExportieren'),
    onClickOlmapLayertreeCheckbox       = require('./events/forms/olMap/layertree/onClickOlmapLayertreeCheckbox'),
    onClickLayertreePopStyle            = require('./events/forms/olMap/layertree/onClickLayertreePopStyle'),
    onClickLayertreeTpopStyle           = require('./events/forms/olMap/layertree/onClickLayertreeTpopStyle'),
    onClickModifyLayer                  = require('./events/forms/olMap/layertree/onClickModifyLayer'),
    onClickRenameLayer                  = require('./events/forms/olMap/layertree/onClickRenameLayer'),
    onClickEntferneLayer                = require('./events/forms/olMap/layertree/onClickEntferneLayer'),
    onClickNeuesLayer                   = require('./events/forms/olMap/layertree/onClickNeuesLayer'),
    onClickErgebnisAuswahlClose         = require('./events/forms/olMap/onClickErgebnisAuswahlClose'),
    onClickOeffneBeob                   = require('./events/forms/gMap/onClickOeffneBeob'),
    onClickOeffneBeobInNeuemTab         = require('./events/forms/gMap/onClickOeffneBeobInNeuemTab'),
    onClickGMapDistanzMessen            = require('./events/forms/gMap/onClickGMapDistanzMessen'),
    onClickGMapDistanzMessenEntfernen   = require('./events/forms/gMap/onClickGMapDistanzMessenEntfernen'),
    onClickDetailplaeneCheckbox         = require('./events/forms/gMap/onClickDetailplaeneCheckbox'),
    onChangeBeobNichtBeurteilt          = require('./events/forms/beob/onChangeBeobNichtBeurteilt'),
    onChangeBeobNichtZuordnen           = require('./events/forms/beob/onChangeBeobNichtZuordnen'),
    onChangeDistZuTPop                  = require('./events/forms/beob/onChangeDistZuTPop'),
    onSelectmenuchangeExportLayerSelect = require('./events/forms/olMap/layertree/onSelectmenuchangeExportLayerSelect'),
    initiiereQualitaetskontrollen       = require('./initiiereQualitaetskontrollen'),
    kontrolliereProgramm                = require('./kontrolliereProgramm'),
    onClickQkSort                       = require('./events/forms/onClickQkSort'),
    onClickQkSearchEmpty                = require('./events/forms/onClickQkSearchEmpty'),
    onClickQkRefresh                    = require('./events/forms/onClickQkRefresh');

module.exports = function () {

    $(window).resize(                                          onWindowResize);
    $('#undeleteDiv')
        .on('click',            '.undeleteLink',               onClickUndelete);

    $('#menu')
        .on('click',            '.exportieren',                onClickExportieren)
        .on('click',            '[name=programmWahl]',         onClickProgrammWahl);
    $('#apLoeschen')
        .on('click',                                           onClickApLoeschen);
    $('#apWaehlen')
        .on('change',                                          onChangeApWaehlen);
    $('#apWaehlenTextLoeschen')
        .on('click',                                           onClickApWaehlenTextLoeschen);
    $('#suchen')
        .on('keydown',                                         onKeydownSuchen)
        .on('keyup click',                                     onKeyupClickSuchen);

    $("#forms")
        .on('keydown',                                         onKeydownForm)
        .on('click',           '.guid',                        onClickGuid)
        .on('click',           '.exportPop',                   onClickExportPop)
        .on('click',           '.exportKontr',                 onClickExportKontr)
        .on('click',           '.exportTpop',                  onClickExportTpop)
        .on('click',           '.exportMassn',                 onClickExportTpopMassn);
    $('.form')
        .on('change',          '.speichern',                   onChangeSpeichern)
        .on('keyup focus',     'textarea',                     onKeyupFocusTextarea);
    $('#kopiereKoordinatenInPop')
        .on('click',                                           onClickKopiereKoordinatenInPop);

    $('#qualitaetskontrollen')
        .on('click',             '.sort',                      onClickQkSort)
        .on('click',             '#qkSearchEmpty',             onClickQkSearchEmpty)
        .on('click',             '.qkRefresh',                 onClickQkRefresh)
        .on('change',            '#qkBerichtjahr', function () {

            console.log('kontrolliere Programm für Berichtjahr ', $(this).val());

            kontrolliereProgramm($(this).val());
        });

    $('#olMapExportieren')
        .on('click',                                           onClickOlMapExportieren);
    $('#olMapLayertree')
        .on('click',            '.olmapLayertreeCheckbox',     onClickOlmapLayertreeCheckbox)
        .on('click',            '.layertreePopStyle',          onClickLayertreePopStyle)
        .on('click',            '.layertreeTpopStyle',         onClickLayertreeTpopStyle)
        .on('click',            '.modifyLayer',                onClickModifyLayer)
        .on('selectmenuchange', '.exportLayerSelect',          onSelectmenuchangeExportLayerSelect)
        .on('click',            '.renameLayer',                onClickRenameLayer)
        .on('click',            '.entferneLayer',              onClickEntferneLayer)
        .on('click',            '.neuesLayer',                 onClickNeuesLayer);
    $('#olMapErgebnisAuswahlHeader')
        .on('click',            '.ui-icon.ui-icon-closethick', onClickErgebnisAuswahlClose);

    $('#gMap')
        .on('click',            '.oeffneBeob',                 onClickOeffneBeob)
        .on('click',            '.oeffneBeobInNeuemTab',       onClickOeffneBeobInNeuemTab);
    $('#gMapDetailplaeneCheckbox')
        .on('click',                                           onClickDetailplaeneCheckbox);
    $('#gMapDistanzMessen')
        .on('click',                                           onClickGMapDistanzMessen);
    $('#gMapDistanzMessenEntfernen')
        .on('click',                                           onClickGMapDistanzMessenEntfernen);

    $('#berUrl')
        .on('change',                                          onChangeBerUrl);

    $('#beob')
        .on('change',           '[name="distZuTPop"]',         onChangeDistZuTPop);
    $('#beobNichtBeurteilt')
        .on('change',                                          onChangeBeobNichtBeurteilt);
    $('#beobNichtZuordnen')
        .on('change',                                          onChangeBeobNichtZuordnen);

    $('#exporte')
        .on('click',            '.export',                     onClickExport);
    $('#exportDatenstrukturGrafisch')
        .on('click',                                           onClickExportDatenstrukturGrafisch);

    // verhindern, dass Zahlen durch Scrollen am Mausrad aus Versehen verändert werden
    $('body').on('mousewheel', '[type="number"]', function (event) {
        event.preventDefault();
    });
};