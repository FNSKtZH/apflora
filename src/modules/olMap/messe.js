'use strict'

var addMeasureInteraction = require('./addMeasureInteraction')
var deactivateMenuItems = require('./deactivateMenuItems')
var removeMeasureInteraction = require('./removeMeasureInteraction')

module.exports = function (element) {
  deactivateMenuItems()
  if (element.value === 'line' && element.checked) {
    addMeasureInteraction('LineString')
  } else if (element.value === 'polygon' && element.checked) {
    addMeasureInteraction('Polygon')
  } else {
    // es wurde 'infos abfragen geklickt'
    removeMeasureInteraction()
  }
}
