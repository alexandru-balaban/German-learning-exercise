const assert = require("assert");
const L = require("../js/lang.js");
global.window = {};
for (const f of ["a1", "a2", "b1", "b2", "c1"]) require(`../js/levels/${f}.js`);
require("../js/grammar.js");
const { parseLevel, LEVEL_ORDER, LANG_CODES } = require("../js/levels/index.js");

// Each translation must be written in the right alphabet (catches a language put in the wrong column).
const cyr = /[а-яёіїєґ]/i, grk = /[α-ωάέήίόύώϊϋΐΰς]/i, lat = /[a-zà-ÿăâîșțœ]/i;
const scriptOk = {
  ro: (s) => lat.test(s) && !cyr.test(s) && !grk.test(s),
  en: (s) => lat.test(s) && !cyr.test(s) && !grk.test(s) && !/[ăâîșț]/.test(s),
  fr: (s) => lat.test(s) && !cyr.test(s) && !grk.test(s) && !/[ășț]/.test(s),
  ru: (s) => cyr.test(s) && !/[іїєґ]/i.test(s) && !grk.test(s),
  uk: (s) => cyr.test(s) && !/[ыэъё]/i.test(s) && !grk.test(s),
  el: (s) => grk.test(s) && !cyr.test(s),
};
const checkTr = (where, tr) => LANG_CODES.forEach((c) =>
  assert.ok(tr[c] && scriptOk[c](tr[c]), `${where} [${c}] = "${tr[c]}"`));

// Every level: no duplicate words, all six translations, sentences and gaps use only words known at that level.
const seen = new Map();
let vocab = [];
for (const lvl of LEVEL_ORDER) {
  const { words, sentences, gaps } = parseLevel(window.LEVELS[lvl], lvl);
  assert.ok(words.length > 100, lvl + " has words");
  for (const w of words) {
    assert.ok(L.TYPES.includes(w.type), `${lvl}: bad type in ${w.de}`);
    const key = w.de.toLowerCase() + "|" + w.type;
    assert.ok(!seen.has(key), `${lvl}: duplicate ${w.de} (already in ${seen.get(key)})`);
    seen.set(key, lvl);
    checkTr(`${lvl} word ${w.de}`, w.tr);
  }
  vocab = vocab.concat(words);
  const known = L.buildKnownSet(vocab);
  for (const s of sentences) {
    assert.deepStrictEqual(L.unknownWords(s.de, known), [], `${lvl} sentence: ${s.de}`);
    checkTr(`${lvl} sentence ${s.de}`, s.tr);
  }
  // Fill-in-the-blank: one blank, 4 distinct choices, a German rule, and the filled sentence uses only known words.
  for (const g of gaps) {
    assert.strictEqual(g.de.split("___").length, 2, "one blank: " + g.de);
    assert.strictEqual(g.wrong.length, 3, "3 wrong choices: " + g.de);
    assert.strictEqual(new Set([g.answer, ...g.wrong].map((c) => c.toLowerCase())).size, 4, "distinct choices: " + g.de);
    assert.ok(g.rule, "rule: " + g.de);
    assert.deepStrictEqual(L.unknownWords(g.de.replace("___", g.answer), known), [], "gap words: " + g.de);
    checkTr(`${lvl} gap ${g.de}`, g.tr);
  }
  assert.ok(sentences.length >= 15 && gaps.length >= 10, lvl + " has exercises");
  console.log(`${lvl}: ${words.length} new words, ${vocab.length} total, ${sentences.length} sentences, ${gaps.length} fill-in-the-blank`);
}
const known = L.buildKnownSet(vocab);
assert.deepStrictEqual(L.unknownWords("Ich höre Blablamusik.", known), ["blablamusik"]);

// Grammar topics are complete.
const cats = new Set(window.GRAMMAR_CATEGORIES.map((c) => c.id));
for (const t of window.GRAMMAR) {
  assert.ok(cats.has(t.cat) && LEVEL_ORDER.includes(t.level) && t.title && t.intro, "grammar topic: " + t.title);
  assert.ok(t.rules.length && t.examples.length, "grammar rules / examples: " + t.title);
  for (const tb of t.tables) for (const r of tb.rows) assert.strictEqual(r.length, tb.head.length, `table row in ${t.title}: ${r}`);
}
console.log(`Grammar: ${window.GRAMMAR.length} topics`);

// Answer checking
const c = (i, t, l, s, ty) => L.checkAnswer(i, t, l, s, ty).kind;
// Romanian
assert.strictEqual(c("câinele", "câinele", "ro", false, "noun"), "correct");
assert.strictEqual(c("câine", "câinele", "ro", false, "noun"), "correct");
assert.strictEqual(c("casă", "casa", "ro", false, "noun"), "correct");
assert.strictEqual(c("familie", "familia", "ro", false, "noun"), "correct");
assert.strictEqual(c("caine", "câinele", "ro", false, "noun"), "accent");
assert.strictEqual(c("învăța", "a învăța", "ro", false, "verb"), "correct");
assert.strictEqual(c("arăta", "a arăta (bine, rău)", "ro"), "correct");
assert.strictEqual(c("pisica", "câinele", "ro", false, "noun"), "wrong");
assert.strictEqual(c("Eu locuim în oraș", "Locuim în oraș.", "ro", true), "correct");
assert.strictEqual(c("n-am timp", "Nu am timp.|N-am timp.", "ro", true), "correct");
// English
assert.strictEqual(c("the dog", "dog", "en", false, "noun"), "correct");
assert.strictEqual(c("to learn", "learn / study", "en", false, "verb"), "correct");
assert.strictEqual(c("I'm learning German", "I am learning German.", "en", true), "correct");
assert.strictEqual(c("I don't have time today", "I do not have time today.", "en", true), "correct");
assert.strictEqual(c("cat", "dog", "en", false, "noun"), "wrong");
// French
assert.strictEqual(c("chien", "le chien", "fr", false, "noun"), "correct");
assert.strictEqual(c("l'eau", "l'eau", "fr", false, "noun"), "correct");
assert.strictEqual(c("eau", "l'eau", "fr", false, "noun"), "correct");
assert.strictEqual(c("ecole", "l'école", "fr", false, "noun"), "accent");
// Greek
assert.strictEqual(c("σκύλος", "ο σκύλος", "el", false, "noun"), "correct");
assert.strictEqual(c("σκυλος", "ο σκύλος", "el", false, "noun"), "accent");
assert.strictEqual(c("Μαθαίνω γερμανικά", "Εγώ μαθαίνω γερμανικά.", "el", true), "correct");
// Russian / Ukrainian
assert.strictEqual(c("еще", "ещё / еще", "ru"), "correct");
assert.strictEqual(c("ещe", "ещё", "ru"), "wrong");
assert.strictEqual(c("собака", "собака / пес", "uk", false, "noun"), "correct");
assert.strictEqual(c("п'ять", "п'ять", "uk"), "correct");
assert.strictEqual(c("п’ять", "п'ять", "uk"), "correct");
// German
assert.strictEqual(c("der Hund", "der Hund", "de", false, "noun"), "correct");
assert.strictEqual(c("Hund", "der Hund", "de", false, "noun"), "article");
assert.strictEqual(c("die Hund", "der Hund", "de", false, "noun"), "wrong");
assert.strictEqual(c("waschen", "sich waschen", "de", false, "verb"), "correct");
assert.strictEqual(c("Ich lerne Deutch", "Ich lerne Deutsch.", "de", true), "typo");
assert.strictEqual(c("Ich lerne Englisch", "Ich lerne Deutsch.", "de", true), "wrong");
console.log("all tests passed");
