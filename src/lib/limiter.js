/**
 * damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
 * Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
 */

'use strict'

module.exports = function ($) {
  $.fn.extend({
    limiter: function (limit, elem) {
      function setCount (src, elem) {
        // sometimes src was undifined ???
        if (src && src.value) {
          var chars = src.value.length
          if (chars > limit) {
            src.value = src.value.substr(0, limit)
            chars = limit
          }
          elem.html(limit - chars)
        }
      }
      $(this).on('keyup focus', function () {
        setCount(this, elem)
      })
      setCount($(this)[0], elem)
    }
  })
}
