import fs from "fs";
import path from "path";
import nunjucks from "nunjucks";
import { marked } from "marked";
import { parse as parseYaml } from "yaml";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

function readSheet(sheetPath) {
  const ext = path.extname(sheetPath).toLowerCase();
  const content = fs.readFileSync(sheetPath, "utf8");

  if (ext === ".json") {
    return JSON.parse(content);
  }

  if (ext === ".yaml" || ext === ".yml") {
    return parseYaml(content);
  }

  throw new Error(`Unsupported sheet format "${ext}". Use .json, .yaml, or .yml.`);
}

function resolveStylesheetHref(template) {
  const styleByTemplate = {
    cards_3x3_a4: "dist/style.css",
    cards_2x2_a4: "dist/style_2x2_a4.css"
  };

  const relativePath = styleByTemplate[template];
  if (!relativePath) {
    return undefined;
  }

  const absolutePath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return undefined;
  }

  return pathToFileURL(absolutePath).href;
}

export function renderSheetToHtml({
  template,
  sheetPath,
  backsDir,
  imagesDir,
  outputHtmlPath,
  stylesheetHref
}) {
  const env = nunjucks.configure(path.join(ROOT_DIR, "templates"), { autoescape: true });

  env.addFilter("readmd", function readMarkdown(filename) {
    const markdownPath = path.join(backsDir, filename);
    const markdown = fs.readFileSync(markdownPath, "utf8");
    return marked(markdown);
  });

  const sheet = readSheet(sheetPath);
  if (!sheet || !Array.isArray(sheet.cards)) {
    throw new Error(`Sheet "${sheetPath}" must contain a "cards" array.`);
  }

  const renderedSheet = {
    ...sheet,
    cards: sheet.cards.map((card) => {
      if (!card.image) {
        return card;
      }
      const imagePath = path.join(imagesDir, card.image);
      return {
        ...card,
        image_href: pathToFileURL(imagePath).href
      };
    })
  };

  const html = nunjucks.render(`${template}.njk`, {
    sheet: renderedSheet,
    stylesheet_href: stylesheetHref ?? resolveStylesheetHref(template)
  });

  fs.mkdirSync(path.dirname(outputHtmlPath), { recursive: true });
  fs.writeFileSync(outputHtmlPath, html, "utf8");
}
