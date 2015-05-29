'use strict'

var $ = require('jquery'),
  waehleApListe = require('../../waehleApListe')

module.exports = function () {
  waehleApListe($(this).attr('id'))
}
