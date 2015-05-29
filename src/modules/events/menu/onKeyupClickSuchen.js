'use strict'

var $ = require('jquery')

module.exports = function (event) {
  if (event.keyCode === 13) {
    $('#tree').jstree('search', this.value)
  } else {
    $('#tree').jstree('clear_search')
  }
}
