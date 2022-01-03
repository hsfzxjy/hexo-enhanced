"use strict"

const rBlockMath = /^\$\$([^\$]+?)\$\$/gm
const rInlineMath = /(?<!\$)\$([^\$\n]+?)\$(?!\$)/g
const rHexoPostRenderEscape = /<hexoPostRenderCodeBlock>([\s\S]+?)<\/hexoPostRenderCodeBlock>/g
const rInlineCode = /(?<!`)`[^`]+`(?!`)/g
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
  const escaper = ($0) => _escapeContent(cache, "code", $0)
  const ret = str
    .replace(rHexoPostRenderEscape, escaper)
    .replace(rInlineCode, escaper)
  // console.debug("CACHE", cache)
  return ret
}

function wraps(code) {
  console.log("WRAPPING", code)
  return "<hexoPostRenderCodeBlock>" + code + "</hexoPostRenderCodeBlock>"
}

function mathjax(data) {
  const cache = []
  const content = escapeCodeBlocks(data.content, cache)
    .replace(rBlockMath, wraps)
    .replace(rInlineMath, wraps)

  data.content = restoreCodeBlocks(content, cache)
}

module.exports = mathjax
