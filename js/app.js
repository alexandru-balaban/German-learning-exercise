(function () {
  "use strict";
  const L = window.Lang;
  const STORE_KEY = "deutsch-lernen.data.v1";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const first = (text, isSentence) => L.splitAlternatives(text, isSentence)[0] || text;

  const TYPE_LABELS = { verb: "Verbs", noun: "Nouns", adverb: "Adverbs", connector: "Connectors", other: "Other" };
  const TYPE_ICONS = { verb: "🏃", noun: "📦", adverb: "⏱️", connector: "🔗", other: "✳️" };

  // ---------------- data ----------------
  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (saved && Array.isArray(saved.vocab)) return saved;
    } catch (e) { /* storage unavailable */ }
    return JSON.parse(JSON.stringify(window.SEED));
  }
  function saveData() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }
  let data = loadData();

  // ---------------- speech ----------------
  function speak(text, lang) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "de" ? "de-DE" : "ro-RO";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  // ---------------- tabs ----------------
  function showView(name) {
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === name));
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
    if (name === "vocab") renderVocab();
    if (name === "exercises") updateAvailable();
  }
  $$(".tab").forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goto]");
    if (g) { e.preventDefault(); showView(g.dataset.goto); }
  });

  // ---------------- vocabulary page ----------------
  function renderVocab() {
    $("#sample-banner").classList.toggle("hidden", !data.sample);
    const q = L.fold($("#vocab-search").value || "");
    const groups = $("#vocab-groups");
    groups.innerHTML = "";
    const counts = [];
    for (const type of L.TYPES) {
      const all = data.vocab.map((w, i) => ({ ...w, i })).filter((w) => w.type === type);
      if (type === "other" && !all.length) continue;
      counts.push(`<span>${TYPE_ICONS[type]} ${all.length} ${TYPE_LABELS[type].toLowerCase()}</span>`);
      const words = all
        .filter((w) => !q || L.fold(w.de).includes(q) || L.fold(w.ro).includes(q))
        .sort((a, b) => a.de.replace(/^(der|die|das|sich) /i, "").localeCompare(b.de.replace(/^(der|die|das|sich) /i, ""), "de"));
      const card = document.createElement("div");
      card.className = "card group group-" + type;
      card.innerHTML = `<h3>${TYPE_ICONS[type]} ${TYPE_LABELS[type]} <span class="count">${all.length}</span></h3>` +
        (words.length ? `<ul class="words">${words.map((w) => `
          <li>
            <button class="icon-btn small" data-speak="${esc(w.de)}" title="Listen">🔊</button>
            <span class="de">${articleHtml(w.de)}</span>
            <span class="ro">${esc(w.ro)}</span>
            <button class="icon-btn small del" data-del="${w.i}" title="Delete">🗑</button>
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
    const sp = e.target.closest("[data-speak]");
    if (sp) return speak(first(sp.dataset.speak), "de");
    const del = e.target.closest("[data-del]");
    if (del) {
      const w = data.vocab[+del.dataset.del];
      if (w && confirm(`Delete “${w.de} – ${w.ro}”?`)) {
        data.vocab.splice(+del.dataset.del, 1);
        saveData();
        renderVocab();
      }
    }
  });
  $("#add-word-btn").addEventListener("click", () => $("#add-word-form").classList.toggle("hidden"));
  $("#add-word-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    data.vocab.push({ de: f.de.value.trim(), ro: f.ro.value.trim(), type: f.type.value });
    saveData();
    f.de.value = f.ro.value = "";
    f.de.focus();
    renderVocab();
  });

  // ---------------- exercise setup ----------------
  const settings = { mode: "words", dir: "de-ro", count: 10 };
  $$(".seg").forEach((seg) => seg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", seg).forEach((x) => x.classList.toggle("active", x === b));
    settings[seg.dataset.name] = seg.dataset.name === "count" ? +b.dataset.value : b.dataset.value;
    updateAvailable();
  }));
  $$("#field-types input").forEach((c) => c.addEventListener("change", updateAvailable));

  function selectedTypes() { return $$("#field-types input:checked").map((c) => c.value); }

  function learntSentences() {
    const known = L.buildKnownSet(data.vocab);
    return data.sentences.filter((s) => L.unknownWords(s.de, known).length === 0);
  }

  function updateAvailable() {
    const isWords = settings.mode === "words";
    $("#field-types").classList.toggle("hidden", !isWords);
    $("#field-bank").classList.toggle("hidden", isWords);
    let msg;
    if (isWords) {
      const n = data.vocab.filter((w) => selectedTypes().includes(w.type)).length;
      msg = `${n} words available.`;
    } else {
      const ok = learntSentences().length;
      const skipped = data.sentences.length - ok;
      msg = `${ok} sentences use only words you have learnt.` +
        (skipped ? ` (${skipped} hidden because they contain words not in your vocabulary yet.)` : "");
    }
    $("#ex-available").textContent = msg;
  }

  // ---------------- exercise run ----------------
  let session = null;

  function buildQuestions() {
    const dirFor = () => settings.dir === "mixed" ? (Math.random() < 0.5 ? "de-ro" : "ro-de") : settings.dir;
    if (settings.mode === "words") {
      const pool = shuffle(data.vocab.filter((w) => selectedTypes().includes(w.type)));
      return pool.slice(0, settings.count).map((w) => ({ item: w, sentence: false, dir: dirFor() }));
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
        "No sentences use only your learnt words yet. Import more lessons or add words.");
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
    const fromDe = q.dir === "de-ro";
    const src = fromDe ? q.item.de : q.item.ro;
    q.target = fromDe ? q.item.ro : q.item.de;
    q.targetLang = fromDe ? "ro" : "de";
    q.srcLang = fromDe ? "de" : "ro";
    q.promptText = q.sentence ? first(src, true) : src;

    $("#q-label").textContent = `Translate into ${fromDe ? "Romanian 🇷🇴" : "German 🇩🇪"}`;
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
    input.placeholder = `Type in ${fromDe ? "Romanian" : "German"}`;
    $("#special-chars").innerHTML = (q.targetLang === "de" ? ["ä", "ö", "ü", "ß"] : ["ă", "â", "î", "ș", "ț"])
      .map((c) => `<button type="button" data-char="${c}">${c}</button>`).join("");
    if (useBank) buildBank(q);
    else setTimeout(() => input.focus(), 0);

    setFeedback(null);
    if (q.srcLang === "de") speak(first(q.promptText), "de");
  }

  function buildBank(q) {
    const tokens = first(q.target, true).replace(/[.,!?;:„“"]/g, "").split(/\s+/).filter(Boolean);
    const others = new Set();
    const pool = q.targetLang === "de" ? data.sentences.map((s) => first(s.de, true)) : data.sentences.map((s) => first(s.ro, true));
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

  $("#speak-btn").addEventListener("click", () => {
    const q = session && session.current;
    if (q) speak(first(q.promptText), q.srcLang);
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
    const ans = currentAnswer();
    if (!ans.trim()) return;
    const res = L.checkAnswer(ans, q.target, q.targetLang, q.sentence);
    session.answered = true;
    $("#answer-input").disabled = true;

    if (res.ok) {
      session.correct++;
      session.done++;
      const extra = res.kind === "correct" ? "" : `<div>${esc(res.note || "")}</div><div>Correct answer: <b>${esc(res.best)}</b></div>`;
      const others = L.splitAlternatives(q.target, q.sentence).filter((a) => a !== res.best);
      const alsoOk = res.kind === "correct" && others.length ? `<div class="muted-light">Also correct: ${others.map(esc).join(" · ")}</div>` : "";
      setFeedback("right", res.kind === "correct" ? "✔ Correct!" : "✔ Almost correct!", extra + alsoOk);
      if (q.targetLang === "de") speak(first(res.best, q.sentence), "de");
    } else {
      session.mistakes.push({ prompt: q.promptText, given: ans, right: first(q.target, q.sentence) });
      // Like Duolingo: a wrong question comes back once at the end of the lesson.
      if (!session.retried.has(q)) { session.retried.add(q); session.queue.push(q); }
      else session.done++;
      setFeedback("wrong", "✘ Wrong",
        (res.note ? `<div>${esc(res.note)}</div>` : "") +
        `<div>Correct answer:</div><div class="right-answer">${esc(q.sentence ? first(q.target, true) : q.target)}</div>`);
      if (q.targetLang === "de") speak(first(q.target, q.sentence), "de");
    }
    $("#progress-bar").style.width = (100 * session.done / session.total) + "%";
  }
  $("#check-btn").addEventListener("click", check);
  $("#answer-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); check(); }
  });
  document.addEventListener("keydown", (e) => {
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

  // ---------------- import ----------------
  let preview = [];
  $("#import-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (/\.json$/i.test(file.name)) {
      try {
        const obj = JSON.parse(text);
        if (!Array.isArray(obj.vocab)) throw new Error("no vocab");
        if (confirm(`Restore backup with ${obj.vocab.length} words and ${(obj.sentences || []).length} sentences? This replaces your current data.`)) {
          data = { sample: false, vocab: obj.vocab, sentences: obj.sentences || [] };
          saveData();
          alert("Backup restored.");
          showView("vocab");
        }
      } catch (err) { alert("This is not a valid backup file."); }
      e.target.value = "";
      return;
    }
    $("#import-text").value = text;
    $("#import-text").dataset.csv = /\.csv$/i.test(file.name) ? "1" : "";
    runParse();
  });
  $("#parse-btn").addEventListener("click", runParse);

  function runParse() {
    const text = $("#import-text").value;
    preview = L.parseChat(text, $("#import-text").dataset.csv === "1");
    const have = new Set(data.vocab.map((w) => L.norm(w.de)).concat(data.sentences.map((s) => L.norm(s.de))));
    preview.forEach((p) => { p.exists = !data.sample && have.has(L.norm(p.de)); p.include = !p.exists; });
    const box = $("#import-preview");
    box.classList.remove("hidden");
    $("#preview-title").textContent = preview.length
      ? `Found ${preview.filter((p) => p.type !== "sentence").length} words and ${preview.filter((p) => p.type === "sentence").length} sentences`
      : "Nothing found. Make sure lines look like “der Hund - câinele”.";
    const opts = L.TYPES.concat("sentence");
    $("#preview-body").innerHTML = preview.map((p, i) => `
      <tr class="${p.exists ? "exists" : ""}">
        <td><input type="checkbox" data-i="${i}" data-f="include" ${p.include ? "checked" : ""}></td>
        <td><input value="${esc(p.de)}" data-i="${i}" data-f="de"></td>
        <td><input value="${esc(p.ro)}" data-i="${i}" data-f="ro"></td>
        <td><select data-i="${i}" data-f="type">${opts.map((o) => `<option value="${o}" ${o === p.type ? "selected" : ""}>${o}</option>`).join("")}</select>
            ${p.exists ? '<span class="muted">already saved</span>' : ""}</td>
      </tr>`).join("");
    $("#save-import-btn").classList.toggle("hidden", !preview.length);
  }
  $("#preview-body").addEventListener("change", (e) => {
    const el = e.target;
    const p = preview[+el.dataset.i];
    if (!p) return;
    p[el.dataset.f] = el.type === "checkbox" ? el.checked : el.value;
  });
  $("#save-import-btn").addEventListener("click", () => {
    const chosen = preview.filter((p) => p.include && p.de.trim() && p.ro.trim());
    if (!chosen.length) return alert("Nothing selected.");
    if (data.sample && $("#replace-sample").checked) data = { sample: false, vocab: [], sentences: [] };
    data.sample = false;
    let w = 0, s = 0;
    for (const p of chosen) {
      if (p.type === "sentence") { data.sentences.push({ de: p.de.trim(), ro: p.ro.trim() }); s++; }
      else { data.vocab.push({ de: p.de.trim(), ro: p.ro.trim(), type: p.type }); w++; }
    }
    saveData();
    alert(`Saved ${w} words and ${s} sentences.`);
    $("#import-preview").classList.add("hidden");
    $("#import-text").value = "";
    showView("vocab");
  });

  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  $("#export-json").addEventListener("click", () =>
    download("deutsch-backup.json", JSON.stringify({ vocab: data.vocab, sentences: data.sentences }, null, 2), "application/json"));
  $("#export-datajs").addEventListener("click", () =>
    download("data.js", "// Vocabulary exported from the site.\nwindow.SEED = " +
      JSON.stringify({ sample: false, vocab: data.vocab, sentences: data.sentences }, null, 2) + ";\n", "text/javascript"));
  $("#reset-btn").addEventListener("click", () => {
    if (!confirm("Delete all your saved words in this browser and go back to the default data?")) return;
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    data = loadData();
    showView("vocab");
  });

  renderVocab();
  updateAvailable();
})();
