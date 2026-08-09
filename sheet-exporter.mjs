#!/usr/bin/env node

import path from "path";
import { renderSheetToHtml } from "./render_sheet.mjs";

function printUsage() {
  console.log(
    "Usage: sheet-exporter --sheet <path.{json|yaml|yml}> --backs-dir <dir> --images-dir <dir> --out-dir <dir> [--template cards_3x3_a4|cards_2x2_a4] [--output-name name]"
  );
}

function parseArgs(argv) {
  const args = {
    template: "cards_3x3_a4"
  };
  const readValue = (flag, currentIndex) => {
    const value = argv[currentIndex + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}`);
    }
    return value;
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }

    if (arg === "--sheet") {
      args.sheet = readValue(arg, i);
      i += 1;
      continue;
    }

    if (arg === "--backs-dir") {
      args.backsDir = readValue(arg, i);
      i += 1;
      continue;
    }

    if (arg === "--images-dir") {
      args.imagesDir = readValue(arg, i);
      i += 1;
      continue;
    }

    if (arg === "--out-dir") {
      args.outDir = readValue(arg, i);
      i += 1;
      continue;
    }

    if (arg === "--template") {
      args.template = readValue(arg, i);
      i += 1;
      continue;
    }

    if (arg === "--output-name") {
      args.outputName = readValue(arg, i);
      i += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

try {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  if (!args.sheet || !args.backsDir || !args.imagesDir || !args.outDir) {
    printUsage();
    throw new Error("Missing required arguments.");
  }

  const sheetPath = path.resolve(args.sheet);
  const backsDir = path.resolve(args.backsDir);
  const imagesDir = path.resolve(args.imagesDir);
  const outDir = path.resolve(args.outDir);
  const outputName = args.outputName ?? path.basename(sheetPath, path.extname(sheetPath));
  const outputHtmlPath = path.join(outDir, `${outputName}.html`);

  renderSheetToHtml({
    template: args.template,
    sheetPath,
    backsDir,
    imagesDir,
    outputHtmlPath
  });

  console.log(`Rendered ${outputHtmlPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
