# Deutsch ↔ Română – German learning exercises

A small static website to practise the German vocabulary from my lessons, with Romanian translations.

Open `index.html` in a browser (or turn on GitHub Pages for this repo). You don't need to install or build anything.

## Tabs

- **Vocabulary**: all learnt words, split into **Verbs, Nouns, Adverbs, Connectors** (plus "Other" for prepositions).
  Articles are coloured (der / die / das), 🔊 reads the word out loud, and there is a search box and an "Add word" form.
- **Translate**: Duolingo-style exercises, German → Romanian, Romanian → German or mixed.
  - *Just words* or *Entire sentences*.
  - Sentences only show if **every German word in them is in your vocabulary** (pronouns, articles and sein/haben are always allowed; verb conjugations and noun plurals are recognised).
  - If you get one wrong you see **Wrong** and the correct answer. The question comes back once at the end of the lesson.
  - Answers missing diacritics, with a small typo, or without the article are accepted, and the site tells you what to fix. The wrong article (e.g. *die Hund*) counts as wrong.
  - For sentences you can use word tiles instead of typing.
- **Import lessons**: pull the vocabulary from the Viber conversation with the teacher.
  1. Export the chat from Viber (phone: chat info → *Export chat*; older versions: Settings → Calls and messages → *Email message history*, which gives a `.csv`), or copy the messages from Viber Desktop.
  2. Upload the file or paste the text, then press **Find vocabulary**.
  3. Lines like `der Hund - câinele`, `lernen = a învăța`, `Ich lerne Deutsch. – Învăț germană.` are detected and sorted into categories automatically. Fix any type in the table, then press **Save**.

Words are saved in the browser (localStorage). Use **Download data.js** and replace `js/data.js` in the repo to make your vocabulary the default on every device.

The words in `js/data.js` right now are **sample A1 vocabulary**. Replace them with your own lessons.

## Tests

```
node test/lang.test.js
```
