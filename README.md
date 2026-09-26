# Deutsch ↔ Română – German learning exercises

A small static website to practise Goethe B1, B2 and C1 German vocabulary, with Romanian translations.

Open `index.html` in a browser (or turn on GitHub Pages for this repo). You don't need to install or build anything.

## Tabs

- **Vocabulary**: all words of your level, split into **Verbs, Nouns, Adverbs & adjectives, Connectors** (plus "Other" for prepositions and question words).
  Articles are coloured (der / die / das), and there is a search box and an "Add word" form.
- **Exercises**: Duolingo-style exercises.
  - *Just words* or *Entire sentences*: translate German → Romanian, Romanian → German or mixed.
  - *Fill in the blank*: pick the missing preposition (*in, am, um, bei, seit…*) or connector (*weil, obwohl, dass, trotzdem…*) from 4 choices. Use the mouse or keys 1–4. The Romanian translation is shown as a hint, and after answering you see the grammar rule (e.g. *um + ora exactă*). Each level has its own set: B1 has 45, B2 adds 24 and C1 adds 15.
  - Sentences only show if **every German word in them is in the vocabulary of your level**. Pronouns, articles and sein/haben are always allowed, and conjugations, plurals and adjective endings are recognised. The tests check every built-in sentence.
  - If you get one wrong you see **Wrong** and the correct answer. The question comes back once at the end of the lesson.
  - Answers missing diacritics, with a small typo, or without the article are accepted, and the site tells you what to fix. The wrong article (e.g. *die Hund*) counts as wrong.
  - For sentences you can use word tiles instead of typing.
- **Settings**: choose the vocabulary level: **B1** (default), **B2** or **C1**. Each level includes the ones below it
  (B2 = B1 + B2, C1 = B1 + B2 + C1). In the exercises you can also practise only the words that are new at your level.
  Your choice is remembered. Words you add yourself are kept in the browser, and you can back them up and restore them here.

## Vocabulary

The lists are in `js/levels/` (`b1.js`, `b2.js`, `c1.js`), one word per line: `type|German|Romanian|extra forms`.
Fill-in-the-blank lines are `kind|sentence with ___|answer|3 wrong choices|Romanian|rule`, where kind is `p` (preposition) or `c` (connector).

- **B1** follows the Goethe-Zertifikat B1 word list, which includes A1 and A2 (about 1,000 words).
- Goethe-Institut publishes no official word lists for **B2** and **C1**. Those files hold standard vocabulary for each level
  (about 470 and 290 extra words).
- The lists were written by hand, not copied from the official PDF, so a word may be missing or a translation may be off.
  To fix one, edit the line in the file.
- Adjectives are grouped with adverbs.

## Tests

```
node test/lang.test.js
```
