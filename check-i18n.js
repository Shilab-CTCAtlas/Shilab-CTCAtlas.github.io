const fs = require('fs');

const pages = ['index.html', 'biology.html', 'data.html', 'gallery.html', 'publications.html', 'lab.html'];
const source = fs.readFileSync('script.js', 'utf8');
const translated = new Set();
const keyPattern = /'((?:\\.|[^'\\])*)'\s*:/g;
let keyMatch;

while ((keyMatch = keyPattern.exec(source))) {
  translated.add(keyMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
}

const intentionalEnglish = [
  /^(CTC|Atlas|GitHub|EN|BALF|BLD|URN|PLF|ASC|DOI|PubMed|scDNA-seq|Low-pass WGS|Shi Lab)$/,
  /^(HRA\d+|\d{4}|\d+|\d+ · \d+|©)$/,
  /^Single-Cell Sequencing-Guided Annotation/,
  /^Yichun Zhao, Ruoran Qiu, Zhuo Wang/,
  /^Advanced Science/,
  /^(CTC · 001|Shi Lab · CTC Atlas)$/,
  /^(Matrix Market|H5AD|Seurat)/
];

let missingCount = 0;
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<([a-z][\w-]*)\b[^>]*\btranslate=["']no["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');
  const texts = [...html.matchAll(/>([^<>]+)</g)]
    .map((match) => match[1].replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const missing = [...new Set(texts)].filter((text) => {
    if (!/[A-Za-z]/.test(text) || translated.has(text)) return false;
    return !intentionalEnglish.some((pattern) => pattern.test(text));
  });
  if (missing.length) {
    missingCount += missing.length;
    console.log(`\n${page}`);
    missing.forEach((text) => console.log(`  - ${text}`));
  }
}

if (!missingCount) console.log('All visible translatable strings are covered.');
process.exitCode = missingCount ? 1 : 0;
