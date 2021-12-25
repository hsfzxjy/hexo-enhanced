"use strict"

function lodashFilter(locals) {
  locals._ = require("lodash")
  return locals
}

module.exports = lodashFilter
