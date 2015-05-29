'use strict'

module.exports = function (tpopId) {
  window.open('index.html?ap=' + window.localStorage.apId + '&pop=' + window.localStorage.popId + '&tpop=' + tpopId, '_blank')
}
