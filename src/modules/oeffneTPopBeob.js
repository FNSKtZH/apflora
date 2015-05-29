'use strict'

var $ = require('jquery')

module.exports = function (beobId) {
  window.localStorage.beobId = beobId
  $.jstree._reference("[typ='beobZugeordnet']#beob" + beobId).deselect_all()
  $('#tree').jstree('select_node', "[typ='beobZugeordnet']#beob" + beobId)
}
