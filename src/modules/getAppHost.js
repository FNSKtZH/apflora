/*
 * need the host of the running app
 * to find out, which host to talk to
 * (should talk to local host in development)
 */
'use strict'

module.exports = function () {
  var hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'
  var hostname = isLocalhost ? 'localhost' : 'apflora.ch'
  var appHost = 'http://' + hostname + ':4000'

  return appHost
}
