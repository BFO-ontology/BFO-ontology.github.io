var GROUP_NAMES = Object.keys(CONF);

var DATA = [];
var activeSectionFilter = null;
var debounceTimer;

// === S-expression helpers ===

function nextWS(s, i) {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

function pastSingleQuote(s, i) {
  i++;
  while (i < s.length) {
    if (s[i] === '\\' && i + 1 < s.length) { i += 2; continue; }
    if (s[i] === "'") return i + 1;
    i++;
  }
  return s.length;
}

function pastDoubleQuote(s, i) {
  i++;
  while (i < s.length) {
    if (s[i] === '\\' && i + 1 < s.length) { i += 2; continue; }
    if (s[i] === '"') return i + 1;
    i++;
  }
  return s.length;
}

function quoteTextSingle(s, i) {
  i++;
  var start = i;
  while (i < s.length) {
    if (s[i] === '\\' && i + 1 < s.length) { i += 2; continue; }
    if (s[i] === "'") return [s.substring(start, i), i + 1];
    i++;
  }
  return [s.substring(start, i), i];
}

function quoteTextDouble(s, i) {
  i++;
  var start = i;
  while (i < s.length) {
    if (s[i] === '\\' && i + 1 < s.length) { i += 2; continue; }
    if (s[i] === '"') return [s.substring(start, i), i + 1];
    i++;
  }
  return [s.substring(start, i), i];
}

function pastSexpr(s, i) {
  var depth = 1;
  i++;
  while (i < s.length && depth > 0) {
    if (s[i] === "'") {
      i = pastSingleQuote(s, i);
    } else if (s[i] === '"') {
      i = pastDoubleQuote(s, i);
    } else if (s[i] === '(') {
      depth++;
      i++;
    } else if (s[i] === ')') {
      depth--;
      if (depth === 0) { i++; break; }
      i++;
    } else { i++; }
  }
  return i;
}

// === Parser ===

function parseCLFile(content, section) {
  var idx = content.indexOf('(cl:ttl');
  if (idx < 0) return [];
  var end = pastSexpr(content, idx);

  var uriPos = content.indexOf('"', idx + '(cl:ttl'.length);
  var uriEnd = uriPos >= 0 ? content.indexOf('"', uriPos + 1) : -1;
  var afterLabel;
  if (uriEnd >= 0) {
    afterLabel = uriEnd + 1;
  } else {
    var p = idx + '(cl:ttl'.length;
    p = nextWS(content, p);
    var spaceIdx = p;
    while (spaceIdx < end && !/\s/.test(content[spaceIdx])) spaceIdx++;
    afterLabel = spaceIdx;
  }

  var ttlBody = content.substring(afterLabel, end - 1);
  var parseBody = ttlBody;
  var textPos = nextWS(ttlBody, 0);
  if (ttlBody.startsWith('(cl:text', textPos)) {
    var textEnd = pastSexpr(ttlBody, textPos);
    parseBody = ttlBody.substring(textPos + '(cl:text'.length, textEnd - 1);
  }

  return parseComments(parseBody, section);
}

function parseComments(inner, section) {
  var result = [];
  var pos = 0;

  while (pos < inner.length) {
    pos = nextWS(inner, pos);
    if (pos >= inner.length) break;

    if (inner.startsWith('(cl:outdiscourse', pos) ||
        inner.startsWith('(cl:text', pos) ||
        inner.startsWith('(cl:ttl', pos) ||
        inner.startsWith('(cl:label', pos)) {
      pos = pastSexpr(inner, pos);
      continue;
    }

    if (!inner.startsWith('(cl:comment', pos)) {
      if (inner[pos] === '(') {
        pos = pastSexpr(inner, pos);
      } else {
        pos++;
      }
      continue;
    }

    var p = pos + '(cl:comment'.length;
    p = nextWS(inner, p);

    var commentText = null;
    var afterQuote;

    if (p < inner.length) {
      if (inner[p] === "'") {
        var qt = quoteTextSingle(inner, p);
        commentText = qt[0];
        afterQuote = qt[1];
      } else if (inner[p] === '"') {
        var qt = quoteTextDouble(inner, p);
        commentText = qt[0];
        afterQuote = qt[1];
      }
    }

    if (!commentText) { pos++; continue; }

    p = nextWS(inner, afterQuote);
    if (p >= inner.length || inner[p] !== '(') { pos = p; continue; }

    var formulaEnd = pastSexpr(inner, p);
    var formula = inner.substring(p, formulaEnd).trim().replace(/\t/g, ' ');
    var idMatch = commentText.match(/\[([^\]]+)\]\s*$/);
    var identifier = idMatch ? idMatch[1] : null;

    result.push({ section: section, comment: commentText.replace(/\\'/g, "'").replace(/\\"/g, '"'), formula: formula, identifier: identifier });
    pos = formulaEnd;
  }

  return result;
}

// === Extraction ===

var LAC = new Set(['and', 'or', 'not', '=', 'if', 'iff', 'forall', 'exists']);

function extract(text) {
  var allClasses = [];
  var allRelations = [];

  function nextPos(s, i) { while (i < s.length && /\s/.test(s[i])) i++; return i; }

  function parse(s, i) {
    i = nextPos(s, i);
    if (i >= s.length) return { node: null, end: i };
    if (s[i] === '(') {
      i++;
      var children = [];
      while (true) { i = nextPos(s, i); if (i >= s.length || s[i] === ')') break; var r = parse(s, i); children.push(r.node); i = r.end; }
      i = nextPos(s, i + 1);
      return { node: children, end: i };
    }
    var start = i;
    while (i < s.length && !/\s|\(|\)/.test(s[i])) i++;
    return { node: s.substring(start, i), end: i };
  }

  function ec(v, bv) { if (typeof v === 'string' && !bv.has(v)) allClasses.push(v); }

  function walk(t, bv) {
    if (!Array.isArray(t)) return;
    var head = t[0];
    var isQuant = head === 'forall' || head === 'exists';
    var isUniversal = head === 'universal';
    var isParticular = head === 'particular';
    var isIns = head === 'instance-of';

    if (isQuant) {
      var newBv = new Set(bv);
      var varList = t[1];
      if (Array.isArray(varList)) { for (var j = 0; j < varList.length; j++) newBv.add(varList[j]); }
      else if (typeof varList === 'string') { newBv.add(varList); }
      for (var i = 2; i < t.length; i++) { if (Array.isArray(t[i])) walk(t[i], newBv); }
      return;
    }

    if (isUniversal) {
      allRelations.push('universal');
      for (var ui = 1; ui < t.length; ui++) {
        if (typeof t[ui] === 'string' && !bv.has(t[ui])) { allClasses.push(t[ui]); }
        else if (Array.isArray(t[ui])) { walk(t[ui], bv); }
      }
      return;
    }

    if (isParticular) {
      for (var pi = 0; pi < t.length; pi++) { if (Array.isArray(t[pi])) walk(t[pi], bv); }
      return;
    }

    if (isIns && t.length >= 3) {
      var className = t[2];
      if (className && typeof className === 'string') ec(className, bv);
      for (var i = 3; i < t.length; i++) { if (Array.isArray(t[i])) walk(t[i], bv); }
      return;
    }

    if (typeof head === 'string' && !LAC.has(head)) { allRelations.push(head); }

    for (var i = 0; i < t.length; i++) { if (Array.isArray(t[i])) walk(t[i], bv); }
  }

  var r = parse(text, 0);
  if (r.node) walk(r.node, new Set());

  var seen = {}, clsOut = [];
  allClasses.forEach(function(c) { if (!seen[c]) { seen[c] = true; clsOut.push(c); } });
  var seen2 = {}, relOut = [];
  allRelations.forEach(function(r) { if (!seen2[r]) { seen2[r] = true; relOut.push(r); } });

  return { classes: clsOut, relations: relOut };
}

// === Load ===

function showErr(msg) {
  var el = document.createElement('div');
  el.className = 'error-msg';
  el.textContent = msg;
  document.getElementById('results').parentNode.insertBefore(el, document.getElementById('results'));
}

async function loadAll() {
  var groupsEl = document.getElementById('group-filters');
  groupsEl.innerHTML = '';

  for (var ci = 0; ci < GROUP_NAMES.length; ci++) {
    var gk = GROUP_NAMES[ci];
    var lbl = document.createElement('label');
    lbl.className = 'group-filter';
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = (ci === 0);
    cb.dataset.group = gk;
    lbl.appendChild(cb);
    var groupNameSpan = document.createTextNode(' ' + gk);
    lbl.appendChild(groupNameSpan);
    var countSpan = document.createElement('span');
    countSpan.className = 'group-section-count';
    var count = CONF[gk].sections.length;
    countSpan.textContent = '(' + count + ' section' + (count === 1 ? '' : 's') + ')';
    lbl.appendChild(countSpan);
    groupsEl.appendChild(lbl);
  }

  var errCount = 0;
  var idMap = {};
  for (var fi2 = 0; fi2 < GROUP_NAMES.length; fi2++) {
    var groupKey2 = GROUP_NAMES[fi2];
    for (var si = 0; si < CONF[groupKey2].sections.length; si++) {
      var section = CONF[groupKey2].sections[si];
      try {
        var url = CONF[groupKey2].base + section;
        console.log('Fetching:', url);
        var resp = await fetch(url);
        console.log('Received:', url, 'status:', resp.status);
        if (!resp.ok) throw 'HTTP ' + resp.status;
        var text = await resp.text();
        console.log('Body length:', url, text.length);
        if (!text.trim()) continue;

        var formulas = parseCLFile(text, section.replace('.cl', ''));
        console.log('Parsed formulas:', url, formulas.length);

        for (var fi = 0; fi < formulas.length; fi++) {
          var extracted = extract(formulas[fi].formula);
          var sectionName = section.replace('.cl', '');
          var identifier = formulas[fi].identifier || formulas[fi].comment;
          var entry2 = idMap[identifier];
          if (entry2) {
            if (entry2.sections.indexOf(sectionName) === -1) entry2.sections.push(sectionName);
            for (var cci = 0; cci < extracted.classes.length; cci++) { if (entry2.classes.indexOf(extracted.classes[cci]) === -1) entry2.classes.push(extracted.classes[cci]); }
            for (var tri = 0; tri < extracted.relations.length; tri++) { if (entry2.relations.indexOf(extracted.relations[tri]) === -1) entry2.relations.push(extracted.relations[tri]); }
          } else {
            var entry = { comment: formulas[fi].comment.replace(/\\'/g, "'").replace(/\\"/g, '"'), formula: formulas[fi].formula, identifier: identifier, formulaId: formulas[fi].identifier || null, group: groupKey2, file: sectionName + '.json', sections: [sectionName], classes: extracted.classes, relations: extracted.relations };
            idMap[identifier] = entry;
          }
        }
      } catch (eerr) {
        errCount++;
        console.error('Failed:', section, eerr);
        showErr('Failed: ' + section + ' - ' + eerr);
      }
    }
  }

  DATA = Object.keys(idMap).map(function(k) { return idMap[k]; });
  var newData = [];
  for (var gi = 0; gi < GROUP_NAMES.length; gi++) {
    var fg = GROUP_NAMES[gi];
    var groupItems = [];
    for (var di = DATA.length - 1; di >= 0; di--) { if (DATA[di].group === fg) { groupItems.push(DATA.splice(di, 1)[0]); } }
    groupItems.sort(function(a, b) { return (a.formula || '').length - (b.formula || '').length; });
    for (var j = 0; j < groupItems.length; j++) { newData.push(groupItems[j]); }
  }
  DATA = newData;

  refreshResults();
}

// === Render ===

function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  return escapeHtml(text).replace(new RegExp('(' + escapeRegex(query) + ')', 'gi'), '<span class="highlight">$1</span>');
}

function escapeAttr(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&#34;'); }

function getActiveGroups() {
  var out = [];
  var boxes = document.querySelectorAll('.group-filter input:checked');
  for (var i = 0; i < boxes.length; i++) out.push(boxes[i].dataset.group);
  return out;
}

function filterFormulas(query, activeGroups) {
  var filtered = DATA;
  if (activeGroups.length > 0) {
    filtered = DATA.filter(function(item) { return activeGroups.indexOf(item.group) !== -1; });
  } else {
    filtered = [];
  }
  if (activeSectionFilter) {
    filtered = filtered.filter(function(item) { return item.sections && item.sections.indexOf(activeSectionFilter) !== -1; });
  }
  if (!query) return filtered;
  var words = query.trim().toLowerCase().split(/\s+/).filter(function(w) { return w.length > 0; });
  return filtered.filter(function(item) {
    var searchable = [item.comment, item.formulaId].concat(item.classes).concat(item.relations).concat(item.sections || []).join(' ').toLowerCase();
    for (var w = 0; w < words.length; w++) { if (searchable.indexOf(words[w]) === -1) return false; }
    return true;
  });
}

function renderResults(results, query) {
  var statsEl = document.getElementById('stats');
  var pillHtml = '';
  if (activeSectionFilter) {
    pillHtml = '<span class="section-pill">' + escapeHtml(activeSectionFilter) + ' <span class="section-pill-clear" onclick="clearSectionFilter()">×</span></span> ';
  }
  statsEl.innerHTML = pillHtml + results.length + ' of ' + DATA.length + ' formulas';

  if (results.length === 0) {
    document.getElementById('results').innerHTML = '<div class="no-results">No formulas match your search.</div>';
    return;
  }
  var html = '';
  for (var i = 0; i < results.length; i++) {
    var item = results[i];
    html += '<div class="card"><div class="card-header"><span class="formula-id">' + highlightText(item.formulaId || '', query) + '</span>';
    if (item.sections) {
      for (var sti = 0; sti < item.sections.length; sti++) {
        html += '<span class="file-tag' + (item.sections.length <= 1 ? ' section-clickable' : '') + '" onclick="clickSectionTag(\'' + escapeAttr(item.sections[sti]) + '\')">' + highlightText(item.sections[sti], query) + '</span>';
      }
    } else {
      html += '<span class="file-tag">' + highlightText(item.file ? item.file.replace(/\.[^.]+$/, '') : '', query) + '</span>';
    }
    html += '<span class="group-tag">' + highlightText(item.group, query) + '</span></div>';
    html += '<div class="comment">' + highlightText(item.comment, query) + '</div>';

    if (item.formula) {
      var display = escapeHtml(item.formula);
      if (query) {
        var qWords = query.trim().toLowerCase().split(/\s+/).filter(function(w) { return w.length > 0; });
        for (var wi = 0; wi < qWords.length; wi++) { display = display.replace(new RegExp('(' + escapeRegex(qWords[wi]) + ')', 'gi'), '<mark class="highlight">$1</mark>'); }
      }
      html += '<div class="formula-text">' + display + '</div>';
    }

    var issuesHtml = renderInlineIssues(item);
    if (issuesHtml) { html += '<div style="margin-top:-0.5rem;">' + issuesHtml + '</div>'; }

    if (item.classes.length > 0 || item.relations.length > 0) {
      html += '<div class="badge-wrap">';
      if (item.classes.length > 0) { for (var ci = 0; ci < item.classes.length; ci++) { html += '<span class="badge badge-class" onclick="clickBadge(this)" data-bt="' + escapeAttr(item.classes[ci]) + '">' + highlightText(item.classes[ci], query) + '</span>'; } }
      if (item.relations.length > 0) { for (var ri = 0; ri < item.relations.length; ri++) { html += '<span class="badge badge-rel" onclick="clickBadge(this)" data-bt="' + escapeAttr(item.relations[ri]) + '">' + highlightText(item.relations[ri], query) + '</span>'; } }
      html += '</div>';
    }
    html += '</div>';
  }
  document.getElementById('results').innerHTML = html;
}

function clickBadge(el) {
  var text = el.getAttribute('data-bt');
  if (text) { activeSectionFilter = null; document.getElementById('search-input').value = text; showClearBtn(); refreshResults(); window.scrollTo(0, 0); }
}

function clickSectionTag(sectionName) {
  document.getElementById('search-input').value = '';
  showClearBtn();
  activeSectionFilter = sectionName;
  clearDebounceTimer();
  refreshResults();
  window.scrollTo(0, 0);
}

function clearSectionFilter() {
  activeSectionFilter = null;
  clearDebounceTimer();
  refreshResults();
}

function clearDebounceTimer() { clearTimeout(debounceTimer); }

function refreshResults() {
  var query = document.getElementById('search-input').value.trim();
  var groups = getActiveGroups();
  renderResults(filterFormulas(query, groups), query);
}

document.getElementById('search-input').addEventListener('input', function() { showClearBtn(); clearDebounceTimer(); debounceTimer = setTimeout(refreshResults, 150); });

function showClearBtn() {
  var btn = document.getElementById('search-clear');
  btn.style.display = document.getElementById('search-input').value.trim() ? 'block' : 'none';
}

document.getElementById('search-clear').addEventListener('click', function() {
  document.getElementById('search-input').value = '';
  showClearBtn();
  refreshResults();
});

document.getElementById('results').addEventListener('click', function(e) {
  if (e.target.classList.contains('badge')) { clickBadge(e.target); }
});

// Batch highlight: mouseover a badge or file-tag -> bold it
var _batchTarget = null;
function doBatchHighlight(e) {
  var t = e.target;
  if (!t.classList.contains('badge') && !t.classList.contains('file-tag')) return;
  if (_batchTarget === t) return;
  unsetBatchHighlight();
  _batchTarget = t;
  t.style.fontWeight = '700';
}
function unsetBatchHighlight(e) {
  var t = _batchTarget;
  _batchTarget = null;
  if (t && (t.classList.contains('badge') || t.classList.contains('file-tag'))) {
    t.style.fontWeight = '';
  }
}

document.getElementById('results').addEventListener('mouseover', doBatchHighlight);
document.getElementById('results').addEventListener('mouseout', unsetBatchHighlight);

document.getElementById('group-filters').addEventListener('change', function() {
  activeSectionFilter = null;
  clearDebounceTimer();
  debounceTimer = setTimeout(refreshResults, 50);
});

// === GitHub Issues ===

var ISSUE_MAP = {};

function extractPrefixes(text) {
  var matches = text.toLowerCase().match(/\b[a-z]{3}-\d/g);
  if (!matches) return [];
  var out = [];
  var dash;
  for (var i = 0; i < matches.length; i++) {
    dash = matches[i].indexOf('-');
    out.push(matches[i].substring(0, dash));
  }
  return out;
}

function loadIssues() {
  fetch('https://api.github.com/repos/BFO-ontology/BFO-2020/issues?state=all&per_page=100')
    .then(function(r) { return r.json(); })
    .then(function(issues) {
      if (!Array.isArray(issues)) { ISSUE_MAP = {}; refreshResults(); return; }
      ISSUE_MAP = {};
      for (var ii = 0; ii < issues.length; ii++) {
        var issue = issues[ii];
        var prefixes = extractPrefixes(issue.title);
        for (var c = 0; c < prefixes.length; c++) {
          if (!ISSUE_MAP[prefixes[c]]) ISSUE_MAP[prefixes[c]] = [];
          ISSUE_MAP[prefixes[c]].push(issue);
        }
      }
      refreshResults();
    })
    .catch(function(err) { console.error('Issues load failed:', err); });
}

function renderInlineIssues(formulaItem) {
  var identifier = formulaItem.identifier;
  if (!identifier) return '';
  var prefix = identifier.toLowerCase().replace(/-\d+$/, '');
  var issues = ISSUE_MAP[prefix];
  if (!issues || issues.length === 0) return '';
  var html = '';
  for (var i = 0; i < issues.length; i++) {
    var issue = issues[i];
    html += '<div class="issue-inline"><span class="issue-num">#' + escapeHtml(String(issue.number)) + '</span> ';
    html += '<a class="issue-link" href="' + escapeHtml(issue.html_url) + '" target="_blank">' + escapeHtml(issue.title) + '</a>';
    html += ' <span class="issue-state ' + issue.state + '">' + escapeHtml(issue.state) + '</span></div>';
  }
  return html;
}

// Start loading issues and formulas when page loads
loadAll();
loadIssues();
