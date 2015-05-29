'use strict'

var $ = require('jquery')

module.exports = function (element) {
  element.find('.apf-with-tooltip').each(function () {
    $(this).qtip({
      content: {
        text: $(this).next('.tooltiptext'),
        title: 'Legende'
      },
      style: {
        // Use the jQuery UI widget classes
        widget: true,
        // Remove the default styling
        def: false,
        tip: false
      },
      position: {
        my: 'top right',
        at: 'bottom right',
        target: $(this),
        viewport: $(window)
      }
    })
  }).qtip({
    events: {
      render: function (event, api) {
        api.elements.wrapper.addClass('ui-corner-all')
      }
    }
  })
}
