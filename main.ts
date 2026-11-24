import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ENTRY =
  "v6.1.1: fixed a latency bug where the perfect comeback arrived in the shower, hours after the argument ended. Wit now ships mid-argument.";

const outputDir = resolve(process.argv[2] ?? "/output");

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, { encoding: "utf8" });
