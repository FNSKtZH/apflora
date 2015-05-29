/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

module.exports = function (beobId) {
  window.open('index.html?ap=' + localStorage.apId + '&pop=' + localStorage.popId + '&tpop=' + localStorage.tpopId + '&beobNichtBeurteilt=' + beobId, '_blank')
}
