"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

test("defines Mandir Yaatra with local official Play assets", () => {
  assert.match(appJs, /id: "mandir-yatra", name: "Mandir Yaatra"/);
  assert.match(appJs, /icon: "assets\/mandir-yatra\/icon\.png"/);
  assert.match(appJs, /role: "Full-stack Developer · Independent"/);
  assert.match(appJs, /stack: \["TypeScript", "Next\.js", "Supabase", "Prisma", "Razorpay"\]/);
  assert.match(appJs, /metrics: \[\["100\+", "daily visits"\], \["6", "role-based workflows"\], \["2", "payment gateways"\]\]/);
  assert.doesNotMatch(appJs, /screenshots: \["home\.png", "temples\.png", "reels\.png"\]/);
  assert.match(appJs, /function glyphHTML\(app\)/);

  for (const file of ["icon.png"])
    assert.equal(fs.existsSync(path.join(root, "assets", "mandir-yatra", file)), true, `missing ${file}`);
});
