"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.resolve(__dirname, "..", "index.html"), "utf8");

test("shows the freelance experience above DVL in both experience views", () => {
  assert.equal((html.match(/>Freelance</g) || []).length, 2);
  assert.match(html, /id="experience"[\s\S]*?>Freelance<[\s\S]*?May 2026 – Present[\s\S]*?Independent Product Engineer[\s\S]*?SkoolOS, Solvem Grocery, and Mandir Yatra[\s\S]*?DVL Systems · Zebpay/);
  assert.match(html, /data-screen="experience"[\s\S]*?>Freelance<[\s\S]*?SkoolOS · Solvem Grocery · Mandir Yatra[\s\S]*?DVL Systems · Zebpay/);
});
