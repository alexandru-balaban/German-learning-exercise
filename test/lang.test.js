const assert = require("assert");
const L = require("../js/lang.js");
global.window = {};
require("../js/levels/b1.js");
require("../js/levels/b2.js");
require("../js/levels/c1.js");
const { parseLevel, LEVEL_ORDER } = require("../js/levels/index.js");

// Every level: no duplicate words across levels, every sentence uses only words known at that level.
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
  }
  vocab = vocab.concat(words);
  const known = L.buildKnownSet(vocab);
  const bad = sentences.map((s) => [s.de, L.unknownWords(s.de, known)]).filter(([, u]) => u.length);
  assert.deepStrictEqual(bad, [], lvl + " sentences with unknown words");
  // Fill-in-the-blank: one blank, 4 distinct choices, and the filled sentence uses only known words.
  for (const g of gaps) {
    assert.strictEqual(g.de.split("___").length, 2, "one blank: " + g.de);
    assert.strictEqual(g.wrong.length, 3, "3 wrong choices: " + g.de);
    const choices = [g.answer, ...g.wrong].map((c) => c.toLowerCase());
    assert.strictEqual(new Set(choices).size, 4, "distinct choices: " + g.de);
    assert.ok(g.ro && g.rule, "translation and rule: " + g.de);
    assert.deepStrictEqual(L.unknownWords(g.de.replace("___", g.answer), known), [], "gap words: " + g.de);
  }
  assert.ok(gaps.length >= 15, lvl + " has fill-in-the-blank exercises");
  console.log(`${lvl}: ${words.length} new words, ${vocab.length} total, ${sentences.length} sentences, ${gaps.length} fill-in-the-blank`);
}
const known = L.buildKnownSet(vocab);
assert.deepStrictEqual(L.unknownWords("Ich höre Blablamusik.", known), ["blablamusik"]);

// Answer checking
const c = (i, t, l, s, ty) => L.checkAnswer(i, t, l, s, ty).kind;
assert.strictEqual(c("câinele", "câinele", "ro", false, "noun"), "correct");
assert.strictEqual(c("câine", "câinele", "ro", false, "noun"), "correct");
assert.strictEqual(c("casă", "casa", "ro", false, "noun"), "correct");
assert.strictEqual(c("prieten", "prietenul", "ro", false, "noun"), "correct");
assert.strictEqual(c("familie", "familia", "ro", false, "noun"), "correct");
assert.strictEqual(c("carte", "cartea", "ro", false, "noun"), "correct");
assert.strictEqual(c("caine", "câinele", "ro", false, "noun"), "accent");
assert.strictEqual(c("învăța", "a învăța", "ro"), "correct");
assert.strictEqual(c("arăta", "a arăta (bine, rău)", "ro"), "correct");
assert.strictEqual(c("der Hund", "der Hund", "de", false, "noun"), "correct");
assert.strictEqual(c("Hund", "der Hund", "de", false, "noun"), "article");
assert.strictEqual(c("die Hund", "der Hund", "de", false, "noun"), "wrong");
assert.strictEqual(c("pisica", "câinele", "ro", false, "noun"), "wrong");
assert.strictEqual(c("Eu locuim în oraș", "Locuim în oraș.", "ro", true), "correct");
assert.strictEqual(c("n-am timp", "Nu am timp.|N-am timp.", "ro", true), "correct");
assert.strictEqual(c("Ich lerne Deutch", "Ich lerne Deutsch.", "de", true), "typo");
assert.strictEqual(c("Ich lerne Englisch", "Ich lerne Deutsch.", "de", true), "wrong");
console.log("all tests passed");
