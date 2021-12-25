const { spawnSync } = require("child_process")
const fs = require("fs")
const { argv } = require("process")

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2(\n+|$)/gm

const defaultHeading = `
    graph [bgcolor="#ffffff00", minlen=2];
    node [shape="egg", color="#444444", fillcolor="seashell", style="filled", fontcolor="#444444", height=0.1, margin="0.1,0.04"];
    edge [color="#444444", fontcolor="#444444", constraint=false, fontsize=10];
`

function graphviz(data) {
  if (!this.config.imbedrender.enable) return

  data.content = data.content.replace(
    rBacktick,
    ($0, start, $2, _args, _content, end) => {
      function wraps(result) {
        return (
          start +
          "<hexoPostRenderCodeBlock>" +
          result +
          "</hexoPostRenderCodeBlock>" +
          end
        )
      }

      let content = _content.replace(/\n$/, "")
      content = content
        .replace(/^([^{]*{)/, (_, $1) => $1 + defaultHeading)
        .replace(/@c/g, "constraint=true")
        .replace(/@i/g, "style=invis")

      if (_args !== "dot") return $0

      if (start.includes(">")) {
        // heading of last line is already removed by the top RegExp "rBacktick"
        const depth = start.split(">").length - 1
        const regexp = new RegExp(
          `^([^\\S\\r\\n]*>){0,${depth}}([^\\S\\r\\n]|$)`,
          "mg"
        )
        content = content.replace(regexp, "")
      }

      const p = spawnSync("dot", ["-Tsvg"], { input: content })
      const stderr = p.stderr.toString()
      const stdout = p.stdout.toString()
      if (p.status !== 0 || stderr) {
        console.error(stderr || stdout)
        return wraps(`<code><pre>${stderr || stdout}</pre></code>`)
      }

      return wraps('<figure class="graphviz">' + stdout + "</figure>")
    }
  )
}

module.exports = graphviz
