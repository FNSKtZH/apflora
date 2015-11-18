'use strict'

import app from 'ampersand-app'
// import 'expose?$!expose?jQuery!jquery'
// need this polyfill to transform promise.all
// without it IE 11 and lower bark
// import 'babel-polyfill'
// make webpack import styles
// import './styles/main.styl'
// import 'file?name=apflora.css!../style/apflora.css'
// make webpack import server.js
// import 'file?name=server.js!../server.js'
// import apflora from './apflora.js'

/**
 * expose 'app' to the browser console
 * this is handy to call actions and stores in the browser console
 */
window.app = app

// apflora()

/**
 * ampersand-app is extended with app methods (=singleton)
 * modules that need an app method import ampersand-app instead of using a global
 */
/*
 app.extend({
  init () {
    this.Actions = actions()
    stores(this.Actions)
    Promise.all([
      this.db = new PouchDB(couchUrl())
    ])
    .then(() => {
      this.router = new Router()
      this.router.history.start()
    })
    .catch((error) => app.Actions.showError({title: 'Fehler in app.js:', msg: error}))
  }
})*/

/**
 * o.k., everything necessary is prepared
 * now lauch the app
 */
app.init()
