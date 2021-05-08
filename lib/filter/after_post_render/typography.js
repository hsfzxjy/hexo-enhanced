"use strict"

const rNoIndentP = /<p\s*>\s*@noindent/g
const rParP = /<p\s*>\s*@par/g

function typography(data) {
    data.content = data.content
        .replace(rNoIndentP, `<p style=\"text-indent: 0;\">`)
        .replace(rParP, '<p style="text-indent: 0; margin-top: 0;">')
}

module.exports = typography
