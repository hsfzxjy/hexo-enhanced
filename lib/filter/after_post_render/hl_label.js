const rHLLabelCode = /<code>@#([^`]*?)<\/code>/g

function highlightHLLabel(data) {
    data.content = data.content.replace(rHLLabelCode, (_, $1) => {
        return `<code class="_hl-label">${$1}</code>`
    })
}

module.exports = highlightHLLabel
