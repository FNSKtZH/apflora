'use strict'

var $ = require('jquery'),
  getTimestamp = require('../../getTimestamp'),
  getApiHost = require('../../getApiHost')

module.exports = function () {
  var apId = this.value
  var url = getApiHost() + '/exportView/csv/view=v_tpop_anzkontrinklletzterundletztertpopber/filename=anzkontrinklletzterundletztertpopber_' + getTimestamp() + '/' + apId
  $.fileDownload(url, {
    preparingMessageHtml: 'Der Download wird vorbereitet, bitte warten...',
    failMessageHtml: 'Beim Aufbereiten des Downloads ist ein Problem aufgetreten, bitte nochmals versuchen.'
  })
  $('#ewmsApWaehlenTextLoeschen').trigger('click')
}
