/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const roots = [".next", path.join("node_modules", ".cache"), ".turbo"];

for (const rel of roots) {
  const p = path.resolve(__dirname, "..", rel);
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`removed ${rel}`);
    }
  } catch (e) {
    console.warn(`failed to remove ${rel}: ${e?.message ?? e}`);
  }
}

