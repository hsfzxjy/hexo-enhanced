"use strict"

const rNoIndentP = /<p\s*>\s*@noindent/g
const rParP = /<p\s*>\s*@par/g
const rNoMarginP = /<p\s*>\s*@nomargin/g

function typography(data) {
  data.content = data.content
    .replace(rNoIndentP, `<p style=\"text-indent: 0;\">`)
    .replace(rParP, '<p style="text-indent: 0; margin-top: 0;">')
    .replace(rNoMarginP, `<p style="margin-top: 0.5em;">`)

  data.extra_classes = data.extra_classes || []
  if (Array.from(data.content.matchAll(/[\u4e00-\u9fa5]/g)).length >= 50)
    data.extra_classes.push("justify")
}

module.exports = typography
