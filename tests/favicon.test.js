"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("uses a local green S favicon", () => {
  assert.match(html, /<link rel="icon" href="assets\/favicon\.svg" type="image\/svg\+xml">/);

  const favicon = fs.readFileSync(path.join(root, "assets", "favicon.svg"), "utf8");
  assert.match(favicon, /fill="#3ddc84"/);
  assert.match(favicon, />S<\/text>/);
});
