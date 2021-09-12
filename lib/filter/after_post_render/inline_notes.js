const rInlineNotes = /\(\(\((.+?)\)\)\)/g

function transformInlineNotes(data) {
    let counter = 0
    const contents = []
    data.content = data.content.replace(rInlineNotes, (_, $1) => {
        counter++
        return `
        <sup id="fnref:${counter}">
            <a href="#fn:${counter}" rel="footnote"></a>
        </sup>
        <span class="footnote" style="display: none" id="fn:${counter}">${$1}</span>`
    })
}

module.exports = transformInlineNotes