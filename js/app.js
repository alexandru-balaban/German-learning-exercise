(function () {
  "use strict";
  const L = window.Lang;
  const LEVEL_KEY = "deutsch-lernen.level";
  const LANG_KEY = "deutsch-lernen.lang";
  const CUSTOM_KEY = "deutsch-lernen.custom.v1";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const first = (text, isSentence) => L.splitAlternatives(text, isSentence)[0] || text;

  const TYPE_LABELS = { verb: "Verbs", noun: "Nouns", adverb: "Adverbs & adjectives", connector: "Connectors", other: "Other" };
  const TYPE_ICONS = { verb: "🏃", noun: "📦", adverb: "⏱️", connector: "🔗", other: "✳️" };

  // ---------------- data ----------------
  // Level vocabulary comes from js/levels/*.js; words the user adds are kept in localStorage.
  const store = {
    get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ } },
  };
  let level = store.get(LEVEL_KEY, "B1");
  if (!window.Levels.LEVEL_ORDER.includes(level)) level = "B1";
  let lang = store.get(LANG_KEY, "ro");
  if (!L.LANGS[lang]) lang = "ro";
  let custom = store.get(CUSTOM_KEY, { vocab: [] });
  // Older backups stored the Romanian translation as `ro`.
  custom.vocab.forEach((w) => { if (!w.tr) { w.tr = { ro: w.ro }; delete w.ro; } });
  let data;

  // Flattens the level data to the selected translation language: every item gets `tr` = its translation.
  function rebuildData() {
    const base = window.Levels.loadLevel(level, window.LEVELS);
    const mine = custom.vocab.map((w, i) => ({ de: w.de, type: w.type, tr: w.tr[lang], level: "mine", customIndex: i }))
      .filter((w) => w.tr);
    data = {
      vocab: base.vocab.map((w) => ({ ...w, tr: w.tr[lang] })).concat(mine),
      sentences: base.sentences.map((x) => ({ ...x, tr: x.tr[lang] })),
      gaps: base.gaps.map((x) => ({ ...x, hint: x.tr[lang] })),
    };
  }
  const langInfo = () => L.LANGS[lang];
  function saveCustom() { store.set(CUSTOM_KEY, custom); rebuildData(); }
  rebuildData();

  // ---------------- tabs ----------------
  function showView(name) {
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === name));
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
    window.scrollTo(0, 0);
    if (name === "vocab") renderVocab();
    if (name === "exercises") updateAvailable();
    if (name === "settings") renderSettings();
    if (name === "grammar") renderGrammar();
  }
  $$(".tab").forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goto]");
    if (g) { e.preventDefault(); showView(g.dataset.goto); }
  });

  // ---------------- vocabulary page ----------------
  function renderVocab() {
    $("#level-now").textContent = level;
    const q = L.fold($("#vocab-search").value || "");
    const groups = $("#vocab-groups");
    groups.innerHTML = "";
    const counts = [];
    for (const type of L.TYPES) {
      const all = data.vocab.filter((w) => w.type === type);
      if (type === "other" && !all.length) continue;
      counts.push(`<span>${TYPE_ICONS[type]} ${all.length} ${TYPE_LABELS[type].toLowerCase()}</span>`);
      const words = all
        .filter((w) => !q || L.fold(w.de).includes(q) || L.fold(w.tr, lang).includes(q))
        .sort((a, b) => a.de.replace(/^(der|die|das|sich) /i, "").localeCompare(b.de.replace(/^(der|die|das|sich) /i, ""), "de"));
      const card = document.createElement("div");
      card.className = "card group group-" + type;
      card.innerHTML = `<h3>${TYPE_ICONS[type]} ${TYPE_LABELS[type]} <span class="count">${all.length}</span></h3>` +
        (words.length ? `<ul class="words">${words.map((w) => `
          <li>
            <span class="de">${articleHtml(w.de)}</span>
            <span class="tr">${esc(w.tr)}</span>
            ${w.level === "mine" ? `<button class="icon-btn small del" data-del="${w.customIndex}" title="Delete">🗑</button>`
              : `<span class="lvl lvl-${w.level}">${w.level}</span>`}
          </li>`).join("")}</ul>` : `<p class="muted">${q ? "No matches." : "No words yet."}</p>`);
      groups.appendChild(card);
    }
    $("#vocab-stats").innerHTML = counts.join("") + `<span>💬 ${data.sentences.length} sentences</span>`;
    $("#basics-list").textContent = L.BASICS.join(", ");
  }
  function articleHtml(de) {
    const m = de.match(/^(der|die|das)\s+(.*)$/i);
    if (!m) return esc(de);
    return `<span class="art art-${m[1].toLowerCase()}">${esc(m[1])}</span> ${esc(m[2])}`;
  }

  $("#vocab-search").addEventListener("input", renderVocab);
  $("#vocab-groups").addEventListener("click", (e) => {
    const del = e.target.closest("[data-del]");
    if (del) {
      const w = custom.vocab[+del.dataset.del];
      if (w && confirm(`Delete “${w.de}”?`)) {
        custom.vocab.splice(+del.dataset.del, 1);
        saveCustom();
        renderVocab();
      }
    }
  });
  $("#add-word-btn").addEventListener("click", () => $("#add-word-form").classList.toggle("hidden"));
  $("#add-word-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const tr = {};
    tr[lang] = f.tr.value.trim();
    custom.vocab.push({ de: f.de.value.trim(), type: f.type.value, tr });
    saveCustom();
    f.de.value = f.tr.value = "";
    f.de.focus();
    renderVocab();
  });

  // ---------------- exercise setup ----------------
  const settings = { mode: "words", dir: "de-ro", count: 10, scope: "all" };
  $$(".seg").forEach((seg) => seg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", seg).forEach((x) => x.classList.toggle("active", x === b));
    settings[seg.dataset.name] = seg.dataset.name === "count" ? +b.dataset.value : b.dataset.value;
    updateAvailable();
  }));
  $$("#field-types input, #field-gapkinds input").forEach((c) => c.addEventListener("change", updateAvailable));

  function selectedTypes() { return $$("#field-types input:checked").map((c) => c.value); }

  // "all" = every word up to the chosen level, "level" = only the words new at this level (+ my words).
  function wordPool() {
    return data.vocab.filter((w) => selectedTypes().includes(w.type) &&
      (settings.scope === "all" || w.level === level || w.level === "mine"));
  }

  function learntSentences() {
    const known = L.buildKnownSet(data.vocab);
    return data.sentences.filter((s) => (settings.scope === "all" || s.level === level) && L.unknownWords(s.de, known).length === 0);
  }

  // Fill-in-the-blank questions whose completed sentence only uses known words.
  function gapPool() {
    const known = L.buildKnownSet(data.vocab);
    const kinds = $$("#field-gapkinds input:checked").map((c) => c.value);
    return data.gaps.filter((g) => kinds.includes(g.kind) && (settings.scope === "all" || g.level === level) &&
      L.unknownWords(g.de.replace("___", g.answer), known).length === 0);
  }

  function updateAvailable() {
    const isWords = settings.mode === "words";
    const isGaps = settings.mode === "gaps";
    $("#field-types").classList.toggle("hidden", !isWords);
    $("#field-bank").classList.toggle("hidden", settings.mode !== "sentences");
    $("#field-dir").classList.toggle("hidden", isGaps);
    $("#field-gapkinds").classList.toggle("hidden", !isGaps);
    $$(".level-name").forEach((el) => { el.textContent = level; });
    $$(".lang-name").forEach((el) => { el.textContent = langInfo().english; });
    let msg;
    if (isWords) {
      msg = `${wordPool().length} words available (level ${level}).`;
    } else if (isGaps) {
      msg = `${gapPool().length} fill-in-the-blank sentences available (level ${level}).`;
    } else {
      msg = `${learntSentences().length} sentences available — they only use words from your vocabulary (level ${level}).`;
    }
    $("#ex-available").textContent = msg;
  }

  // ---------------- exercise run ----------------
  let session = null;

  function buildQuestions() {
    const dirFor = () => settings.dir === "mixed" ? (Math.random() < 0.5 ? "de-ro" : "ro-de") : settings.dir;
    if (settings.mode === "words") {
      const pool = shuffle(wordPool());
      return pool.slice(0, settings.count).map((w) => ({ item: w, sentence: false, dir: dirFor() }));
    }
    if (settings.mode === "gaps") {
      return shuffle(gapPool()).slice(0, settings.count).map((g) => ({ item: g, gap: true }));
    }
    return shuffle(learntSentences()).slice(0, settings.count).map((s) => ({ item: s, sentence: true, dir: dirFor() }));
  }

  $("#start-btn").addEventListener("click", startSession);
  $("#again-btn").addEventListener("click", () => { $("#ex-done").classList.add("hidden"); $("#ex-setup").classList.remove("hidden"); });
  $("#quit-btn").addEventListener("click", () => { session = null; $("#ex-run").classList.add("hidden"); $("#ex-setup").classList.remove("hidden"); });

  function startSession() {
    const qs = buildQuestions();
    if (!qs.length) {
      alert(settings.mode === "words" ? "No words for these types yet." :
        settings.mode === "gaps" ? "No fill-in-the-blank sentences for these settings." :
        "No sentences available for these settings.");
      return;
    }
    session = { queue: qs, total: qs.length, done: 0, correct: 0, mistakes: [], retried: new Set(), current: null, answered: false };
    $("#ex-setup").classList.add("hidden");
    $("#ex-done").classList.add("hidden");
    $("#ex-run").classList.remove("hidden");
    nextQuestion();
  }

  function nextQuestion() {
    if (!session.queue.length) return finishSession();
    const q = session.queue.shift();
    session.current = q;
    session.answered = false;
    $("#progress-bar").style.width = (100 * session.done / session.total) + "%";
    setFeedback(null);
    const isGap = !!q.gap;
    $("#answer-choices").classList.toggle("hidden", !isGap);
    $("#q-hint").classList.toggle("hidden", !isGap);
    if (isGap) return showGap(q);
    const fromDe = q.dir === "de-ro";
    const src = fromDe ? q.item.de : q.item.tr;
    q.target = fromDe ? q.item.tr : q.item.de;
    q.targetLang = fromDe ? lang : "de";
    q.promptText = q.sentence ? first(src, true) : src;

    $("#q-label").textContent = `Translate into ${fromDe ? langInfo().english + " " + langInfo().flag : "German 🇩🇪"}`;
    $("#q-prompt").textContent = q.promptText;
    $("#q-type").textContent = q.sentence ? "sentence" : q.item.type;
    $("#q-type").className = "badge badge-" + (q.sentence ? "sentence" : q.item.type);
    $("#progress-bar").style.width = (100 * session.done / session.total) + "%";

    const useBank = q.sentence && $("#use-bank").checked;
    $("#answer-typing").classList.toggle("hidden", useBank);
    $("#answer-bank").classList.toggle("hidden", !useBank);
    const input = $("#answer-input");
    input.value = "";
    input.disabled = false;
    input.placeholder = `Type in ${fromDe ? langInfo().english : "German"}`;
    $("#special-chars").innerHTML = (q.targetLang === "de" ? ["ä", "ö", "ü", "ß"] : langInfo().chars)
      .map((c) => `<button type="button" data-char="${c}">${c}</button>`).join("");
    if (useBank) buildBank(q);
    else setTimeout(() => input.focus(), 0);

  }

  function gapHtml(g, filled, cls) {
    const [before, after] = g.de.split("___");
    const mid = filled ? `<span class="blank ${cls || ""}">${esc(filled)}</span>` : `<span class="blank">&nbsp;</span>`;
    return esc(before) + mid + esc(after);
  }

  function showGap(q) {
    const g = q.item;
    q.choices = shuffle([g.answer, ...g.wrong]);
    q.selected = null;
    q.promptText = g.de;
    $("#q-label").textContent = "Choose the missing word";
    $("#q-prompt").innerHTML = gapHtml(g);
    $("#q-type").textContent = g.kind;
    $("#q-type").className = "badge badge-" + g.kind;
    $("#q-hint").textContent = langInfo().flag + " " + g.hint;
    $("#answer-typing").classList.add("hidden");
    $("#answer-bank").classList.add("hidden");
    $("#answer-choices").innerHTML = q.choices.map((c, i) =>
      `<button type="button" class="choice" data-choice="${i}"><span class="key">${i + 1}</span>${esc(c)}</button>`).join("");
  }

  function selectChoice(i) {
    const q = session && session.current;
    if (!q || !q.gap || session.answered || !q.choices[i]) return;
    q.selected = i;
    $$("#answer-choices .choice").forEach((b) => b.classList.toggle("selected", +b.dataset.choice === i));
    $("#q-prompt").innerHTML = gapHtml(q.item, q.choices[i]);
  }
  $("#answer-choices").addEventListener("click", (e) => {
    const b = e.target.closest("[data-choice]");
    if (b) selectChoice(+b.dataset.choice);
  });

  function checkGap(q) {
    if (q.selected == null) return;
    const g = q.item;
    const given = q.choices[q.selected];
    const ok = given === g.answer;
    session.answered = true;
    $$("#answer-choices .choice").forEach((b) => {
      const c = q.choices[+b.dataset.choice];
      b.disabled = true;
      b.classList.remove("selected");
      if (c === g.answer) b.classList.add("correct");
      else if (+b.dataset.choice === q.selected) b.classList.add("incorrect");
    });
    $("#q-prompt").innerHTML = gapHtml(g, g.answer, ok ? "good" : "bad");
    const full = g.de.replace("___", g.answer);
    if (ok) {
      session.correct++;
      session.done++;
      setFeedback("right", "✔ Correct!", `<div>${esc(full)}</div><div class="muted-light">💡 ${esc(g.rule)}</div>`);
    } else {
      session.mistakes.push({ prompt: g.de, given, right: g.answer });
      if (!session.retried.has(q)) { session.retried.add(q); session.queue.push(q); }
      else session.done++;
      setFeedback("wrong", "✘ Wrong",
        `<div>Correct answer:</div><div class="right-answer">${esc(g.answer)}</div>` +
        `<div>${esc(full)}</div><div>💡 ${esc(g.rule)}</div>`);
    }
    $("#progress-bar").style.width = (100 * session.done / session.total) + "%";
  }

  function buildBank(q) {
    const tokens = first(q.target, true).replace(/[.,!?;:„“"]/g, "").split(/\s+/).filter(Boolean);
    const others = new Set();
    const pool = data.sentences.map((s) => first(q.targetLang === "de" ? s.de : s.tr, true));
    const lowerTokens = new Set(tokens.map((t) => t.toLowerCase()));
    for (const s of shuffle(pool)) {
      for (const w of s.replace(/[.,!?;:„“"]/g, "").split(/\s+/)) {
        if (w && !lowerTokens.has(w.toLowerCase())) others.add(w);
        if (others.size >= 3) break;
      }
      if (others.size >= 3) break;
    }
    const tiles = shuffle(tokens.concat([...others]));
    $("#bank-answer").innerHTML = "";
    $("#bank-pool").innerHTML = tiles.map((t, i) => `<button class="tile" data-i="${i}">${esc(t)}</button>`).join("");
  }
  $("#bank-pool").addEventListener("click", (e) => {
    const t = e.target.closest(".tile");
    if (!t || session.answered || t.classList.contains("used")) return;
    t.classList.add("used");
    const clone = t.cloneNode(true);
    $("#bank-answer").appendChild(clone);
  });
  $("#bank-answer").addEventListener("click", (e) => {
    const t = e.target.closest(".tile");
    if (!t || session.answered) return;
    const orig = $(`#bank-pool .tile[data-i="${t.dataset.i}"]`);
    if (orig) orig.classList.remove("used");
    t.remove();
  });

  $("#special-chars").addEventListener("click", (e) => {
    const b = e.target.closest("[data-char]");
    if (!b) return;
    const inp = $("#answer-input");
    const s = inp.selectionStart, en = inp.selectionEnd;
    inp.value = inp.value.slice(0, s) + b.dataset.char + inp.value.slice(en);
    inp.focus();
    inp.selectionStart = inp.selectionEnd = s + 1;
  });

  function currentAnswer() {
    const q = session.current;
    if (q.sentence && $("#use-bank").checked) return $$("#bank-answer .tile").map((t) => t.textContent).join(" ");
    return $("#answer-input").value;
  }

  function setFeedback(state, title, detail) {
    const fb = $("#feedback");
    fb.className = "feedback" + (state ? " " + state : "");
    $("#fb-title").innerHTML = title || "";
    $("#fb-detail").innerHTML = detail || "";
    $("#check-btn").textContent = state ? "Continue" : "Check";
  }

  function check() {
    if (!session) return;
    if (session.answered) {
      session.done = Math.min(session.done, session.total);
      return nextQuestion();
    }
    const q = session.current;
    if (q.gap) return checkGap(q);
    const ans = currentAnswer();
    if (!ans.trim()) return;
    const res = L.checkAnswer(ans, q.target, q.targetLang, q.sentence, q.sentence ? null : q.item.type);
    session.answered = true;
    $("#answer-input").disabled = true;

    if (res.ok) {
      session.correct++;
      session.done++;
      const extra = res.kind === "correct" ? "" : `<div>${esc(res.note || "")}</div><div>Correct answer: <b>${esc(res.best)}</b></div>`;
      const others = L.splitAlternatives(q.target, q.sentence).filter((a) => a !== res.best);
      const alsoOk = res.kind === "correct" && others.length ? `<div class="muted-light">Also correct: ${others.map(esc).join(" · ")}</div>` : "";
      setFeedback("right", res.kind === "correct" ? "✔ Correct!" : "✔ Almost correct!", extra + alsoOk);
    } else {
      session.mistakes.push({ prompt: q.promptText, given: ans, right: first(q.target, q.sentence) });
      // Like Duolingo: a wrong question comes back once at the end of the lesson.
      if (!session.retried.has(q)) { session.retried.add(q); session.queue.push(q); }
      else session.done++;
      setFeedback("wrong", "✘ Wrong",
        (res.note ? `<div>${esc(res.note)}</div>` : "") +
        `<div>Correct answer:</div><div class="right-answer">${esc(q.sentence ? first(q.target, true) : q.target)}</div>`);
    }
    $("#progress-bar").style.width = (100 * session.done / session.total) + "%";
  }
  $("#check-btn").addEventListener("click", check);
  $("#answer-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); check(); }
  });
  document.addEventListener("keydown", (e) => {
    const q = session && session.current;
    if (q && q.gap && !session.answered) {
      if (/^[1-4]$/.test(e.key)) selectChoice(+e.key - 1);
      else if (e.key === "Enter" && q.selected != null && document.activeElement !== $("#check-btn")) { e.preventDefault(); check(); }
      return;
    }
    if (e.key === "Enter" && session && session.answered && document.activeElement !== $("#check-btn")) { e.preventDefault(); check(); }
  });

  function finishSession() {
    $("#ex-run").classList.add("hidden");
    $("#ex-done").classList.remove("hidden");
    const firstTry = session.total - session.retried.size;
    const pct = Math.round(100 * firstTry / session.total);
    $("#done-title").textContent = pct === 100 ? "🎉 Perfect lesson!" : pct >= 70 ? "👏 Well done!" : "💪 Keep practising!";
    $("#done-score").textContent = `${firstTry} of ${session.total} right on the first try (${pct}%).`;
    $("#done-mistakes").innerHTML = session.mistakes.length
      ? `<h3>Review your mistakes</h3><ul class="mistakes">${session.mistakes.map((m) => `
          <li><div class="muted">${esc(m.prompt)}</div>
          <div><span class="bad">${esc(m.given)}</span> → <span class="good">${esc(m.right)}</span></div></li>`).join("")}</ul>`
      : "";
    session = null;
  }

  // ---------------- settings ----------------
  function renderSettings() {
    $("#lang-options").innerHTML = Object.entries(L.LANGS).map(([code, info]) => `
      <label class="lang-card">
        <input type="radio" name="lang" value="${code}" ${code === lang ? "checked" : ""}>
        <span class="flag">${info.flag}</span>
        <span><b>${esc(info.name)}</b><br><span class="muted">German ↔ ${esc(info.english)}</span></span>
      </label>`).join("");
    $$("#level-options input").forEach((r) => { r.checked = r.value === level; });
    const counts = {};
    let total = 0;
    for (const name of window.Levels.LEVEL_ORDER) {
      total += window.Levels.parseLevel(window.LEVELS[name], name).words.length;
      counts[name] = total;
    }
    $$("#level-options [data-count]").forEach((el) => { el.textContent = counts[el.dataset.count] + " words"; });
    $("#custom-count").textContent = custom.vocab.length;
  }
  $("#lang-options").addEventListener("change", (e) => {
    if (e.target.name !== "lang") return;
    lang = e.target.value;
    store.set(LANG_KEY, lang);
    rebuildData();
    updateLangUI();
    updateAvailable();
    renderVocab();
  });

  // Texts that mention the translation language.
  function updateLangUI() {
    const info = langInfo();
    $("#brand-lang").textContent = `${info.flag} ${info.name}`;
    $("#lang-now").textContent = `${info.flag} ${info.name}`;
    $("#vocab-search").placeholder = `Search German or ${info.english}…`;
    $("#add-word-form [name=tr]").placeholder = `${info.english} translation`;
    document.documentElement.lang = "de";
  }

  $("#level-options").addEventListener("change", (e) => {
    if (e.target.name !== "level") return;
    level = e.target.value;
    store.set(LEVEL_KEY, level);
    rebuildData();
    updateAvailable();
    renderVocab();
  });
  $("#import-backup").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const obj = JSON.parse(await file.text());
      if (!Array.isArray(obj.vocab)) throw new Error("no vocab");
      custom = { vocab: obj.vocab.filter((w) => w.de && (w.tr || w.ro) && L.TYPES.includes(w.type))
        .map((w) => ({ de: w.de, type: w.type, tr: w.tr || { ro: w.ro } })) };
      saveCustom();
      renderSettings();
      alert(`Restored ${custom.vocab.length} of your own words.`);
    } catch (err) { alert("This is not a valid backup file."); }
    e.target.value = "";
  });

  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  $("#export-json").addEventListener("click", () =>
    download("deutsch-my-words.json", JSON.stringify(custom, null, 2), "application/json"));
  $("#reset-btn").addEventListener("click", () => {
    if (!confirm("Delete all the words you added yourself?")) return;
    custom = { vocab: [] };
    saveCustom();
    renderSettings();
  });

  // ---------------- grammar ----------------
  let grammarLevel = "all";
  // Escapes text and turns **bold** into <b>bold</b>.
  const md = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

  function renderGrammar() {
    const q = L.fold($("#grammar-search").value || "");
    const topics = window.GRAMMAR.map((t, i) => ({ ...t, id: "g" + i }))
      .filter((t) => grammarLevel === "all" || t.level === grammarLevel)
      .filter((t) => !q || L.fold([t.title, t.intro, ...t.rules, ...t.examples].join(" ")).includes(q));
    const cats = window.GRAMMAR_CATEGORIES.map((c) => ({ ...c, topics: topics.filter((t) => t.cat === c.id) }))
      .filter((c) => c.topics.length);
    $("#grammar-toc").innerHTML = cats.map((c) => `
      <div class="toc-group"><b>${c.icon} ${esc(c.title)}</b>
        <ul>${c.topics.map((t) => `<li><a href="#${t.id}" data-topic="${t.id}"><span class="lvl lvl-tag">${t.level}</span> ${esc(t.title)}</a></li>`).join("")}</ul>
      </div>`).join("") || `<p class="muted">Keine Treffer.</p>`;
    $("#grammar-list").innerHTML = cats.map((c) => `
      <h2 class="grammar-cat">${c.icon} ${esc(c.title)}</h2>
      ${c.topics.map((t) => `
        <details class="card grammar-topic" id="${t.id}" ${q ? "open" : ""}>
          <summary><span class="lvl-big small">${t.level}</span> <span class="g-title">${esc(t.title)}</span></summary>
          <p class="g-intro">${md(t.intro)}</p>
          <ul class="g-rules">${t.rules.map((r) => `<li>${md(r)}</li>`).join("")}</ul>
          ${t.tables.map((tb) => `
            <div class="table-wrap"><table class="g-table">
              ${tb.caption ? `<caption>${md(tb.caption)}</caption>` : ""}
              <thead><tr>${tb.head.map((h) => `<th>${md(h)}</th>`).join("")}</tr></thead>
              <tbody>${tb.rows.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}</tbody>
            </table></div>`).join("")}
          <div class="g-examples"><b>Beispiele</b><ul>${t.examples.map((x) => `<li>${md(x)}</li>`).join("")}</ul></div>
        </details>`).join("")}`).join("");
  }
  $("#grammar-search").addEventListener("input", renderGrammar);
  $("#grammar-levels").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    grammarLevel = b.dataset.value;
    $$("#grammar-levels button").forEach((x) => x.classList.toggle("active", x === b));
    renderGrammar();
  });
  $("#grammar-toc").addEventListener("click", (e) => {
    const a = e.target.closest("[data-topic]");
    if (!a) return;
    e.preventDefault();
    const el = document.getElementById(a.dataset.topic);
    el.open = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateLangUI();
  renderVocab();
  updateAvailable();
})();
