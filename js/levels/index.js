// Turns the compact level files (a1.js … c1.js) into word, sentence and fill-in-the-blank objects.
//
// words:     type|German|ro|en|fr|ru|el|uk|extra German forms (comma separated, optional)
//            type: v = verb, n = noun, a = adverb / adjective, c = connector, o = other
//            "/" separates several accepted answers.
// sentences: a German sentence, followed by one indented line per language:
//              Ich lerne Deutsch.
//                ro: Învăț germană.|Eu învăț germana.      ("|" separates accepted translations)
// gaps:      kind|sentence with ___|answer|3 wrong choices|rule (in German), followed by indented translations.
//            kind: p = preposition, c = connector
(function (root) {
  "use strict";
  const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];
  const LANG_CODES = ["ro", "en", "fr", "ru", "el", "uk"];
  const TYPE_CODES = { v: "verb", n: "noun", a: "adverb", c: "connector", o: "other" };

  const lines = (text) => (text || "").split("\n").filter((l) => l.trim());

  // Groups "head line" + indented "xx: translation" lines.
  function blocks(text) {
    const out = [];
    for (const line of lines(text)) {
      const m = line.match(/^\s+([a-z]{2}):\s*(.*)$/);
      if (m && out.length) out[out.length - 1].tr[m[1]] = m[2].trim();
      else out.push({ head: line.trim(), tr: {} });
    }
    return out;
  }

  function parseLevel(level, name) {
    const words = lines(level.words).map((line) => {
      const f = line.split("|").map((x) => x.trim());
      const tr = {};
      LANG_CODES.forEach((code, i) => { tr[code] = f[2 + i] || ""; });
      const forms = f[2 + LANG_CODES.length];
      return { de: f[1], tr, type: TYPE_CODES[f[0]] || f[0],
        forms: forms ? forms.split(",").map((x) => x.trim()) : undefined, level: name };
    });
    const sentences = blocks(level.sentences).map((b) => ({ de: b.head, tr: b.tr, level: name }));
    const gaps = blocks(level.gaps).map((b) => {
      const [kind, de, answer, wrong, rule] = b.head.split("|").map((x) => (x || "").trim());
      return { kind: kind === "c" ? "connector" : "preposition", de, answer,
        wrong: wrong.split(",").map((w) => w.trim()), rule, tr: b.tr, level: name };
    });
    return { words, sentences, gaps };
  }

  // Words, sentences and gaps for a level, including all lower levels (B1 = A1 + A2 + B1).
  function loadLevel(target, levels) {
    const out = { vocab: [], sentences: [], gaps: [] };
    for (const name of LEVEL_ORDER) {
      if (levels[name]) {
        const { words, sentences, gaps } = parseLevel(levels[name], name);
        out.vocab.push(...words);
        out.sentences.push(...sentences);
        out.gaps.push(...gaps);
      }
      if (name === target) break;
    }
    return out;
  }

  const api = { LEVEL_ORDER, LANG_CODES, parseLevel, loadLevel };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Levels = api;
})(this);
