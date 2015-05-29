/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var $ = require('jquery'),
  waehleApListe = require('../../waehleApListe')

module.exports = function () {
  waehleApListe($(this).attr('id'))
}
