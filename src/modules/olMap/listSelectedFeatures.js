// retourniert features
// übergibt man einen Typ, werden nur features dieses Typs retourniert
// offenbar nicht benutzt

'use strict'

var _ = require('underscore')

module.exports = function (typ) {
  var selectedFeatures = window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray()
  var featuresToReturn = _.filter(selectedFeatures, function (feature) {
    if (typ) {
      return feature.get('myTyp') === typ
    }
    return feature.get('myTyp')
  })
  return featuresToReturn
}
