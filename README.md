# Deutsch Guy – learn German

<img src="assets/deutsch-guy.svg" width="72" alt="Deutsch Guy logo">

**Deutsch Guy** is a small static website to learn German vocabulary and grammar (Goethe levels A1–C1). Translations
are available in **Romanian, English, French, Russian, Greek and Ukrainian**, and the interface follows the chosen language.

Made by **AX Tech**.

Open `index.html` in a browser (or turn on GitHub Pages for this repo). You don't need to install or build anything.

## Design

The design follows the frontend-design skill in `.claude/skills/frontend-design/`.

- Colours: a navy base, one main colour (Deutsch blue `#3D7BFF`, from the logo) and one accent colour (flag gold `#FFC83D`).
  Green and red are only used for right and wrong answers. Articles: **der** blue, **die** gold, **das** white and underlined.
- Type: Barlow Condensed for headlines and Barlow for text. They are close to DIN, the lettering on German road signs.
- Layout: sidebar menu (a bottom tab bar on phones) and a Berlin skyline hero. Each vocabulary category is a card, and
  clicking its header opens the category full screen with its own search. Clicking a word shows all six translations,
  the word type, the level and irregular forms.
- Exercises run in one card: the question, the answer field, then the Check button and the feedback right below it,
  with a progress bar and a "3 / 10" counter on top.
- The language is picked from a small menu with flags in the top bar, or from compact chips in Settings.
  Flags and icons are inline SVG, not emoji.
- `assets/deutsch-guy.svg` is the Deutsch Guy logo and favicon. The AX Tech wordmark appears once, in the footer, and is
  used unchanged from the AX Tech brand kit.
- Interface texts are in `js/i18n.js`.

## Tabs

- **Vocabulary**: all words of your level, split into **Verbs, Nouns, Adverbs & adjectives, Connectors** (plus "Other" for
  prepositions, question words, greetings and numbers). Articles are coloured (der / die / das), each word shows its
  level, and there is a search box and an "Add word" form.
- **Exercises** (Duolingo style):
  - *Just words* or *Entire sentences*: translate German → your language, your language → German, or mixed.
    Sentences only show if **every German word in them is in the vocabulary of your level**. Pronouns, articles and
    sein/haben are always allowed, and conjugations, plurals and adjective endings are recognised.
  - *Fill in the blank*: pick the missing preposition (*in, am, um, bei, seit…*) or connector (*weil, obwohl, dass…*)
    from 4 choices (mouse or keys 1–4). The translation is shown as a hint, and after answering you see the rule in German.
  - If you get one wrong you see **Wrong** and the correct answer. The question comes back once at the end of the lesson.
  - Small typos and missing accents are accepted, and so are answers without an article (*dog / the dog*,
    *chien / le chien*, *σκύλος / ο σκύλος*, *câine / câinele*). The site tells you what to fix.
    In German, a missing article gets a reminder and a wrong article (*die Hund*) counts as wrong.
- **Grammar**: 53 Goethe grammar topics explained **in German**, grouped into *Verben & Zeiten, Nomen/Artikel/Kasus, Pronomen,
  Adjektive, Präpositionen, Satzbau & Konnektoren*. Examples: *Futur I*, the article and adjective tables for
  nominative/accusative/dative/genitive, and when to use dative, accusative, two-way and genitive prepositions.
  Each topic has rules, tables and examples. You can filter by level and search.
- **Settings**: choose the **translation language** and the **level** (A1, A2, B1, B2, C1). Each level includes the ones
  below it (B1 = A1 + A2 + B1). In the exercises you can also practise only the words that are new at your level.
  Both choices are remembered. Words you add yourself are kept in the browser, and you can back them up and restore them.

## Vocabulary data

The lists are in `js/levels/` (`a1.js` … `c1.js`); the format is described in `js/levels/index.js`:

- words: `type|German|ro|en|fr|ru|el|uk|extra German forms`, one per line
- sentences: the German sentence, then one indented `xx: translation` line per language (`|` separates accepted answers)
- fill in the blank: `kind|sentence with ___|answer|3 wrong choices|rule`, then the translation lines

| Level | New words | Sentences | Fill in the blank |
|-------|-----------|-----------|-------------------|
| A1    | 420       | 22        | 17                |
| A2    | 416       | 21        | 20                |
| B1    | 270       | 40        | 15                |
| B2    | 464       | 28        | 24                |
| C1    | 286       | 20        | 15                |

A1, A2 and B1 follow the Goethe-Zertifikat word lists. Goethe publishes no official lists for B2 and C1, so those files hold
standard vocabulary for each level. All lists and translations were written by hand, not copied from official
material, so a word may be missing or a translation may be off. To fix one, edit its line.

The grammar topics are in `js/grammar.js`.

## Tests

```
node test/lang.test.js
```

The tests check:

- every word, sentence and blank has all six translations, each in the right alphabet
- no word appears twice
- every exercise sentence uses only words from its level
- each fill-in-the-blank question has four different choices
- the grammar tables are well-formed
- answer checking works in every language
