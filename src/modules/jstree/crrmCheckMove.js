// hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind

'use strict'

module.exports = function (m) {
  if (m.o.attr('typ') === 'pop') {
    if (m.r.attr('typ') === 'pop') {
      return {
        after: true,
        before: true,
        inside: false
      }
    }
    return false
  }
  if (m.o.attr('typ') === 'tpop') {
    switch (m.r.attr('typ')) {
      case 'tpop':
        return {
          after: true,
          before: true,
          inside: false
        }
      case 'popOrdnerTpop':
        return {
          after: false,
          before: false,
          inside: true
        }
      default:
        return false
    }
  }
  if (m.o.attr('typ') === 'tpopmassn') {
    switch (m.r.attr('typ')) {
      case 'tpopmassn':
        return {
          after: true,
          before: true,
          inside: false
        }
      case 'tpopOrdnerMassn':
        return {
          after: false,
          before: false,
          inside: true
        }
      default:
        return false
    }
  }
  if (m.o.attr('typ') === 'tpopfeldkontr') {
    switch (m.r.attr('typ')) {
      case 'tpopfeldkontr':
        return {
          after: true,
          before: true,
          inside: false
        }
      case 'tpopOrdnerFeldkontr':
        return {
          after: false,
          before: false,
          inside: true
        }
      default:
        return false
    }
  }
  if (m.o.attr('typ') === 'tpopfreiwkontr') {
    switch (m.r.attr('typ')) {
      case 'tpopfreiwkontr':
        return {
          after: true,
          before: true,
          inside: false
        }
      case 'tpopOrdnerFreiwkontr':
        return {
          after: false,
          before: false,
          inside: true
        }
      default:
        return false
    }
  }
  return false
}
