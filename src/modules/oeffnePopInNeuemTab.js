/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

module.exports = function (popId) {
  window.open('index.html?ap=' + window.localStorage.apId + '&pop=' + popId, '_blank')
}
