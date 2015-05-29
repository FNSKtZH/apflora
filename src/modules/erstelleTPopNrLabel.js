// tooltip bzw. label vorbereiten: nullwerte ausblenden

'use strict'

module.exports = function (popnr, tpopnr) {
  popnr = popnr || '?'
  tpopnr = tpopnr || '?'
  return popnr + '/' + tpopnr
}
