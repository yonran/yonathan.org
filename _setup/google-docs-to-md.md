Notes on converting google docs to markdown:

Save as html

Convert html to markdown https://domchristie.github.io/to-markdown/

Replace a bunch of spans e.g. `<span class="c5">([^<]*)</span>`.

Replace links:

    node
    const fs = require("fs");
    let buf = fs.readFileSync("/tmp/prop13.md")
    let s = buf.toString("utf-8")
    let t = s.replace(/\(https:\/\/www.google.com\/url\?q=([^)]*)\)/g, (match,p1) => "(" + unescape(p1) + ")")
    fs.writeFileSync("/tmp/13b.md", t)
