/*
 * need the host of the running app
 * to find out, which api-host to talk to
 * (should talk to local api-host in development)
 */
'use strict'

module.exports = function () {
  var hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'
  var apiHost = isLocalhost ? 'http://localhost:4001' : 'https://' + window.location.hostname + '/api'
  return apiHost
}
