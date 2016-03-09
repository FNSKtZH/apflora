'use strict'

var $ = require('jquery')

module.exports = function () {
  var $BerURL = $('#BerURL')
  var url = $BerURL.val()

  if (url.substring(0, 3) === 'www') {
    url = '//' + url
    $BerURL.val(url)
  } else if (url.substring(0, 4) !== 'http') {
    url = '//www.' + url
    $BerURL.val(url)
  }
  $('#BerURLHref').attr('onClick', "window.open('" + url + "', target='_blank')")
}
