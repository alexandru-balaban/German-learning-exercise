// Language helpers: answer checking and the "only learnt words" filter.
(function (root) {
  "use strict";

  // Grammar words that every sentence may use (pronouns, articles, sein/haben, negation).
  const BASICS = (
    "ich du er sie es wir ihr mich dich ihn uns euch mir dir ihm ihnen " +
    "der die das den dem des ein eine einen einem einer eines kein keine keinen keinem keiner " +
    "mein meine meinen meinem meiner dein deine deinen deinem seine seinen seinem " +
    "ihre ihren ihrem unser unsere unseren euer eure " +
    "bin bist ist sind seid sein war waren warst habe hast hat haben habt hatte hatten gewesen gehabt nicht ja nein " +
    "im ins am zum zur vom beim diese diesen dieses diesem dieser jede jeden jedes jedem jeder " +
    "eins zwei drei vier fünf sechs sieben acht neun zehn zwanzig hundert"
  ).split(" ");

  const TYPES = ["verb", "noun", "adverb", "connector", "other"];

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
    const sep = isSentence ? /\|/ : /[\/|;]/;
    return String(text).split(sep).map((s) => s.trim()).filter(Boolean);
  }

  // Extra variants we also accept (e.g. Romanian verbs without "a ", German nouns without article).
  function variants(answer, lang, isSentence, type) {
    const out = [answer];
    if (!isSentence) {
      const noParen = answer.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
      if (noParen && noParen !== answer) out.push(noParen);
      if (lang === "ro" && type === "noun") {
        const parts = noParen.split(" ");
        const last = parts.pop();
        roNounBases(last).forEach((b) => out.push(parts.concat(b).join(" ")));
      }
      if (lang === "ro" && /^a\s+/i.test(noParen)) out.push(noParen.replace(/^a\s+/i, ""));
      if (lang === "de" && /^sich\s+/i.test(noParen)) out.push(noParen.replace(/^sich\s+/i, ""));
    }
    return out;
  }

  // Romanian nouns are stored with the definite article (câinele, casa, prietenul);
  // also accept the form without it (câine, casă, prieten).
  function roNounBases(w) {
    const out = [];
    const rules = [[/ul$/, ""], [/ul$/, "u"], [/le$/, ""], [/ua$/, ""], [/ea$/, "e"], [/ea$/, "ă"], [/ia$/, "ie"],
      [/ia$/, "e"], [/a$/, "ă"], [/a$/, "e"], [/ăl$/, "ă"], [/l$/, ""], [/ii$/, "i"], [/ile$/, "i"], [/ele$/, "e"], [/le$/, "i"]];
    for (const [re, rep] of rules) if (re.test(w)) out.push(w.replace(re, rep));
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
  function checkAnswer(input, target, lang, isSentence, type) {
    const alts = splitAlternatives(target, isSentence);
    const best = alts[0] || target;
    const given = norm(input);
    if (!given) return { ok: false, kind: "wrong", best };

    const cands = [];
    alts.forEach((a) => variants(a, lang, isSentence, type).forEach((v) => cands.push({ v, orig: a })));

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
  const NOUN_ENDINGS = ["", "n", "en", "e", "s", "es", "er", "ern", "nen", "se", "sen"];
  const ADJ_ENDINGS = ["", "e", "en", "er", "es", "em", "ere", "eren", "erer", "eres", "erem", "ste", "sten", "ster", "stes", "stem", "este", "esten"];
  const SEP_PREFIXES = ["zurück", "zusammen", "weiter", "herunter", "heraus", "hinaus", "vorbei", "kennen", "statt", "teil",
    "fern", "fest", "nach", "mit", "vor", "weg", "ein", "aus", "auf", "an", "ab", "zu", "um", "los", "her", "hin", "dar", "bei"];

  // Umlaut the last a/o/u/au of a word (Stadt → Städt, laufen → läuf).
  function umlaut(w) {
    const m = w.match(/^(.*)(au|a|o|u)([^aeiouäöü]*)$/);
    if (!m) return null;
    return m[1] + { au: "äu", a: "ä", o: "ö", u: "ü" }[m[2]] + m[3];
  }

  function addVerbForms(known, inf) {
    const stem = inf.replace(/(en|n)$/, "");
    VERB_ENDINGS.forEach((e) => known.add(stem + e));
    // Strong verbs: vowel change in du/er forms (e → i / ie, a → ä, au → äu).
    const changed = [stem.replace(/e(?=[^e]*$)/, "i"), stem.replace(/e(?=[^e]*$)/, "ie"), umlaut(stem)];
    changed.filter(Boolean).forEach((c) => ["", "st", "t", "s"].forEach((e) => known.add(c + e)));
    // Participles: ge…t, ge…en, and ohne ge- for be-/ver-/-ieren verbs (already covered by stem+t / inf).
    known.add("ge" + stem + "t");
    known.add("ge" + stem + "et");
    known.add("ge" + inf);
  }

  function buildKnownSet(vocab) {
    const known = new Set(BASICS);
    for (const w of vocab) {
      for (const alt of splitAlternatives(w.de, false)) {
        const clean = norm(alt.replace(/\(.*?\)/g, ""));
        const words = clean.split(" ").filter(Boolean);
        words.forEach((x) => known.add(x));
        const last = words[words.length - 1];
        if (!last) continue;
        if (w.type === "verb") {
          addVerbForms(known, last);
          const pre = SEP_PREFIXES.find((p) => last.startsWith(p) && last.length - p.length > 2);
          if (pre) {
            const base = last.slice(pre.length);
            known.add(pre);
            addVerbForms(known, base);
            const stem = base.replace(/(en|n)$/, "");
            known.add(pre + "ge" + stem + "t");
            known.add(pre + "ge" + base);
            known.add(pre + "zu" + base);
          }
        } else if (w.type === "noun") {
          NOUN_ENDINGS.forEach((e) => known.add(last + e));
          const u = umlaut(last);
          if (u) NOUN_ENDINGS.forEach((e) => known.add(u + e));
          if (/e$/.test(last)) NOUN_ENDINGS.forEach((e) => known.add(last.slice(0, -1) + e));
        } else {
          ADJ_ENDINGS.forEach((e) => known.add(last + e));
          if (/e$/.test(last)) ADJ_ENDINGS.forEach((e) => known.add(last.slice(0, -1) + e)); // letzte → letzten
          const u = umlaut(last);
          if (u) ["er", "ere", "eren", "ste", "sten", "esten"].forEach((e) => known.add(u + e));
          if (/e[lr]$/.test(last)) { // dunkel → dunkle, teuer → teure
            const short = last.slice(0, -2) + last.slice(-1);
            ADJ_ENDINGS.forEach((e) => known.add(short + e));
          }
        }
      }
      (w.forms || []).forEach((f) => known.add(norm(f)));
    }
    return known;
  }

  function unknownWords(sentence, known) {
    return norm(sentence).split(" ").filter((t) => t && !/^\d+$/.test(t) && !known.has(t));
  }

  const api = { BASICS, TYPES, norm, fold, lev, splitAlternatives, checkAnswer, buildKnownSet, unknownWords, roNounBases };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Lang = api;
})(this);
