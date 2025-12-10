// scripts/generateUserData.js
// This script reads users.csv and prints a userData object
// with 4 canonical categories we can paste into src/pages/users.jsx.

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'users.csv');
const csvText = fs.readFileSync(csvPath, 'utf8');

// --- Simple CSV parser that respects quotes ---
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote ("")
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// Split into lines and drop empty ones
const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

// Header row
const headerCols = parseCsvLine(lines.shift());
const idxName = headerCols.indexOf('name');
const idxUnderneath = headerCols.indexOf('underneath');
const idxUrl = headerCols.indexOf('url');

// Our 4 canonical buckets
const userData = {
  Ontologies: [],
  Institutions: [],
  'Groups and Projects': [],
  'Good Ontology Design (GoodOD)': [],
};

function canonicalCategory(raw) {
  if (!raw) return 'Groups and Projects';
  const v = raw.trim().toLowerCase();

  if (v.includes('ontology')) return 'Ontologies';
  if (v.includes('institution')) return 'Institutions';
  if (v.includes('goodod') || v.includes('good ontology design')) {
    return 'Good Ontology Design (GoodOD)';
  }
  // Everything else goes here:
  return 'Groups and Projects';
}

for (const line of lines) {
  const cols = parseCsvLine(line);
  const name = (cols[idxName] || '').trim();
  const underneath = (cols[idxUnderneath] || '').trim();
  const url = (cols[idxUrl] || '').trim();

  if (!name) continue;

  const category = canonicalCategory(underneath);

  userData[category].push({ name, url });
}

// Sort each category alphabetically by name
for (const cat of Object.keys(userData)) {
  userData[cat].sort((a, b) => a.name.localeCompare(b.name));
}

// Print out something we can paste directly into users.jsx
console.log('const userData = ' + JSON.stringify(userData, null, 2) + ';');

