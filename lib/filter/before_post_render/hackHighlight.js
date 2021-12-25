let hexoPath
try {
  throw new Error()
} catch (e) {
  const tb = /at require\s*\((.*?hexo\/)lib\/hexo\/index\.js/m.exec(e.stack)
  hexoPath = tb[1]
}

const hexoUtil = require(`${hexoPath}node_modules/hexo-util`)

const oldHightlight = hexoUtil.highlight

const rBeginHL = /hl:\s*begin\s*(#(\w+))?/
const rEndHL = /hl:\s*end/

function highlight(str, options = {}) {
  const lines = []
  const regions = []
  let start = null
  let label = null
  for (let line of str.split("\n")) {
    let matched = rBeginHL.exec(line)
    if (matched) {
      if (start === null) {
        start = lines.length
        label = matched[2] === undefined ? null : matched[2]
        continue
      }
    } else if (rEndHL.test(line)) {
      if (start !== null) {
        regions.push([start, lines.length - 1, label])
        start = null
        continue
      }
    }
    lines.push(line)
  }
  regions.push([Infinity, Infinity])
  let result = oldHightlight(lines.join("\n"), options)

  result = result.replace(
    /<td class="code">.*<\/td><\/tr><\/table><\/figure>/,
    (code) => {
      let i = 0
      let lineno = 0
      return code.replace(/<span class="line">|<\/td>/g, (snippet) => {
        if (lineno === regions[i][0]) {
          let label = ""
          if (regions[i][2] !== null) {
            label = `<span class="_hl-label">${regions[i][2]}</span>`
          }
          snippet = '<div class="_hl">' + label + snippet
        } else if (lineno === regions[i][1] + 1) {
          snippet = "</div>" + snippet
          i++
        }
        lineno++
        return snippet
      })
    }
  )
  return result
}

hexoUtil.highlight = highlight
