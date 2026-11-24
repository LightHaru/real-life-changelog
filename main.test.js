import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const MAIN = fileURLToPath(new URL("./main.ts", import.meta.url));

function runMain() {
  const dir = mkdtempSync(join(tmpdir(), "entry-"));
  execFileSync(process.execPath, [MAIN, dir]);
  return readFileSync(join(dir, "entry.txt"));
}

test("writes a valid one-line patch note, identically in two directories", () => {
  const a = runMain();
  const b = runMain();

  assert.deepEqual(a, b, "same output in two different directories");

  const text = a.toString("utf8");
  assert.ok(Buffer.from(text, "utf8").equals(a), "entry.txt is valid UTF-8");

  assert.ok(!text.includes("\n") && !text.includes("\r"), "entry is exactly one line");
  assert.ok(text.length >= 1 && text.length <= 160, `length ${text.length} is within 1-160`);
  assert.ok(text.trim().length > 0, "entry is not only whitespace");

  assert.match(text, /^v\d+\.\d+\.\d+:/, "opens with a version number");
  assert.match(
    text,
    /^v\d+\.\d+\.\d+: (fixed|resolved|patched|addressed) /,
    "names a shipped fix in release-note register",
  );
  assert.match(text, /\.$/, "ends like a changelog line");
});
