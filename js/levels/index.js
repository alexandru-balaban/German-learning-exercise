// Turns the compact level files (b1.js, b2.js, c1.js) into word / sentence objects.
(function (root) {
  "use strict";
  const LEVEL_ORDER = ["B1", "B2", "C1"];
  const TYPE_CODES = { v: "verb", n: "noun", a: "adverb", c: "connector", o: "other" };

  function parseLevel(level, name) {
    const words = level.words.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
      const [t, de, ro, forms] = line.split("|");
      return { de: de.trim(), ro: ro.trim(), type: TYPE_CODES[t.trim()] || t.trim(),
        forms: forms ? forms.split(",").map((f) => f.trim()) : undefined, level: name };
    });
    const sentences = level.sentences.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
      const i = line.indexOf(" = ");
      return { de: line.slice(0, i).trim(), ro: line.slice(i + 3).trim(), level: name };
    });
    return { words, sentences };
  }

  // Words and sentences for a level, including all lower levels (B2 = B1 + B2).
  function loadLevel(target, levels) {
    const out = { vocab: [], sentences: [] };
    for (const name of LEVEL_ORDER) {
      if (!levels[name]) continue;
      const { words, sentences } = parseLevel(levels[name], name);
      out.vocab.push(...words);
      out.sentences.push(...sentences);
      if (name === target) break;
    }
    return out;
  }

  const api = { LEVEL_ORDER, parseLevel, loadLevel };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Levels = api;
})(this);
