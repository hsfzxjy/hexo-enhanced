function autoDigest(data) {
  if (data.layout !== "post") return
  const indexOfBreakpoint = data.content.indexOf('<a id="more"></a>')
  data.digest =
    indexOfBreakpoint < 0
      ? data.content
      : data.content.substring(0, indexOfBreakpoint)
  data.readmore = indexOfBreakpoint >= 0
}

module.exports = autoDigest
