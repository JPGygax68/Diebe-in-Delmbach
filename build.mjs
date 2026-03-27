import fs from 'fs';
import nunjucks from 'nunjucks';
import * as sass from 'sass';

// Configure Nunjucks to use the 'templates' directory
nunjucks.configure('templates', { autoescape: true });

// Read command-line arguments
const [,, sheet] = process.argv;

if (!sheet) {
  console.error("Usage: node build.js <sheet>");
  process.exit(1);
}

// Compile SASS to CSS
const result = sass.compile('templates/style.scss');
fs.writeFileSync('dist/style.css', result.css, 'utf8');

// Load JSON data
const inputJson = `data/${sheet}.json`;
const data = JSON.parse(fs.readFileSync(inputJson, "utf8"));

// Render the template
const html = nunjucks.render("cards_3x3_a4.njk", data);

// Write output to "dist" directory, using the input JSON filename with .html extension
const outputHtml = `dist/${sheet}.html`;
fs.writeFileSync(outputHtml, html, "utf8");

console.log(`Rendered ${outputHtml}`);