'use strict'

var $ = require('jquery')
var downloadFileFromView = require('../..//downloadFileFromView')
var melde = require('../../melde')

module.exports = function (event) {
  // view v_tpop_anzkontrinklletzterundletztertpopber stürzt auf dem Server ab
  if ($(this).attr('view') === 'v_tpop_anzkontrinklletzterundletztertpopber') {
    // sind wir auf dem Server?
    if (window.location.hostname !== 'localhost') {
      event.preventDefault()
      return melde('Sie haben die eierlegende Wollmilchsau gewählt.<br><br>Leider überfordert sie den Server.<br><br>Bitten Sie <a href="mailto:alex@gabriel-software.ch">Alex</a>, die Abfrage auf seinem PC auszuführen und Ihnen die Daten zu schicken', 'oh je')
    }
  }
  downloadFileFromView($(this).attr('view'), $(this).attr('filename'), $(this).attr('format') || null)
  return false // this is critical to stop the click event which will trigger a normal file download!
}
