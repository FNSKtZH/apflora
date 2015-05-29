/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

module.exports = function (event) {
  if (event.keyCode === 46) {
    // verhindern, dass im tree nodes gelöscht werden
    event.stopPropagation()
  }
}
