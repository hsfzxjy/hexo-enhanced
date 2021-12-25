const { spawnSync } = require("child_process")
const fs = require("fs")
const { argv } = require("process")

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2(\n+|$)/gm

function imbedRender(data) {
  if (!this.config.imbedrender.enable) return

  const binPath = this.config.imbedrender.bin
  const prefix = this.config.imbedrender.prefix
  if (!fs.existsSync(binPath)) throw new Error(`${binPath} does not exist`)

  const rImbedInput = new RegExp(`${prefix}\\s*(.+)[\\r\\n$]`, "m")

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

      let imbedArg
      let matched = rImbedInput.exec(_args)
      if (matched) imbedArg = matched[1]
      if (!imbedArg) {
        matched = rImbedInput.exec(content)
        if (matched) imbedArg = matched[1]
      }
      if (!imbedArg) return $0

      if (start.includes(">")) {
        // heading of last line is already removed by the top RegExp "rBacktick"
        const depth = start.split(">").length - 1
        const regexp = new RegExp(
          `^([^\\S\\r\\n]*>){0,${depth}}([^\\S\\r\\n]|$)`,
          "mg"
        )
        content = content.replace(regexp, "")
      }

      const p = spawnSync(
        process.execPath,
        [binPath, "--silent", "render", imbedArg],
        { input: content }
      )
      const stderr = p.stderr.toString()
      const stdout = p.stdout.toString()
      if (p.status !== 0 || stderr) {
        console.error(stderr || stdout)
        return wraps(`<code><pre>${stderr || stdout}</pre></code>`)
      }
      const imgUrl = p.stdout.toString().trim()

      return wraps(`<img src="${imgUrl}" />`)
    }
  )
}

module.exports = imbedRender
