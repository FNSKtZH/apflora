'use strict'

var getSelectedFeatures = require('./getSelectedFeatures')

module.exports = function (type) {
  var featuresArray = getSelectedFeatures(),
    returnArray = [],
    featureType

  if (featuresArray.length === 0) {
    return []
  }
  featuresArray.forEach(function (feature) {
    featureType = feature.get('myTyp')
    if (featureType === type) {
      returnArray.push(feature)
    }
  })
  return returnArray
}
