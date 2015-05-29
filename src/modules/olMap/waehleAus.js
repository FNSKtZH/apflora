'use strict'

var deactivateMenuItems = require('./deactivateMenuItems'),
  addSelectFeaturesInSelectableLayers = require('./addSelectFeaturesInSelectableLayers')

module.exports = function () {
  deactivateMenuItems()
  addSelectFeaturesInSelectableLayers()
}
