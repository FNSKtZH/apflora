'use strict'

var $ = require('jquery')
var waehleApListe = require('../../waehleApListe')

module.exports = function () {
  waehleApListe($(this).attr('id'))
}
