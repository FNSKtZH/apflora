'use strict'

var speichern = require('../../speichern')

module.exports = function () {
  /**
   * Problem: Sometimes two speichern calls come at nearly the same momen
   * for instance, when a number input was changed, followed dicrectly
   * by choosing an option/checkbox
   * So setTimeout is needed, to make sure that
   * speichern calls emitted from radios and checkboxes are delayed
   */
  var that = this
  var wait = 0
  if (this.type && (this.type === 'radio' || this.type === 'checkbox')) wait = 100

  setTimeout(function () {
    speichern(that)
  }, wait)
}
