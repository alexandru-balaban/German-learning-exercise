const assert = require("assert");
const L = require("../js/lang.js");
global.window = {};
require("../js/data.js");
const SEED = window.SEED;

// Every seed sentence must use only learnt words.
const known = L.buildKnownSet(SEED.vocab);
for (const s of SEED.sentences) assert.deepStrictEqual(L.unknownWords(s.de, known), [], s.de);
assert.deepStrictEqual(L.unknownWords("Ich höre Musik.", known), ["musik"]);

// Answer checking
const c = (i, t, l, s) => L.checkAnswer(i, t, l, s);
assert.strictEqual(c("câinele", "câinele / câine", "ro").kind, "correct");
assert.strictEqual(c("caine", "câinele / câine", "ro").kind, "accent");
assert.strictEqual(c("învăța", "a învăța", "ro").kind, "correct");
assert.strictEqual(c("der Hund", "der Hund", "de").kind, "correct");
assert.strictEqual(c("Hund", "der Hund", "de").kind, "article");
assert.strictEqual(c("die Hund", "der Hund", "de").kind, "wrong");
assert.strictEqual(c("pisica", "câinele / câine", "ro").kind, "wrong");
assert.strictEqual(c("Eu locuim în oraș", "Locuim în oraș.", "ro", true).kind, "correct");
assert.strictEqual(c("Nu am timp", "Nu am timp.|N-am timp.", "ro", true).kind, "correct");
assert.strictEqual(c("n-am timp", "Nu am timp.|N-am timp.", "ro", true).kind, "correct");
assert.strictEqual(c("Ich lerne Deutch", "Ich lerne Deutsch.", "de", true).kind, "typo");
assert.strictEqual(c("Ich lerne Englisch", "Ich lerne Deutsch.", "de", true).kind, "wrong");
assert.strictEqual(c("merge", "a merge (cu mașina) / a conduce", "ro").kind, "correct");

// Viber parsing
const chat = `[20.09.26, 18:02] Teacher: Vocabular lecția 3
[20.09.26, 18:03] Teacher: der Hund - câinele
die Katze = pisica
lernen – a învăța
sich waschen - a se spăla
morgen - mâine
weil - pentru că
mit - cu
schön - frumos
Ich wohne in Berlin. - Eu locuiesc în Berlin.
Maria: Mulțumesc, ne vedem mâine la ora cinci!`;
const r = L.parseChat(chat);
const byDe = Object.fromEntries(r.map((x) => [x.de, x]));
assert.strictEqual(byDe["der Hund"].type, "noun");
assert.strictEqual(byDe["der Hund"].ro, "câinele");
assert.strictEqual(byDe["die Katze"].type, "noun");
assert.strictEqual(byDe["lernen"].type, "verb");
assert.strictEqual(byDe["sich waschen"].type, "verb");
assert.strictEqual(byDe["morgen"].type, "adverb");
assert.strictEqual(byDe["weil"].type, "connector");
assert.strictEqual(byDe["mit"].type, "other");
assert.strictEqual(byDe["Ich wohne in Berlin."].type, "sentence");
assert.ok(!r.some((x) => /Mulțumesc/.test(x.de + x.ro)), JSON.stringify(r));

// Viber CSV export
const csv = 'Date,Time,Sender,Phone,Message\n20/09/2026,18:03,Teacher,+40,"der Tisch - masa"\n20/09/2026,18:04,Teacher,+40,"kaufen - a cumpăra\noft - des"\n';
const rc = L.parseChat(csv, true);
assert.deepStrictEqual(rc.map((x) => x.type), ["noun", "verb", "adverb"]);
console.log("all tests passed");
