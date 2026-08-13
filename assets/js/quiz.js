/* ============================================================
   Quiz mode — auto-generates questions from TarotData.
   Modes: meaningToCard, cardToMeaning, keywordToCard,
          cardToKeyword, timed (60s), endless
   ============================================================ */
const QUIZ_MODES = [
  { id: "meaningToCard", icon: "📜", titleKey: "quizMeaningToCard", descKey: "quizMeaningToCardDesc" },
  { id: "cardToMeaning", icon: "🃏", titleKey: "quizCardToMeaning", descKey: "quizCardToMeaningDesc" },
  { id: "keywordToCard", icon: "🔑", titleKey: "quizKeywordToCard", descKey: "quizKeywordToCardDesc" },
  { id: "cardToKeyword", icon: "🏷️", titleKey: "quizCardToKeyword", descKey: "quizCardToKeywordDesc" },
  { id: "timed", icon: "⏱️", titleKey: "quizTimed", descKey: "quizTimedDesc" },
  { id: "endless", icon: "♾️", titleKey: "quizEndless", descKey: "quizEndlessDesc" },
];
const FIXED_LENGTH = 10;
const MIXED_TYPES = ["meaningToCard", "cardToMeaning", "keywordToCard", "cardToKeyword"];

let quizState = null;
let timerHandle = null;

document.addEventListener("DOMContentLoaded", async () => {
  await TarotData.load();
  renderMenu();
  document.addEventListener("langchange", () => {
    if (!quizState) renderMenu();
  });
});

function root() {
  return document.getElementById("quiz-root");
}

function renderMenu() {
  root().innerHTML = `
    <p style="color:var(--ink-soft);margin-bottom:18px;font-size:14px;" data-i18n="quizSub">${I18N.t("quizSub")}</p>
    <div class="quiz-menu">
      ${QUIZ_MODES.map(
        (m) => `
        <button class="panel quiz-mode-card" data-mode="${m.id}">
          <span class="qm-icon">${m.icon}</span>
          <span>
            <h3>${I18N.t(m.titleKey)}</h3>
            <p>${I18N.t(m.descKey)}</p>
          </span>
        </button>`
      ).join("")}
    </div>
  `;
  root()
    .querySelectorAll(".quiz-mode-card")
    .forEach((btn) => btn.addEventListener("click", () => startQuiz(btn.dataset.mode)));
}

/* ---------------- Question generation ---------------- */
function pickDistractorCards(correct, n) {
  const all = TarotData.getAll().filter((c) => c.id !== correct.id);
  shuffle(all);
  return all.slice(0, n);
}
function firstSentence(text, maxLen = 100) {
  if (!text) return "";
  let s = text.split(/(?<=[.!?…])\s/)[0] || text;
  if (s.length > maxLen) s = s.slice(0, maxLen).trim() + "…";
  return s;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateQuestion(type) {
  const cards = TarotData.getAll();
  const correct = cards[Math.floor(Math.random() * cards.length)];

  if (type === "meaningToCard") {
    const snippet = firstSentence((correct.meaning && correct.meaning[0]) || "");
    const distractors = pickDistractorCards(correct, 3);
    const options = shuffle([correct, ...distractors]).map((c) => ({
      key: c.id,
      label: c.name,
      img: TarotData.imagePath(c),
      correct: c.id === correct.id,
    }));
    return { type, promptText: snippet, promptLabel: I18N.t("quizWhichCard"), options, correct, showPromptImg: false };
  }

  if (type === "cardToMeaning") {
    const distractors = pickDistractorCards(correct, 3);
    const correctSnippet = firstSentence((correct.meaning && correct.meaning[0]) || "");
    const options = shuffle([
      { key: correct.id, label: correctSnippet, correct: true },
      ...distractors.map((c) => ({ key: c.id, label: firstSentence((c.meaning && c.meaning[0]) || ""), correct: false })),
    ]);
    return { type, promptLabel: I18N.t("quizWhichMeaning"), options, correct, showPromptImg: true };
  }

  if (type === "keywordToCard") {
    const kw = correct.keywords.length ? correct.keywords[Math.floor(Math.random() * correct.keywords.length)] : correct.name;
    const distractors = pickDistractorCards(correct, 3);
    const options = shuffle([correct, ...distractors]).map((c) => ({
      key: c.id,
      label: c.name,
      img: TarotData.imagePath(c),
      correct: c.id === correct.id,
    }));
    return { type, promptText: `"${kw}"`, promptLabel: I18N.t("quizWhichCard"), options, correct, showPromptImg: false };
  }

  if (type === "cardToKeyword") {
    const kw = correct.keywords.length ? correct.keywords[Math.floor(Math.random() * correct.keywords.length)] : correct.name;
    const distractorCards = pickDistractorCards(correct, 3);
    const distractorKws = distractorCards.map((c) => (c.keywords.length ? c.keywords[Math.floor(Math.random() * c.keywords.length)] : c.name));
    const options = shuffle([
      { key: "c-" + correct.id, label: kw, correct: true },
      ...distractorKws.map((k, i) => ({ key: "d-" + i, label: k, correct: false })),
    ]);
    return { type, promptLabel: I18N.t("quizWhichKeyword"), options, correct, showPromptImg: true };
  }
}

function generateMixedQuestion() {
  const t = MIXED_TYPES[Math.floor(Math.random() * MIXED_TYPES.length)];
  return generateQuestion(t);
}

/* ---------------- Quiz flow ---------------- */
function startQuiz(mode) {
  quizState = {
    mode,
    score: 0,
    answered: 0,
    total: mode === "timed" || mode === "endless" ? Infinity : FIXED_LENGTH,
    current: null,
    timeLeft: 60,
  };
  renderQuestion();
  if (mode === "timed") startTimer();
}

function startTimer() {
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    quizState.timeLeft--;
    const el = document.getElementById("quiz-timer");
    if (el) {
      el.textContent = `${quizState.timeLeft}s`;
      el.classList.toggle("low", quizState.timeLeft <= 10);
    }
    if (quizState.timeLeft <= 0) {
      clearInterval(timerHandle);
      endQuiz();
    }
  }, 1000);
}

function renderQuestion() {
  const isMixed = quizState.mode === "timed" || quizState.mode === "endless";
  const q = isMixed ? generateMixedQuestion() : generateQuestion(quizState.mode);
  quizState.current = q;

  const hud = `
    <div class="quiz-hud">
      <span>${quizState.mode === "endless" ? "♾️" : I18N.t("quizQuestion") + " " + (quizState.answered + 1) + (quizState.total !== Infinity ? "/" + quizState.total : "")}</span>
      ${quizState.mode === "timed" ? `<span class="timer" id="quiz-timer">${quizState.timeLeft}s</span>` : `<span>${I18N.t("quizScore")}: ${quizState.score}</span>`}
    </div>`;

  const promptImgHtml = q.showPromptImg
    ? `<img src="${TarotData.imagePath(q.correct)}" alt="${escapeHtml(q.correct.name)}" />`
    : q.promptText
    ? `<div style="font-size:15px;font-style:italic;margin-bottom:6px;">${escapeHtml(q.promptText)}</div>`
    : "";

  const optionsHtml = q.options
    .map(
      (o) => `<button class="quiz-option panel" data-key="${o.key}" data-correct="${o.correct}">
        ${o.img ? `<img src="${o.img}" alt="" style="width:38px;border-radius:6px;vertical-align:middle;margin-right:8px;" />` : ""}${escapeHtml(o.label)}
      </button>`
    )
    .join("");

  root().innerHTML = `
    ${hud}
    <div class="quiz-stage">
      <div class="panel quiz-prompt">
        ${promptImgHtml}
        <div class="q-label">${q.promptLabel}</div>
      </div>
      <div class="quiz-options" id="quiz-options">${optionsHtml}</div>
      <div class="quiz-footer" id="quiz-footer"></div>
      ${quizState.mode === "endless" ? `<div style="text-align:center;margin-top:18px;"><button class="btn btn-ghost" id="btn-stop-endless">${I18N.t("quizFinish")}</button></div>` : ""}
    </div>
  `;

  document.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => selectOption(btn));
  });
  const stopBtn = document.getElementById("btn-stop-endless");
  if (stopBtn) stopBtn.addEventListener("click", endQuiz);
}

function selectOption(btn) {
  const correct = btn.dataset.correct === "true";
  document.querySelectorAll(".quiz-option").forEach((b) => {
    b.disabled = true;
    if (b.dataset.correct === "true") b.classList.add("correct");
  });
  if (!correct) btn.classList.add("wrong");

  quizState.answered++;
  if (correct) quizState.score++;

  const footer = document.getElementById("quiz-footer");
  const isLast = quizState.total !== Infinity && quizState.answered >= quizState.total;

  if (quizState.mode === "timed") {
    setTimeout(() => {
      if (quizState.timeLeft > 0) renderQuestion();
    }, 450);
    return;
  }

  footer.innerHTML = `<button class="btn btn-primary" id="btn-next">${isLast ? I18N.t("quizFinish") : I18N.t("quizNext")}</button>`;
  document.getElementById("btn-next").addEventListener("click", () => {
    if (isLast) endQuiz();
    else renderQuestion();
  });
}

function endQuiz() {
  clearInterval(timerHandle);
  TarotStorage.logQuizResult(quizState.mode, quizState.score, quizState.answered);
  const { score, answered } = quizState;
  root().innerHTML = `
    <div class="panel quiz-result">
      <div class="eyebrow">${I18N.t("quizResultTitle")}</div>
      <div class="score">${score} / ${answered}</div>
      <p>${I18N.t("quizCorrect")}</p>
      <div class="quiz-result-actions">
        <button class="btn btn-primary" id="btn-again">${I18N.t("quizPlayAgain")}</button>
        <button class="btn btn-ghost" id="btn-menu">${I18N.t("quizBackMenu")}</button>
      </div>
    </div>
  `;
  const mode = quizState.mode;
  document.getElementById("btn-again").addEventListener("click", () => startQuiz(mode));
  document.getElementById("btn-menu").addEventListener("click", () => {
    quizState = null;
    renderMenu();
  });
}
