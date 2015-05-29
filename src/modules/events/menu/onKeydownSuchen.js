'use strict'

module.exports = function (event) {
  if (event.keyCode === 46) {
    event.stopPropagation()
  }
}
