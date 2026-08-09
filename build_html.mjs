import path from "path";
import { renderSheetToHtml } from "./render_sheet.mjs";

const [, , template, workspace, sheetArg] = process.argv;

if (!template || !workspace || !sheetArg) {
  console.error("Usage: node build_html.mjs <template> <workspace> <sheet-or-path>");
  process.exit(1);
}

const looksLikePath = sheetArg.includes("/") || sheetArg.includes("\\") || sheetArg.endsWith(".json") || sheetArg.endsWith(".yaml") || sheetArg.endsWith(".yml");
const sheetPath = looksLikePath ? sheetArg : path.join("data", workspace, `${sheetArg}.json`);
const outputName = path.basename(sheetPath, path.extname(sheetPath));
const outputHtml = path.join("tmp", `${outputName}.html`);

renderSheetToHtml({
  template,
  sheetPath,
  backsDir: path.join("data", workspace, "text"),
  imagesDir: path.join("data", workspace, "images"),
  outputHtmlPath: outputHtml
});

console.log(`Rendered ${outputHtml}`);
