/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery')

module.exports = function (tpopId) {
  window.localStorage.tpopId = tpopId
  $.jstree._reference("[typ='tpop']#" + tpopId).deselect_all()
  $('#tree').jstree('select_node', "[typ='tpop']#" + tpopId)
}
