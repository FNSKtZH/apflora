'use strict'

module.exports = function (beob) {
  var beobStatus = (beob.beobNichtZuordnen ? 'beobNichtZuzuordnen' : 'beobNichtBeurteilt')
  window.open('index.html?ap=' + window.localStorage.apId + '&' + beobStatus + '=' + beob.NO_NOTE, '_blank')
}
