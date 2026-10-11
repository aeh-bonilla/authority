import path from "node:path";
import { pathToFileURL } from "node:url";
import fs from "node:fs";

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const relative = specifier.slice(2);
    const basePath = path.resolve(process.cwd(), relative);
    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      `${basePath}.js`,
      path.join(basePath, "index.ts"),
      path.join(basePath, "index.js"),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
  }

  // Also resolve relative imports without extensions like ./mock-data
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parent = context.parentURL ? new URL(context.parentURL).pathname : process.cwd();
    const parentDir = path.dirname(parent);
    const candidatePath = path.resolve(parentDir, specifier);
    const candidates = [
      candidatePath,
      `${candidatePath}.ts`,
      `${candidatePath}.tsx`,
      `${candidatePath}.js`,
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
  }

  return nextResolve(specifier, context);
}
