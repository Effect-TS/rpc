/* eslint-disable */
const Fs = require("node:fs")
const Path = require("node:path")

function packages() {
  return Fs.readdirSync("packages").filter((_) =>
    Fs.existsSync(Path.join("packages", _, "docs/modules")),
  )
}

function pkgName(pkg) {
  return pkg === "rpc" ? "@effect/rpc" : `@effect/rpc-${pkg}`
}

function copyFiles(pkg) {
  const name = pkgName(pkg)
  const docs = Path.join("packages", pkg, "docs/modules")
  const dest = Path.join("docs/modules", name)
  const files = Fs.readdirSync(docs)

  Fs.mkdirSync(dest, { recursive: true })

  for (const file of files) {
    const content = Fs.readFileSync(Path.join(docs, file), "utf8").replace(
      /^parent: Modules$/m,
      `parent: ${name}`,
    )
    Fs.writeFileSync(Path.join(dest, file), content)
  }
}

function generateIndex(pkg, order) {
  const name = pkgName(pkg)
  const docs = Path.join("docs/modules", name)
  const content = `---
title: ${name}
has_children: true
permalink: /docs/modules/${name}
nav_order: ${order}
---
`

  Fs.writeFileSync(`${docs}/index.md`, content)
}

packages().forEach((pkg, i) => {
  copyFiles(pkg)
  generateIndex(pkg, i + 2)
})
