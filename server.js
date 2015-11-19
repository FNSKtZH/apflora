/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

/*var // wird nur in Entwicklung genutzt
  serverOptionsDevelopment = {
    debug: {
      log: ['error'],
      request: ['error']
    }
  },*/
var Hapi = require('hapi'),
  Inert = require('inert'),
  server = new Hapi.Server()

server.register(Inert, function () {
  server.connection({
    host: '0.0.0.0',
    port: 4000
  })

  server.start(function (err) {
    if (err) {
      throw err
    }
    console.log('Server running at:', server.info.uri)
  })

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: function (request, reply) {
      reply.file('index.html')
    }
  })

  server.route({
    method: 'GET',
    path: '/src/{param*}',
    handler: {
      directory: {
        path: 'src'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/style/images/{param*}',
    handler: {
      directory: {
        path: 'style/images'
      }
    }
  })

  /* Versuch, funktioniert nicht*/
  server.route({
    method: 'GET',
    path: '/etc/{param*}',
    handler: {
      directory: {
        path: 'etc'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/style/{param*}',
    handler: {
      directory: {
        path: 'style'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/img/{param*}',
    handler: {
      directory: {
        path: 'img'
      }
    }
  })
})
