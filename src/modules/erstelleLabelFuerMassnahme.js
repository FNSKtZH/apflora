// erwartet aktuelle Werte für jahr und beurteilung
// erstellt den label für den Baum

'use strict'

module.exports = function (jahr, beurteilung) {
  jahr = jahr || '(kein Jahr)'
  beurteilung = beurteilung || '(keine Beurteilung)'
  return jahr + ': ' + beurteilung
}
