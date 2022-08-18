const rHLLabelCode = /<code>@#([^`]*?)<\/code>/g
const rHTag = /<code>@!((#[0-9a-fA-Z]{6}|%[a-z]+)\s+)?([^`]*?)<\/code>/g

function highlightHLLabel(data) {
  data.content = data.content
    .replace(rHLLabelCode, (_, $1) => {
      return `<code class="_hl-label">${$1}</code>`
    })
    .replace(rHTag, (_, $color, _2, $content) => {
      if ($color !== undefined) {
        $color = $color.trim()
        if ($color.startsWith("%")) {
          $color = $color.replace(/^%/,'')
          $color = `var(--${$color}-color)`
        }
      } else {
        $color = ""
      }
      return `<code class="_hl-tag" style="background-color: ${$color}">${$content}</code>`
    })
}

module.exports = highlightHLLabel
