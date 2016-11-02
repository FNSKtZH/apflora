/*
 * need the host of the running app
 * to find out, which api-host to talk to
 * (should talk to local api-host in development)
 */
'use strict'

module.exports = function () {
  var hostnameWithoutWww = window.location.hostname.replace('www.', '')
  var hostname = hostnameWithoutWww === '138.68.68.80' ? 'apflora.ch' : hostnameWithoutWww
  var apiHost = 'https://api.' + hostname

  return apiHost
}
