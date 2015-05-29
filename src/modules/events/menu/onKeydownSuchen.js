/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

module.exports = function (event) {
  if (event.keyCode === 46) {
    event.stopPropagation()
  }
}
