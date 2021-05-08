'use strict'

const { wrap } = require("lodash")

const rBlockMath = /^\$\$\s*([\s\S]*?[^\$])\s*\$\$(?!\$)/gm
const rInlineMath = /^\$\s*([\s\S]*?[^\$])\s*\$(?!\$)/g

function wraps(code) {
    return '<hexoPostRenderCodeBlock>'
        + code
        + '</hexoPostRenderCodeBlock>'

}

function mathjax(data) {
    data.content = data.content
        .replace(rBlockMath, $0 => wraps($0))
        .replace(rInlineMath, $0 => wraps($0))
}

module.exports = mathjax