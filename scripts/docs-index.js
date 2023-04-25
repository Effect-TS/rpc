/* eslint-disable */
const Fs = require("node:fs")
const Path = require("node:path")

function packages() {
  return Fs.readdirSync("packages").filter((_) =>
    Fs.existsSync(Path.join("packages", _, "docs/modules")),
  )
}

function generateIndex(pkg) {
  const name = pkg === "rpc" ? "@effect/rpc" : `@effect/rpc-${pkg}`
  const docs = Path.join("docs/modules", name)
  const content = `
---
title: ${name}
has_children: true
permalink: /docs/modules/${name}
nav_order: 3
---
`

  Fs.writeFileSync(`${docs}/index.md`, content)
}

packages().forEach(generateIndex)

Fs.writeFileSync(
  `docs/modules/index.md`,
  `
---
title: Modules
has_children: true
permalink: /docs/modules
nav_order: 2
---
`,
)
