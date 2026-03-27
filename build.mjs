import fs from 'fs';
import nunjucks from 'nunjucks';

// Configure Nunjucks to use the 'templates' directory
nunjucks.configure('templates', { autoescape: true });

// Read command-line arguments
const [,, inputJson, outputHtml] = process.argv;

if (!inputJson || !outputHtml) {
  console.error("Usage: node build.js <input.json> <output.html>");
  process.exit(1);
}

// Load JSON data
const data = JSON.parse(fs.readFileSync(inputJson, "utf8"));

// Render the template
const html = nunjucks.render("card.njk", data);

// Write output
fs.writeFileSync(outputHtml, html, "utf8");

console.log(`Rendered ${outputHtml}`);