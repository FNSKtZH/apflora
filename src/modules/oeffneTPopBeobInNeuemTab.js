/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

module.exports = function (beobId) {
  window.open('index.html?ap=' + window.localStorage.apId + '&pop=' + window.localStorage.popId + '&tpop=' + window.localStorage.tpopId + '&beobNichtBeurteilt=' + beobId, '_blank')
}
