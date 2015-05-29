'use strict'

module.exports = function (popId) {
  window.open('index.html?ap=' + window.localStorage.apId + '&pop=' + popId, '_blank')
}
