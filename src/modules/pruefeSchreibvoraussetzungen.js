'use strict'

var pruefeLesevoraussetzungen = require('./pruefeLesevoraussetzungen'),
  melde = require('./melde')

module.exports = function () {
  // kontrollieren, ob der User online ist
  if (pruefeLesevoraussetzungen()) {
    // kontrollieren, ob der User Schreibrechte hat
    if (window.sessionStorage.NurLesen) {
      melde('Sie haben keine Schreibrechte', 'Speichern abgebrochen')
      return false
    }
    return true
  }
}
