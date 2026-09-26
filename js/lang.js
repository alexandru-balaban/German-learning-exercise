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

  // Translation languages. `articles` / `verbPrefix` are optional words the learner may leave out,
  // `pronouns` are subject pronouns that may be dropped in sentences, `chars` are on-screen letter buttons.
  const LANGS = {
    ro: { name: "Română", english: "Romanian", flag: "🇷🇴", verbPrefix: /^a\s+/, pronouns: ["eu", "tu", "el", "ea", "noi", "voi", "ei", "ele"],
      chars: ["ă", "â", "î", "ș", "ț"] },
    en: { name: "English", english: "English", flag: "🇬🇧", articles: /^(the|a|an)\s+/, verbPrefix: /^to\s+/, chars: [] },
    fr: { name: "Français", english: "French", flag: "🇫🇷", articles: /^(le|la|les|l'|un|une|des)\s*/, verbPrefix: /^(se\s+|s')/,
      chars: ["é", "è", "ê", "à", "â", "ç", "ù", "û", "ô", "î", "ï", "ë", "œ"] },
    ru: { name: "Русский", english: "Russian", flag: "🇷🇺", chars: ["ё", "й", "ъ", "ь", "ы", "э"] },
    el: { name: "Ελληνικά", english: "Greek", flag: "🇬🇷", articles: /^(ο|η|το|οι|τα|ένας|μια|μία|ένα)\s+/,
      pronouns: ["εγώ", "εσύ", "αυτός", "αυτή", "αυτό", "εμείς", "εσείς", "αυτοί", "αυτές", "αυτά"],
      chars: ["ά", "έ", "ή", "ί", "ό", "ύ", "ώ", "ϊ", "ς"] },
    uk: { name: "Українська", english: "Ukrainian", flag: "🇺🇦", chars: ["і", "ї", "є", "ґ", "й", "ь", "'"] },
  };

  const EN_CONTRACTIONS = [[/\bi'm\b/g, "i am"], [/\b(you|we|they)'re\b/g, "$1 are"], [/\b(he|she|it|that|what|there)'s\b/g, "$1 is"],
    [/\b(i|you|we|they)'ve\b/g, "$1 have"], [/\b(i|you|he|she|it|we|they)'ll\b/g, "$1 will"], [/\b(i|you|he|she|we|they)'d\b/g, "$1 would"],
    [/\bcan't\b/g, "cannot"], [/\bcan not\b/g, "cannot"], [/\bwon't\b/g, "will not"], [/\blet's\b/g, "let us"], [/n't\b/g, " not"]];

  // ---------- normalisation ----------
  function norm(s, lang) {
    let out = String(s)
      .toLowerCase()
      .replace(/[’‘`´ʼ]/g, "'")
      .replace(/[.,!?;:„“"”«»()\[\]¿¡…;·–—]/g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (lang === "en") EN_CONTRACTIONS.forEach(([re, rep]) => { out = out.replace(re, rep); });
    return out;
  }
  function fold(s, lang) {
    // Remove diacritics (ä→a, ș→s, ά→α, ё→е) and ß→ss / ς→σ for lenient comparison.
    return norm(s, lang).replace(/ß/g, "ss").replace(/ς/g, "σ").normalize("NFD").replace(/[̀-ͯ]/g, "")
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

  // Words the learner may leave out of a single-word answer: articles, "to", "a ", "sich".
  function stripOptional(s, lang) {
    const cfg = LANGS[lang] || {};
    let out = s;
    if (cfg.articles) out = out.replace(cfg.articles, "");
    if (cfg.verbPrefix) out = out.replace(cfg.verbPrefix, "");
    if (lang === "de") out = out.replace(/^sich\s+/, "");
    return out.trim();
  }

  // Extra variants we also accept (text in brackets left out, Romanian nouns without article).
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

  function stripPronoun(s, lang) {
    const list = (LANGS[lang] || {}).pronouns;
    if (!list) return s;
    const w = s.split(" ");
    return list.includes(w[0]) && w.length > 1 ? w.slice(1).join(" ") : s;
  }

  const ARTICLE_RE = /^(der|die|das)\s+/i;

  /**
   * Check an answer. `lang` is the language of the expected answer ("de" or a translation language).
   * @returns {{ok:boolean, kind:'correct'|'accent'|'typo'|'article'|'wrong', best:string, note?:string}}
   */
  function checkAnswer(input, target, lang, isSentence, type) {
    const alts = splitAlternatives(target, isSentence);
    const best = alts[0] || target;
    const given = norm(input, lang);
    if (!given) return { ok: false, kind: "wrong", best };

    const cands = [];
    alts.forEach((a) => variants(a, lang, isSentence, type).forEach((v) => cands.push({ v, orig: a })));

    const tries = (fn) => cands.find((c) => fn(c.v));
    // Compare two normalised strings, ignoring optional words (words) or a dropped subject pronoun (sentences).
    const same = (a, b) => a === b ||
      (isSentence ? stripPronoun(a, lang) === stripPronoun(b, lang)
        : lang !== "de" && stripOptional(a, lang) === stripOptional(b, lang));

    let hit = tries((v) => same(norm(v, lang), given));
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
      hit = tries((v) => stripOptional(norm(v), "de") === given);
      if (hit) return { ok: true, kind: "correct", best: hit.orig };
    }

    hit = tries((v) => same(fold(v, lang), fold(given, lang)));
    if (hit) return { ok: true, kind: "accent", best: hit.orig, note: "Watch the accents and special letters." };

    const maxTypo = isSentence ? (given.length >= 15 ? 2 : 1) : (given.length >= 5 ? 1 : 0);
    if (maxTypo) {
      hit = tries((v) => lev(fold(v, lang), fold(given, lang)) <= maxTypo ||
        (!isSentence && lang !== "de" && lev(stripOptional(fold(v, lang), lang), stripOptional(fold(given, lang), lang)) <= maxTypo));
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
    const m = w.match(/^(.*?)(au|a|o|u)([^aeiouäöü]*)$/);
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

  const api = { BASICS, TYPES, LANGS, norm, fold, lev, splitAlternatives, checkAnswer, buildKnownSet, unknownWords, roNounBases };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Lang = api;
})(this);
