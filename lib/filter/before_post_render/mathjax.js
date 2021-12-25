"use strict"

const { wrap } = require("lodash")

const rBlockMath = /^\$\$\s*([^\$`]*?)\s*\$\$(?!\$)/gm
// const rInlineMath = /(?<!$)\$\s*([\s\S]*?[^\$])\s*\$(?!\$)/g
const rInlineMath = /(?<![\\$])\$([^\$`\n]+?)(?!\\)\$(?!\$)/g
const rHexoPostRenderEscape = /<hexoPostRenderCodeBlock>([\s\S]+?)<\/hexoPostRenderCodeBlock>/g
const rCodeBlockPlaceHolder = /(?:<|&lt;)!--code\uFFFC(\d+)--(?:>|&gt;)/g

const _escapeContent = (cache, flag, str) =>
  `<!--${flag}\uFFFC${cache.push(str) - 1}-->`
const _restoreContent = (cache) => (_, index) => {
  const value = cache[index]
  cache[index] = null
  return value
}
const restoreCodeBlocks = (str, cache) => {
  return str.replace(rCodeBlockPlaceHolder, _restoreContent(cache))
}

const escapeCodeBlocks = (str, cache) => {
  return str.replace(rHexoPostRenderEscape, ($0) =>
    _escapeContent(cache, "code", $0)
  )
}

function wraps(code) {
  return "<hexoPostRenderCodeBlock>" + code + "</hexoPostRenderCodeBlock>"
}

function mathjax(data) {
  const cache = []
  let content = escapeCodeBlocks(data.content, cache)

  content = content.replace(rBlockMath, ($0) => {
    console.log("TWO", $0)
    return wraps($0)
  })

  content = escapeCodeBlocks(content, cache)
  content = content.replace(rInlineMath, ($0) => {
    console.log("ONE", $0)

    return wraps($0)
  })
  // if (data.title.indexOf("Where")>=0) console.log(data.content)
  data.content = restoreCodeBlocks(content, cache).replace("\\$", "$")
}

module.exports = mathjax
