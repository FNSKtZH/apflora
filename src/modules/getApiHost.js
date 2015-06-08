/*
 * need the host of the running app
 * to find out, which api-host to talk to
 * (should talk to local api-host in development)
 */
'use strict'

module.exports = function () {
  var hostname = window.location.hostname === '46.101.131.190' ? 'apflora.ch' : window.location.hostname
  var apiHost = 'http://api.' + hostname + ':4001'

  return apiHost
}
