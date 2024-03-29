hexo.config.imbedrender = Object.assign(
  {
    enable: false,
    bin: "",
    prefix: "@@",
  },
  hexo.config.imbedrender
)

hexo.extend.filter.register(
  "template_locals",
  require("./lib/filter/template_locals/lodash")
)

require("./lib/filter/before_post_render/hackHighlight")
hexo.extend.filter.register(
  "before_post_render",
  require("./lib/filter/before_post_render/mathjax")(hexo),
  11
)
hexo.extend.filter.register(
  "before_post_render",
  require("./lib/filter/before_post_render/graphviz"),
  9
)

hexo.extend.filter.register(
  "after_post_render",
  require("./lib/filter/after_post_render/typography"),
  11
)
hexo.extend.filter.register(
  "after_post_render",
  require("./lib/filter/after_post_render/hl_label"),
  11
)
hexo.extend.filter.register(
  "after_post_render",
  require("./lib/filter/after_post_render/inline_notes"),
  11
)
hexo.extend.filter.register(
  "after_post_render",
  require("./lib/filter/after_post_render/auto-digest"),
  12
)
hexo.extend.filter.register(
  "after_post_render",
  require("./lib/filter/after_post_render/encryption")(hexo),
  13
)

hexo.extend.helper.register(
  "tagcloud_ex",
  require("./lib/helper/tagcloud_ex")
)
