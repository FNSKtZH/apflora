'use strict'

module.exports = function () {
  if (window.apf.olMap.modifyInteraction) {
    window.apf.olMap.map.removeInteraction(window.apf.olMap.modifyInteraction)
    delete window.apf.olMap.modifyInteraction
  }
}
