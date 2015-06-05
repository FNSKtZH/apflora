/*
 * need the host of the running app
 * to find out, which api-host to talk to
 * (should talk to local api-host in development)
 */
'use strict'

module.exports = function () {
  var apiHost = 'http://api.' + window.location.hostname + ':4000'

  return apiHost
}
