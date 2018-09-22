"use strict"
const d3 = require("d3")
const fs = require("fs")
const jsdom = require("jsdom")

const { JSDOM } = jsdom
// const baseyearvalue = require("../_js-scripts/baseyearvalue.js")

const dom = new JSDOM(`<!DOCTYPE html>`, {runScripts: "outside-only"})
const window = dom.window
window.d3 = d3
const document = window.document
const script = fs.readFileSync("../_js-scripts/baseyearvalue.js", {encoding: "UTF-8"})
window.eval(script)
const svgElement = document.querySelector("svg")
// hack to fix lowercasing in jsdom
const svgText = svgElement.outerHTML
    .replace(/femergenode/g, "feMergeNode")
    .replace(/femerge/g, "feMerge")
    .replace(/fegaussianblur/g, "feGaussianBlur")
    .replace(/feblend/g, "feBlend")
    .replace(/fecomposite/g, "feComposite")
    .replace(/feflood/g, "feFlood")
    .replace(/feoffset/g, "feOffset")
fs.writeFileSync("../_site/images/baseyearvalue.svg", svgText, {encoding: "UTF-8"})