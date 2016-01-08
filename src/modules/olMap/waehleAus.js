'use strict'

var deactivateMenuItems = require('./deactivateMenuItems')
var addSelectFeaturesInSelectableLayers = require('./addSelectFeaturesInSelectableLayers')

module.exports = function () {
  deactivateMenuItems()
  addSelectFeaturesInSelectableLayers()
}
