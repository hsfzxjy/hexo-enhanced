"use strict"

const lodash = require("lodash")

function wraps(module) {
  const engine = require(module)

  function compile(data) {
    return engine.compile(data.text, {
      filename: data.path,
    })
  }

  function renderer(data, locals) {
    return compile(data)(Object.assign({ _: lodash }, locals))
  }

  return renderer
}

module.exports = {
  jade: wraps("jade"),
  pug: wraps("pug"),
}
