'use strict'

var fitTextareaToContent = require('../../fitTextareaToContent')

module.exports = function () {
  fitTextareaToContent(this, document.documentElement.clientHeight)
}
