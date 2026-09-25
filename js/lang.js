// Language helpers: answer checking, "only learnt words" filter, Viber chat parser.
(function (root) {
  "use strict";

  // Grammar words that every sentence may use (pronouns, articles, sein/haben, negation).
  const BASICS = (
    "ich du er sie es wir ihr mich dich ihn uns euch mir dir ihm ihnen " +
    "der die das den dem des ein eine einen einem einer eines kein keine keinen keinem keiner " +
    "mein meine meinen meinem meiner dein deine deinen deinem seine seinen seinem " +
    "ihre ihren ihrem unser unsere unseren euer eure " +
    "bin bist ist sind seid sein war habe hast hat haben habt hatte nicht ja nein"
  ).split(" ");

  const TYPES = ["verb", "noun", "adverb", "connector", "other"];

  const CONNECTORS = new Set(("und aber oder weil denn dass deshalb deswegen darum dann wenn als ob " +
    "sondern trotzdem also obwohl damit während bevor nachdem sobald außerdem jedoch sowie").split(" "));
  const PREPOSITIONS = new Set(("in im ins mit zu zum zur nach aus von vom bei beim für ohne gegen um " +
    "an am auf über unter vor hinter neben zwischen durch seit bis ab").split(" "));
  const ADVERBS_EN = new Set("morgen gestern oben unten selten gern gerne innen außen vorgestern übermorgen".split(" "));

  const RO_PRONOUNS = new Set(["eu", "tu", "el", "ea", "noi", "voi", "ei", "ele"]);

  // ---------- normalisation ----------
  function norm(s) {
    return String(s)
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[.,!?;:„“"”«»()\[\]¿¡…]/g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function fold(s) {
    // Remove diacritics (ä→a, ș→s, ă→a) and ß→ss for lenient comparison.
    return norm(s).replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ş/g, "s").replace(/ţ/g, "t");
  }

  function lev(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  // ---------- accepted answers ----------
  function splitAlternatives(text, isSentence) {
    const sep = isSentence ? /\|/ : /[\/|;,]/;
    return String(text).split(sep).map((s) => s.trim()).filter(Boolean);
  }

  // Extra variants we also accept (e.g. Romanian verbs without "a ", German nouns without article).
  function variants(answer, lang, isSentence) {
    const out = [answer];
    if (!isSentence) {
      const noParen = answer.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
      if (noParen && noParen !== answer) out.push(noParen);
      if (lang === "ro" && /^a\s+/i.test(noParen)) out.push(noParen.replace(/^a\s+/i, ""));
      if (lang === "de" && /^sich\s+/i.test(noParen)) out.push(noParen.replace(/^sich\s+/i, ""));
    }
    return out;
  }

  function stripRoPronoun(s) {
    const w = s.split(" ");
    return RO_PRONOUNS.has(w[0]) && w.length > 1 ? w.slice(1).join(" ") : s;
  }

  const ARTICLE_RE = /^(der|die|das)\s+/i;

  /**
   * Check an answer.
   * @returns {{ok:boolean, kind:'correct'|'accent'|'typo'|'article'|'wrong', best:string, note?:string}}
   */
  function checkAnswer(input, target, lang, isSentence) {
    const alts = splitAlternatives(target, isSentence);
    const best = alts[0] || target;
    const given = norm(input);
    if (!given) return { ok: false, kind: "wrong", best };

    const cands = [];
    alts.forEach((a) => variants(a, lang, isSentence).forEach((v) => cands.push({ v, orig: a })));

    const tries = (fn) => cands.find((c) => fn(c.v));
    const eq = (a, b) => a === b || (lang === "ro" && isSentence && stripRoPronoun(a) === stripRoPronoun(b));

    let hit = tries((v) => eq(norm(v), given));
    if (hit) return { ok: true, kind: "correct", best: hit.orig };

    // German noun: correct word but wrong article → wrong. Missing article → accepted with a reminder.
    if (lang === "de" && !isSentence) {
      for (const c of cands) {
        const m = c.v.match(ARTICLE_RE);
        if (!m) continue;
        const noun = norm(c.v.replace(ARTICLE_RE, ""));
        const g = given.replace(ARTICLE_RE, "");
        if (fold(g) === fold(noun)) {
          if (ARTICLE_RE.test(given)) return { ok: false, kind: "wrong", best: c.orig, note: `Wrong article: it is “${m[1].toLowerCase()}”.` };
          return { ok: true, kind: "article", best: c.orig, note: `Don't forget the article: ${c.orig}` };
        }
      }
    }

    hit = tries((v) => eq(fold(v), fold(given)));
    if (hit) return { ok: true, kind: "accent", best: hit.orig, note: "Watch the special letters (ä ö ü ß / ă â î ș ț)." };

    const maxTypo = isSentence ? (given.length >= 15 ? 2 : 1) : (given.length >= 5 ? 1 : 0);
    if (maxTypo) {
      hit = tries((v) => lev(fold(v), fold(given)) <= maxTypo);
      if (hit) return { ok: true, kind: "typo", best: hit.orig, note: "You have a typo." };
    }
    return { ok: false, kind: "wrong", best };
  }

  // ---------- "only words I have learnt" ----------
  const VERB_ENDINGS = ["", "e", "st", "t", "en", "est", "et", "n", "te", "test", "ten", "tet"];
  const NOUN_ENDINGS = ["", "n", "en", "e", "s", "es", "er", "nen"];

  function buildKnownSet(vocab) {
    const known = new Set(BASICS);
    for (const w of vocab) {
      for (const alt of splitAlternatives(w.de, false)) {
        const clean = norm(alt.replace(/\(.*?\)/g, ""));
        const words = clean.split(" ").filter(Boolean);
        words.forEach((x) => known.add(x));
        if (w.type === "verb") {
          const inf = words[words.length - 1];
          if (inf) {
            const stem = inf.replace(/(en|n)$/, "");
            VERB_ENDINGS.forEach((e) => known.add(stem + e));
          }
        } else if (w.type === "noun") {
          const noun = words[words.length - 1];
          if (noun) NOUN_ENDINGS.forEach((e) => known.add(noun + e));
        }
      }
      (w.forms || []).forEach((f) => known.add(norm(f)));
    }
    return known;
  }

  function unknownWords(sentence, known) {
    return norm(sentence).split(" ").filter((t) => t && !/^\d+$/.test(t) && !known.has(t));
  }

  // ---------- Viber chat parsing ----------
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; } else q = false;
        } else field += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += ch;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // From a Viber CSV export keep only the message text column.
  function csvToText(text) {
    const rows = parseCSV(text).filter((r) => r.some((c) => c.trim()));
    if (!rows.length) return "";
    const header = rows[0].map((h) => h.toLowerCase().trim());
    let col = header.findIndex((h) => /message|text|mesaj|nachricht|content/.test(h));
    let body = rows;
    if (col >= 0) body = rows.slice(1);
    else {
      // No header: use the column with the longest average content.
      const width = Math.max(...rows.map((r) => r.length));
      let bestLen = -1;
      for (let c = 0; c < width; c++) {
        const len = rows.reduce((s, r) => s + (r[c] || "").length, 0);
        if (len > bestLen) { bestLen = len; col = c; }
      }
    }
    return body.map((r) => r[col] || "").join("\n");
  }

  const DE_WORDS = new Set("ich du er wir ihr ist bin bist sind nicht und oder aber der die das den dem ein eine mit zu auf ist auch kein keine heute sehr gut".split(" "));
  const RO_WORDS = new Set("eu tu el ea noi voi este sunt nu și sau dar un o cu la pe în de mai foarte azi bine acum".split(" "));

  function langScore(s) {
    const t = norm(s);
    let de = 0, ro = 0;
    if (/[äöüß]/i.test(s)) de += 3;
    if (/[ăâîșşțţ]/i.test(s)) ro += 3;
    if (/^(der|die|das|sich)\s/i.test(s.trim())) de += 3;
    if (/^a\s+\S/i.test(s.trim())) ro += 3;
    t.split(" ").forEach((w) => { if (DE_WORDS.has(w)) de++; if (RO_WORDS.has(w)) ro++; });
    if (/\b(sch|ch|tz|ei|ie)\w*/i.test(t)) de += 0.5;
    if (/\w+(ul|ea|ele|ile|ează|esc)\b/i.test(t)) ro += 0.5;
    return de - ro;
  }

  const TIMESTAMP_RE = [
    /^\s*\[[^\]]*\]\s*/,                                                              // [25.09.26, 10:12]
    /^\s*\d{1,4}[./-]\d{1,2}[./-]\d{1,4},?\s+\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?\s*[-–]?\s*/i, // 25.09.2026 10:12 -
    /^\s*\d{1,2}:\d{2}(:\d{2})?\s*/,                                                   // 10:12
  ];

  function cleanLine(line) {
    let hadStamp = false;
    for (const re of TIMESTAMP_RE) {
      if (re.test(line)) { line = line.replace(re, ""); hadStamp = true; break; }
    }
    // After a timestamp comes the sender: "Teacher: der Hund - câinele"
    if (hadStamp) line = line.replace(/^[^:\d]{1,40}?:\s+/, "");
    return line.replace(/^\s*(\d+[.)]|[•*·▪►-])\s+/, "").trim(); // list markers
  }

  function classify(de, ro) {
    const words = de.split(/\s+/).filter(Boolean);
    const lower = de.toLowerCase();
    const bare = lower.replace(/^sich\s+/, "");
    if (words.length >= 4 || (words.length >= 2 && /[.!?]$/.test(de))) return "sentence";
    if (/^(der|die|das)\s/i.test(de)) return "noun";
    if (words.length === 1 && CONNECTORS.has(lower)) return "connector";
    if (words.length === 1 && PREPOSITIONS.has(lower)) return "other";
    if (/^a\s+\S/i.test(ro.trim())) return "verb";
    if (!bare.includes(" ") && /^[a-zäöüß]+(en|ern|eln)$/.test(bare) && !ADVERBS_EN.has(bare)) return "verb";
    if (/^sich\s/i.test(de)) return "verb";
    if (words.length === 1 && /^[A-ZÄÖÜ]/.test(de)) return "noun";
    return "adverb";
  }

  const SEPARATORS = [/\s+[-–—]+\s+/, /\s*=\s*/, /\s*[–—]\s*/, /\t+/, /\s*:\s+/, /\s*->\s*|\s*→\s*/];

  function splitPair(line) {
    for (const sep of SEPARATORS) {
      const parts = line.split(sep);
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) return [parts[0].trim(), parts[1].trim()];
    }
    return null;
  }

  /** Extract { de, ro, type } candidates from a chat (plain text or CSV). */
  function parseChat(text, isCSV) {
    if (isCSV || /^[^\n]*(message|text)[^\n]*,/i.test(text.slice(0, 300))) text = csvToText(text);
    const out = [];
    const seen = new Set();
    for (const raw of text.split(/\r?\n/)) {
      const line = cleanLine(raw);
      if (!line || /^https?:\/\//.test(line)) continue;
      const pair = splitPair(line);
      if (!pair) continue;
      let [a, b] = pair;
      // Skip "Name: message" lines where the left side looks like a sender name.
      if (/^[A-ZĂÂÎȘȚ][\wăâîșț]+( [A-ZĂÂÎȘȚ][\wăâîșț]+)?$/.test(a) && b.split(" ").length > 5 && Math.abs(langScore(b)) > 0) continue;
      if (a.length > 200 || b.length > 200) continue;
      let de = a, ro = b;
      if (langScore(b) > langScore(a)) { de = b; ro = a; }
      const sd = langScore(de), sr = langScore(ro);
      if ((sd > 2 && sr > 2) || (sd < -2 && sr < -2)) continue; // both sides in the same language
      de = de.replace(/,\s*(-|¨|")\S*$/, "").replace(/\s*\((pl|Pl)\.?[^)]*\)\s*$/, "").trim(); // drop plural notes
      const type = classify(de, ro);
      const key = norm(de) + "|" + norm(ro);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ de, ro, type });
    }
    return out;
  }

  const api = { BASICS, TYPES, norm, fold, lev, splitAlternatives, checkAnswer, buildKnownSet, unknownWords, parseChat, parseCSV, classify, langScore };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Lang = api;
})(this);
