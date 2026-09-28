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

  // Interface texts (js/i18n.js) follow the translation language.
  const t = (key, vars) => {
    let s = ((window.I18N[lang] || {})[key]) ?? window.I18N.en[key] ?? key;
    for (const [k, v] of Object.entries(vars || {})) s = s.split("{" + k + "}").join(v);
    return s;
  };
  const langName = (code) => (window.I18N_LANG_NAMES[lang] || window.I18N_LANG_NAMES.en)[code];
  const icon = (id, cls = "") => `<svg class="ic ${cls}"><use href="#i-${id}"/></svg>`;

  // Small SVG flags (emoji flags show up as plain letters on Windows).
  const FLAGS = {
    de: '<svg viewBox="0 0 30 18"><path fill="#1A1A1A" d="M0 0h30v6H0z"/><path fill="#DD0000" d="M0 6h30v6H0z"/><path fill="#FFCE00" d="M0 12h30v6H0z"/></svg>',
    ro: '<svg viewBox="0 0 30 20"><path fill="#002B7F" d="M0 0h10v20H0z"/><path fill="#FCD116" d="M10 0h10v20H10z"/><path fill="#CE1126" d="M20 0h10v20H20z"/></svg>',
    fr: '<svg viewBox="0 0 30 20"><path fill="#0055A4" d="M0 0h10v20H0z"/><path fill="#fff" d="M10 0h10v20H10z"/><path fill="#EF4135" d="M20 0h10v20H20z"/></svg>',
    ru: '<svg viewBox="0 0 30 20"><path fill="#fff" d="M0 0h30v7H0z"/><path fill="#0039A6" d="M0 7h30v6H0z"/><path fill="#D52B1E" d="M0 13h30v7H0z"/></svg>',
    uk: '<svg viewBox="0 0 30 20"><path fill="#0057B7" d="M0 0h30v10H0z"/><path fill="#FFD700" d="M0 10h30v10H0z"/></svg>',
    el: '<svg viewBox="0 0 27 18"><path fill="#0D5EAF" d="M0 0h27v18H0z"/><path stroke="#fff" stroke-width="2" d="M10 3h17M10 7h17M0 11h27M0 15h27"/><path fill="#0D5EAF" d="M0 0h10v10H0z"/><path stroke="#fff" stroke-width="2" d="M5 0v10M0 5h10"/></svg>',
    en: '<svg viewBox="0 0 60 30"><g><path fill="#012169" d="M0 0h60v30H0z"/><path stroke="#fff" stroke-width="6" d="M0 0l60 30M60 0 0 30"/><path stroke="#C8102E" stroke-width="2.5" d="M0 0l60 30M60 0 0 30"/><path stroke="#fff" stroke-width="10" d="M30 0v30M0 15h60"/><path stroke="#C8102E" stroke-width="6" d="M30 0v30M0 15h60"/></g></svg>',
  };
  const flag = (code) => `<span class="flag">${FLAGS[code] || ""}</span>`;

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
  const sortDe = (a, b) => a.de.replace(/^(der|die|das|sich) /i, "").localeCompare(b.de.replace(/^(der|die|das|sich) /i, ""), "de");
  const matches = (w, q) => !q || L.fold(w.de).includes(q) || L.fold(w.tr, lang).includes(q);

  // One vocabulary row; the level chip uses the accent colour for words of the current level.
  function wordRow(w) {
    return `<li data-word="${w.level === "mine" ? "mine:" + w.customIndex : esc(w.de) + "|" + w.type}">
      <span class="de">${articleHtml(w.de)}</span>
      <span class="tr">${esc(w.tr)}</span>
      ${w.level === "mine" ? `<button class="icon-btn del" data-del="${w.customIndex}" aria-label="✕">${icon("trash")}</button>`
        : `<span class="lvl${w.level === level ? " current" : ""}">${w.level}</span>`}
      ${icon("chevron", "chev")}
    </li>`;
  }

  function renderVocab() {
    $("#level-now").textContent = level;
    const q = L.fold($("#vocab-search").value || "");
    const groups = $("#vocab-groups");
    groups.innerHTML = "";
    for (const type of L.TYPES) {
      const all = data.vocab.filter((w) => w.type === type);
      if (type === "other" && !all.length) continue;
      const words = all.filter((w) => matches(w, q)).sort(sortDe);
      const card = document.createElement("div");
      card.className = "card group";
      card.innerHTML = `
        <button class="group-head" data-open="${type}" title="${esc(t("g_" + type))}">${icon(type)}
          <span><span class="gh-title">${esc(t("g_" + type))}</span><span class="gh-sub">${esc(t("s_" + type))}</span></span>
          <span class="count">${all.length}</span>${icon("expand", "expand")}
        </button>` +
        (words.length ? `<ul class="words">${words.map(wordRow).join("")}</ul>`
          : `<p class="muted empty">${q ? t("no_matches") : t("no_words")}</p>`);
      groups.appendChild(card);
    }
    $("#basics-list").textContent = L.BASICS.join(", ");
    if (openType) renderPanel();
  }

  // ---------------- one category, full screen ----------------
  let openType = null;
  function openGroup(type) {
    openType = type;
    $("#panel-search").value = $("#vocab-search").value;
    $("#panel-search").placeholder = t("search");
    $("#panel-close").title = t("close");
    $("#group-panel").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    renderPanel();
    $("#panel-search").focus();
  }
  function renderPanel() {
    const all = data.vocab.filter((w) => w.type === openType);
    const q = L.fold($("#panel-search").value || "");
    const words = all.filter((w) => matches(w, q)).sort(sortDe);
    $("#panel-title").innerHTML = `${icon(openType)}<h2>${esc(t("g_" + openType))}</h2><span class="count">${all.length}</span>`;
    $("#panel-words").innerHTML = words.length ? words.map(wordRow).join("") : `<p class="muted empty">${t("no_matches")}</p>`;
  }
  function closeGroup() {
    openType = null;
    $("#group-panel").classList.add("hidden");
    document.body.style.overflow = "";
  }
  $("#panel-search").addEventListener("input", renderPanel);
  $("#panel-close").addEventListener("click", closeGroup);
  $("#panel-words").addEventListener("click", (e) => {
    const del = e.target.closest("[data-del]");
    const row = e.target.closest("[data-word]");
    if (del) return deleteMine(+del.dataset.del);
    if (row) openWord(row.dataset.word);
  });
  function articleHtml(de) {
    const m = de.match(/^(der|die|das)\s+(.*)$/i);
    if (!m) return esc(de);
    return `<span class="art art-${m[1].toLowerCase()}">${esc(m[1])}</span> ${esc(m[2])}`;
  }

  $("#vocab-search").addEventListener("input", renderVocab);
  $("#vocab-groups").addEventListener("click", (e) => {
    const head = e.target.closest("[data-open]");
    const del = e.target.closest("[data-del]");
    const row = e.target.closest("[data-word]");
    if (head) return openGroup(head.dataset.open);
    if (del) return deleteMine(+del.dataset.del);
    if (row) openWord(row.dataset.word);
  });
  function deleteMine(i) {
    const w = custom.vocab[i];
    if (w && confirm(t("confirm_delete", { x: w.de }))) {
      custom.vocab.splice(i, 1);
      saveCustom();
      renderVocab();
    }
  }
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

  // ---------------- word details ----------------
  function openWord(key) {
    let w;
    if (key.startsWith("mine:")) {
      const c = custom.vocab[+key.slice(5)];
      w = c && { de: c.de, type: c.type, tr: c.tr, level: "mine" };
    } else {
      const [de, type] = key.split("|");
      w = window.Levels.loadLevel("C1", window.LEVELS).vocab.find((x) => x.de === de && x.type === type);
    }
    if (!w) return;
    const rows = Object.entries(L.LANGS).filter(([code]) => w.tr[code]).map(([code, info]) => `
      <li class="${code === lang ? "current" : ""}">${flag(code)}<span class="muted">${esc(info.name)}</span><span>${esc(w.tr[code])}</span></li>`).join("");
    $("#modal-body").innerHTML = `
      <h2>${articleHtml(w.de)}</h2>
      <div class="meta"><span class="badge">${esc(t("t_" + w.type))}</span>${w.level !== "mine" ? `<span class="lvl${w.level === level ? " current" : ""}">${w.level}</span>` : ""}</div>
      <h3>${esc(t("all_translations"))}</h3>
      <ul class="tr-list">${rows}</ul>
      ${w.forms ? `<h3 style="margin-top:16px">${esc(t("forms"))}</h3><p class="muted">${w.forms.map(esc).join(", ")}</p>` : ""}`;
    $("#modal-close").title = t("close");
    $("#word-modal").classList.remove("hidden");
  }
  const closeModal = () => $("#word-modal").classList.add("hidden");
  $("#modal-close").addEventListener("click", closeModal);
  $("#word-modal").addEventListener("click", (e) => { if (e.target.id === "word-modal") closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!langMenu.classList.contains("hidden")) return toggleLangMenu(false);
    if (!$("#word-modal").classList.contains("hidden")) closeModal();
    else if (openType) closeGroup();
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
    $("#scope-all").textContent = t("scope_all", { lvl: level });
    $("#scope-level").textContent = t("scope_level", { lvl: level });
    $$(".lang-name").forEach((el) => { el.textContent = langName(lang); });
    $$(".lang-de").forEach((el) => { el.textContent = langName("de"); });
    let msg;
    if (isWords) msg = t("av_words", { n: wordPool().length, lvl: level });
    else if (isGaps) msg = t("av_gaps", { n: gapPool().length, lvl: level });
    else msg = t("av_sentences", { n: learntSentences().length, lvl: level });
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
      alert(t(settings.mode === "words" ? "no_words_types" : settings.mode === "gaps" ? "no_gaps" : "no_sentences"));
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
    showProgress();
    setFeedback(null);
    const isGap = !!q.gap;
    $("#answer-choices").classList.toggle("hidden", !isGap);
    $("#q-hint").classList.toggle("hidden", !isGap);
    $("#q-prompt").classList.toggle("long", isGap || !!q.sentence);
    if (isGap) return showGap(q);
    const fromDe = q.dir === "de-ro";
    const src = fromDe ? q.item.de : q.item.tr;
    q.target = fromDe ? q.item.tr : q.item.de;
    q.targetLang = fromDe ? lang : "de";
    q.promptText = q.sentence ? first(src, true) : src;

    $("#q-label").innerHTML = esc(t("translate_into", { x: fromDe ? langName(lang) : langName("de") })) + " " + flag(fromDe ? lang : "de");
    $("#q-prompt").textContent = q.promptText;
    $("#q-type").textContent = q.sentence ? t("b_sentence") : t("t_" + q.item.type);
    $("#q-type").className = "badge badge-" + (q.sentence ? "sentence" : q.item.type);
    showProgress();

    const useBank = q.sentence && $("#use-bank").checked;
    $("#answer-typing").classList.toggle("hidden", useBank);
    $("#answer-bank").classList.toggle("hidden", !useBank);
    const input = $("#answer-input");
    input.value = "";
    input.disabled = false;
    input.placeholder = t("type_in", { x: langName(fromDe ? lang : "de") });
    input.classList.toggle("single", !q.sentence);
    input.rows = q.sentence ? 3 : 1;
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
    $("#q-label").textContent = t("choose_missing");
    $("#q-prompt").innerHTML = gapHtml(g);
    $("#q-type").textContent = g.kind === "connector" ? t("t_connector") : t("b_preposition");
    $("#q-type").className = "badge badge-" + g.kind;
    $("#q-hint").innerHTML = flag(lang) + " " + esc(g.hint);
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
      setFeedback("right", t("correct"), `<div>${esc(full)}</div><div class="rule">${icon("bulb")}${esc(g.rule)}</div>`);
    } else {
      session.mistakes.push({ prompt: g.de, given, right: g.answer });
      if (!session.retried.has(q)) { session.retried.add(q); session.queue.push(q); }
      else session.done++;
      setFeedback("wrong", t("wrong"),
        `<div>${esc(t("correct_answer"))}</div><div class="right-answer">${esc(g.answer)}</div>` +
        `<div>${esc(full)}</div><div class="rule">${icon("bulb")}${esc(g.rule)}</div>`);
    }
    showProgress();
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

  function showProgress() {
    $("#progress-bar").style.width = (100 * session.done / session.total) + "%";
    $("#run-count").textContent = `${Math.min(session.done + 1, session.total)} / ${session.total}`;
  }

  function setFeedback(state, title, detail) {
    const fb = $("#feedback");
    fb.className = "feedback" + (state ? " " + state : "");
    $("#fb-title").innerHTML = state ? icon(state === "right" ? "check" : "x") + esc(title) : "";
    $("#fb-detail").innerHTML = detail || "";
    $("#check-btn").textContent = state ? t("continue") : t("check");
  }

  // Short hint about why an answer was only almost right (or which article was wrong).
  function noteText(res) {
    if (res.kind === "accent") return t("note_accent");
    if (res.kind === "typo") return t("note_typo");
    if (res.kind === "article") return t("note_article", { x: res.best });
    if (res.art) return t("note_wrong_article", { x: res.art });
    return "";
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
      const extra = res.kind === "correct" ? "" : `<div>${esc(noteText(res))}</div><div>${esc(t("correct_answer"))} <b>${esc(res.best)}</b></div>`;
      const others = L.splitAlternatives(q.target, q.sentence).filter((a) => a !== res.best);
      const alsoOk = res.kind === "correct" && others.length ? `<div class="muted-light">${esc(t("also_correct"))} ${others.map(esc).join(" · ")}</div>` : "";
      setFeedback("right", res.kind === "correct" ? t("correct") : t("almost"), extra + alsoOk);
    } else {
      session.mistakes.push({ prompt: q.promptText, given: ans, right: first(q.target, q.sentence) });
      // Like Duolingo: a wrong question comes back once at the end of the lesson.
      if (!session.retried.has(q)) { session.retried.add(q); session.queue.push(q); }
      else session.done++;
      setFeedback("wrong", t("wrong"),
        (noteText(res) ? `<div>${esc(noteText(res))}</div>` : "") +
        `<div>${esc(t("correct_answer"))}</div><div class="right-answer">${esc(q.sentence ? first(q.target, true) : q.target)}</div>`);
    }
    showProgress();
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
    $("#done-title").textContent = t(pct === 100 ? "done_perfect" : pct >= 70 ? "done_good" : "done_keep");
    $("#done-score").textContent = t("done_score", { n: firstTry, x: session.total, p: pct });
    $("#done-mistakes").innerHTML = session.mistakes.length
      ? `<h3>${esc(t("review"))}</h3><ul class="mistakes">${session.mistakes.map((m) => `
          <li><div class="muted">${esc(m.prompt)}</div>
          <div><span class="m-bad">${esc(m.given)}</span> → <span class="m-good">${esc(m.right)}</span></div></li>`).join("")}</ul>`
      : "";
    session = null;
  }

  // ---------------- settings ----------------
  function renderSettings() {
    $("#lang-options").innerHTML = langItems("radio");
    $$("#level-options input").forEach((r) => { r.checked = r.value === level; });
    const counts = {};
    let total = 0;
    for (const name of window.Levels.LEVEL_ORDER) {
      total += window.Levels.parseLevel(window.LEVELS[name], name).words.length;
      counts[name] = total;
    }
    $$("#level-options [data-count]").forEach((el) => { el.textContent = t("n_words", { n: counts[el.dataset.count] }); });
    $("#custom-count").textContent = custom.vocab.length;
  }
  // The same list is used in Settings (radio buttons) and in the top-bar menu (buttons).
  function langItems(kind) {
    return Object.entries(L.LANGS).map(([code, info]) => kind === "radio"
      ? `<label class="lang-chip"><input type="radio" name="lang" value="${code}" ${code === lang ? "checked" : ""}>${flag(code)}<span>${esc(info.name)}</span></label>`
      : `<button class="lang-item${code === lang ? " current" : ""}" role="menuitemradio" aria-checked="${code === lang}" data-lang="${code}">${flag(code)}<span>${esc(info.name)}</span>${code === lang ? icon("check") : ""}</button>`).join("");
  }
  function setLang(code) {
    if (!L.LANGS[code] || code === lang) return;
    lang = code;
    store.set(LANG_KEY, lang);
    rebuildData();
    updateLangUI();
    updateAvailable();
    renderVocab();
    renderSettings();
    if ($("#view-grammar").classList.contains("active")) renderGrammar();
  }
  $("#lang-options").addEventListener("change", (e) => { if (e.target.name === "lang") setLang(e.target.value); });

  // Top-bar language menu
  const langMenu = $("#lang-menu");
  function toggleLangMenu(open) {
    const show = open ?? langMenu.classList.contains("hidden");
    if (show) {
      langMenu.innerHTML = langItems("menu");
      const r = $("#lang-btn").getBoundingClientRect();
      langMenu.style.top = r.bottom + 8 + "px";
      langMenu.style.right = Math.max(8, innerWidth - r.right) + "px";
    }
    langMenu.classList.toggle("hidden", !show);
    $("#lang-btn").setAttribute("aria-expanded", show);
    if (show) langMenu.querySelector(".current").focus();
  }
  $("#lang-btn").addEventListener("click", (e) => { e.stopPropagation(); toggleLangMenu(); });
  langMenu.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang]");
    if (!b) return;
    setLang(b.dataset.lang);
    toggleLangMenu(false);
    $("#lang-btn").focus();
  });
  document.addEventListener("click", (e) => { if (!langMenu.contains(e.target)) toggleLangMenu(false); });

  // Puts all interface texts into the selected language.
  function updateLangUI() {
    const info = langInfo();
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $("#brand-lang").textContent = info.name;
    $("#lang-now").innerHTML = flag(lang) + `<span class="lang-now-name">${esc(info.name)}</span>`;
    $("#lang-btn").title = info.name;
    $("#vocab-search").placeholder = t("search");
    if (!session) $("#check-btn").textContent = t("check");
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
      alert(t("restored", { n: custom.vocab.length }));
    } catch (err) { alert(t("bad_backup")); }
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
    if (!confirm(t("confirm_delete_mine"))) return;
    custom = { vocab: [] };
    saveCustom();
    renderSettings();
  });

  // ---------------- grammar ----------------
  let grammarLevel = "all";
  const CAT_ICONS = { verben: "verb", nomen: "noun", pronomen: "person", adjektive: "adverb", praepositionen: "pin", satzbau: "connector" };
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
      <div class="toc-group"><b>${icon(CAT_ICONS[c.id])} ${esc(c.title)}</b>
        <ul>${c.topics.map((t) => `<li><a href="#${t.id}" data-topic="${t.id}"><span class="lvl${t.level === level ? " current" : ""}">${t.level}</span> ${esc(t.title)}</a></li>`).join("")}</ul>
      </div>`).join("") || `<p class="muted">Keine Treffer.</p>`;
    $("#grammar-list").innerHTML = cats.map((c) => `
      <h2 class="grammar-cat">${icon(CAT_ICONS[c.id])} ${esc(c.title)}</h2>
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
  renderSettings();
})();
