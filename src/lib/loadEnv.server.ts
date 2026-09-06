// Server-only helper: makes sure variables from a root `.env` file end up on
// `process.env`, without adding a `dotenv` dependency.
//
// Vite's dev server (and Nitro in dev mode) already load `.env` automatically,
// but that auto-loading does NOT happen for a production build/start or for
// `vite preview`. This loader fills that gap. It never overrides a variable
// that's already set (e.g. one provided by the hosting platform), and it's a
// no-op if no `.env` file exists.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let loaded = false;

function parseEnvFile(contents: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    // Strip a single layer of matching quotes, e.g. KEY="value with spaces"
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) result[key] = value;
  }

  return result;
}

/** Loads `.env` from the project root into `process.env` (idempotent, safe to call often). */
export function ensureEnvLoaded(): void {
  if (loaded) return;
  loaded = true;

  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  try {
    const parsed = parseEnvFile(readFileSync(envPath, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.error("Failed to read .env file:", error);
  }
}
