'use strict'

var $ = require('jquery')

module.exports = function (popId) {
  window.localStorage.popId = popId
  $.jstree._reference("[typ='pop']#" + popId).deselect_all()
  $('#tree').jstree('select_node', "[typ='pop']#" + popId)
}
