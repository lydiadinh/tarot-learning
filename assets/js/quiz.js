/* ============================================================
   quiz.js
   Every question is generated dynamically from TarotData.
   Nothing about card content is hardcoded here.
   ============================================================ */

(async function () {
  const root = document.getElementById("quiz-root");
  let allCards = [];

  try {
    allCards = await TarotData.load();
  } catch (e) {
    root.innerHTML = `<div class="empty-state">${TarotIcons.svg("close")}<p>${TarotUI.t("errorLoad")}</p></div>`;
    return;
  }

  const MODES = [
    { id: "meaningToCard", icon: "book", labelKey: "quizMeaningToCard" },
    { id: "cardToMeaning", icon: "upright", labelKey: "quizCardToMeaning" },
    { id: "keywordToCard", icon: "tag", labelKey: "quizKeywordToCard" },
    { id: "cardToKeyword", icon: "key", labelKey: "quizCardToKeyword" },
    { id: "timed", icon: "timer", labelKey: "quizTimed" },
    { id: "endless", icon: "infinity", labelKey: "quizEndless" },
  ];
  const BASE_TYPES = ["meaningToCard", "cardToMeaning", "keywordToCard", "cardToKeyword"];

  let session = null; // active quiz session state
  let timerHandle = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function truncate(text, n) {
    const clean = (text || "").trim();
    return clean.length > n ? clean.slice(0, n).trim() + "..." : clean;
  }

  function pickDistractorCards(correct, n) {
    return shuffle(allCards.filter((c) => c.id !== correct.id)).slice(0, n);
  }

  function cardsWithKeywords() {
    return allCards.filter((c) => c.keywords.length);
  }

  function buildQuestion(type) {
    const pool = type === "keywordToCard" || type === "cardToKeyword" ? cardsWithKeywords() : allCards;
    const correct = pool[Math.floor(Math.random() * pool.length)];

    if (type === "meaningToCard") {
      const options = shuffle([correct, ...pickDistractorCards(correct, 3)]);
      return {
        type,
        promptText: truncate(correct.meaning, 260),
        options: options.map((c) => ({ cardId: c.id, image: c.image, label: c.name, correct: c.id === correct.id })),
        imageOptions: true,
        correctCardId: correct.id,
      };
    }

    if (type === "cardToMeaning") {
      const distractors = pickDistractorCards(correct, 3);
      const options = shuffle([
        { text: truncate(correct.meaning, 110), correct: true },
        ...distractors.map((c) => ({ text: truncate(c.meaning, 110), correct: false })),
      ]);
      return {
        type,
        promptImage: correct.image,
        promptText: correct.name,
        options,
        imageOptions: false,
        correctCardId: correct.id,
      };
    }

    if (type === "keywordToCard") {
      const keyword = correct.keywords[Math.floor(Math.random() * correct.keywords.length)];
      const options = shuffle([correct, ...pickDistractorCards(correct, 3)]);
      return {
        type,
        promptText: `"${keyword}"`,
        options: options.map((c) => ({ cardId: c.id, image: c.image, label: c.name, correct: c.id === correct.id })),
        imageOptions: true,
        correctCardId: correct.id,
      };
    }

    // cardToKeyword
    const correctKeyword = correct.keywords[Math.floor(Math.random() * correct.keywords.length)];
    const distractorPool = cardsWithKeywords().filter((c) => c.id !== correct.id);
    const distractorKeywords = shuffle(distractorPool)
      .slice(0, 3)
      .map((c) => c.keywords[Math.floor(Math.random() * c.keywords.length)]);
    const options = shuffle([
      { text: correctKeyword, correct: true },
      ...distractorKeywords.map((k) => ({ text: k, correct: false })),
    ]);
    return {
      type,
      promptImage: correct.image,
      promptText: correct.name,
      options,
      imageOptions: false,
      correctCardId: correct.id,
    };
  }

  function pickType(mode) {
    if (mode === "timed" || mode === "endless") {
      return BASE_TYPES[Math.floor(Math.random() * BASE_TYPES.length)];
    }
    return mode;
  }

  /* ---------------- Mode picker screen ---------------- */

  function renderModePicker() {
    stopTimer();
    root.innerHTML = `
      <p style="text-align:center;font-weight:700;color:var(--ink-soft);margin-bottom:22px;" data-i18n="quizPickMode">${TarotUI.t("quizPickMode")}</p>
      <div class="mode-grid" id="mode-grid"></div>
    `;
    const grid = document.getElementById("mode-grid");
    grid.innerHTML = MODES.map(
      (m) => `
      <button class="mode-card" data-mode="${m.id}">
        <span class="mode-icon">${TarotIcons.svg(m.icon)}</span>
        <span>
          <span class="mode-title">${TarotUI.t(m.labelKey)}</span>
          <span class="mode-desc">${m.id === "timed" ? "60s" : m.id === "endless" ? "&infin;" : TarotUI.t("quizFourOptions")}</span>
        </span>
      </button>`
    ).join("");
    grid.querySelectorAll(".mode-card").forEach((btn) => {
      btn.addEventListener("click", () => startSession(btn.dataset.mode));
    });
  }

  /* ---------------- Active session ---------------- */

  function startSession(mode) {
    session = {
      mode,
      score: 0,
      total: 0,
      mistakes: [],
      timeLeft: mode === "timed" ? 60 : null,
      finished: false,
    };
    if (mode === "timed") startTimer();
    renderQuestion();
  }

  function startTimer() {
    stopTimer();
    timerHandle = setInterval(() => {
      session.timeLeft--;
      updateTimerChip();
      if (session.timeLeft <= 0) {
        stopTimer();
        finishSession();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = null;
  }

  function updateTimerChip() {
    const chip = document.getElementById("timer-chip");
    if (!chip) return;
    chip.querySelector("span:last-child").textContent = session.timeLeft + "s";
    chip.classList.toggle("timer-warn", session.timeLeft <= 10);
  }

  function renderHud() {
    const timerHtml =
      session.mode === "timed"
        ? `<div class="hud-chip" id="timer-chip">${TarotIcons.svg("timer")}<span>${TarotUI.t("quizTimeLeft")}</span><span>${session.timeLeft}s</span></div>`
        : "";
    return `
      <div class="quiz-hud">
        <div class="hud-chip">${TarotIcons.svg("star")}<span>${TarotUI.t("quizScore")}: ${session.score}/${session.total}</span></div>
        ${timerHtml}
        <button class="btn btn-ghost btn-sm" id="quit-btn">${TarotIcons.svg("close")}<span data-i18n="quizQuit">${TarotUI.t("quizQuit")}</span></button>
      </div>`;
  }

  function renderQuestion() {
    const type = pickType(session.mode);
    const q = buildQuestion(type);
    session.currentQuestion = q;

    let promptHtml = "";
    if (q.promptImage) {
      promptHtml += `<div class="quiz-question-image"><img src="${q.promptImage}" alt="" /></div>`;
    }
    promptHtml += `<p class="quiz-question-text">${q.promptText}</p>`;

    let optionsHtml = "";
    if (q.imageOptions) {
      optionsHtml = `<div class="quiz-options image-grid">${q.options
        .map(
          (o, i) => `<button class="quiz-option-image" data-index="${i}">
            <img src="${o.image}" alt="" />
            <span>${o.label}</span>
          </button>`
        )
        .join("")}</div>`;
    } else {
      optionsHtml = `<div class="quiz-options">${q.options
        .map((o, i) => `<button class="quiz-option" data-index="${i}">${o.text}</button>`)
        .join("")}</div>`;
    }

    root.innerHTML = `
      ${renderHud()}
      <div class="quiz-card" data-suit="${TarotData.get(q.correctCardId).suit}">
        ${promptHtml}
        ${optionsHtml}
        <p class="quiz-feedback" id="quiz-feedback"></p>
      </div>
    `;

    document.getElementById("quit-btn").addEventListener("click", finishSession);
    const optionEls = root.querySelectorAll(".quiz-option, .quiz-option-image");
    optionEls.forEach((el) => {
      el.addEventListener("click", () => handleAnswer(el, parseInt(el.dataset.index, 10), q, optionEls));
    });
  }

  function handleAnswer(el, index, q, optionEls) {
    optionEls.forEach((o) => (o.disabled = true));
    const chosen = q.options[index];
    const feedback = document.getElementById("quiz-feedback");
    session.total++;

    if (chosen.correct) {
      session.score++;
      el.classList.add("is-correct");
      feedback.textContent = TarotUI.t("quizCorrect");
      feedback.className = "quiz-feedback correct";
    } else {
      el.classList.add("is-wrong");
      const correctCard = TarotData.get(q.correctCardId);
      feedback.textContent = `${TarotUI.t("quizWrong")} ${correctCard.name}`;
      feedback.className = "quiz-feedback wrong";
      optionEls.forEach((o, i) => {
        if (q.options[i].correct) o.classList.add("is-correct");
      });
      session.mistakes.push(q.correctCardId);
      TarotStore.setCardStatus(q.correctCardId, "weak");
    }

    document.querySelector(".hud-chip").innerHTML = `${TarotIcons.svg("star")}<span>${TarotUI.t("quizScore")}: ${session.score}/${session.total}</span>`;

    const wrap = document.createElement("div");
    wrap.className = "quiz-next-wrap";
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-primary";
    nextBtn.innerHTML = `<span>${TarotUI.t("quizQuestion")} ${session.total + 1}</span>${TarotIcons.svg("arrowRight")}`;
    nextBtn.addEventListener("click", () => {
      if (session.mode !== "timed" && session.mode !== "endless" && session.total >= 8) {
        finishSession();
      } else {
        renderQuestion();
      }
    });
    document.querySelector(".quiz-card").appendChild(wrap);
    wrap.appendChild(nextBtn);

    if (session.mode !== "timed" && session.mode !== "endless" && session.total >= 8) {
      nextBtn.innerHTML = `<span>${TarotUI.t("quizFinished")}</span>${TarotIcons.svg("check")}`;
    }
  }

  function finishSession() {
    stopTimer();
    const s = session;
    TarotStore.recordQuiz(s.mode, s.score, s.total, [...new Set(s.mistakes)]);
    const pct = s.total ? Math.round((s.score / s.total) * 100) : 0;
    const circumference = 2 * Math.PI * 63;
    const offset = circumference - (circumference * pct) / 100;

    const mistakeCards = [...new Set(s.mistakes)].map((id) => TarotData.get(id));
    const mistakesHtml = mistakeCards.length
      ? mistakeCards.map((c) => `<div class="mistake-chip"><img src="${c.image}" alt=""><span>${c.name}</span></div>`).join("")
      : `<p data-i18n="quizNoMistakes">${TarotUI.t("quizNoMistakes")}</p>`;

    root.innerHTML = `
      <div class="quiz-results">
        <p class="eyebrow" data-i18n="quizFinished">${TarotUI.t("quizFinished")}</p>
        <h2 data-i18n="quizFinalScore">${TarotUI.t("quizFinalScore")}</h2>
        <div class="results-ring">
          <svg viewBox="0 0 140 140">
            <defs>
              <linearGradient id="quizRingGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="var(--gold)" />
                <stop offset="100%" stop-color="var(--coral)" />
              </linearGradient>
            </defs>
            <circle class="results-ring-track" cx="70" cy="70" r="63" />
            <circle class="results-ring-fill" cx="70" cy="70" r="63"
              stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
          </svg>
          <div class="results-ring-label">
            <strong>${s.score}/${s.total}</strong>
            <span>${pct}%</span>
          </div>
        </div>
        <h3 style="font-size:0.95rem;" data-i18n="quizMistakes">${TarotUI.t("quizMistakes")}</h3>
        <div class="mistake-list">${mistakesHtml}</div>
        <div class="results-actions">
          <button class="btn btn-primary" id="retry-btn">${TarotIcons.svg("arrowRight")}<span data-i18n="quizPlayAgain">${TarotUI.t("quizPlayAgain")}</span></button>
          <button class="btn btn-ghost" id="back-btn"><span data-i18n="quizBackToModes">${TarotUI.t("quizBackToModes")}</span></button>
        </div>
      </div>
    `;
    document.getElementById("retry-btn").addEventListener("click", () => startSession(s.mode));
    document.getElementById("back-btn").addEventListener("click", renderModePicker);
  }

  renderModePicker();

  document.addEventListener("tarot:langchange", () => {
    if (!session) renderModePicker();
  });
})();
