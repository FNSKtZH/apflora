'use strict'

module.exports = function (beob) {
  var beobStatus = beob.BeobNichtZuordnen ? 'BeobNichtZuzuordnen' : 'BeobNichtBeurteilt'
  window.open('index.html?ap=' + window.localStorage.apId + '&' + beobStatus + '=' + beob.NO_NOTE, '_blank')
}
