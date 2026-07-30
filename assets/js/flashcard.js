/* ============================================================
   flashcard.js
   Learning flow: Image -> Recall -> Guess -> Reveal -> Reinforce.
   Weak cards are drawn more often via TarotStore.weightedPick.
   ============================================================ */

(async function () {
  const SUIT_META = {
    major: { icon: "suitMajor", nameKey: "exploreFilterMajor" },
    wands: { icon: "suitWands", nameKey: "exploreFilterWands" },
    cups: { icon: "suitCups", nameKey: "exploreFilterCups" },
    swords: { icon: "suitSwords", nameKey: "exploreFilterSwords" },
    pentacles: { icon: "suitPentacles", nameKey: "exploreFilterPentacles" },
  };

  let allCards = [];
  let pool = [];
  let currentCard = null;
  let step = 0; // 0..3, then judge
  const MAX_STEP = 3;
  let activeSuit = "all";

  const stage = document.getElementById("flash-stage");

  try {
    allCards = await TarotData.load();
  } catch (e) {
    stage.innerHTML = `<div class="empty-state">${TarotIcons.svg("close")}<p data-i18n="errorLoad">${TarotUI.t("errorLoad")}</p></div>`;
    return;
  }

  function renderFilters() {
    const mount = document.getElementById("study-filter");
    const suits = TarotData.suits();
    let html = `<button class="chip is-active" data-suit="all" data-i18n="studyFilterAll">${TarotUI.t("studyFilterAll")}</button>`;
    suits.forEach((suit) => {
      const meta = SUIT_META[suit];
      html += `<button class="chip" data-suit="${suit}">${TarotIcons.svg(meta.icon)}<span>${TarotUI.t(meta.nameKey)}</span></button>`;
    });
    mount.innerHTML = html;

    mount.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        mount.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeSuit = chip.dataset.suit;
        updatePool();
        nextCard();
      });
    });
  }

  function updatePool() {
    pool = activeSuit === "all" ? allCards : TarotData.bySuitName(activeSuit);
  }

  function updateProgress() {
    const counts = TarotStore.statusCounts(pool.length);
    const fill = document.getElementById("study-progress-fill");
    const text = document.getElementById("study-progress-text");
    fill.style.width = counts.mastery + "%";
    text.textContent = `${counts.learned}/${pool.length} · ${counts.mastery}%`;
  }

  function nextCard() {
    if (!pool.length) {
      stage.innerHTML = `<div class="study-empty">${TarotIcons.svg("book")}<p data-i18n="exploreEmpty">${TarotUI.t("exploreEmpty")}</p></div>`;
      return;
    }
    currentCard = TarotStore.weightedPick(pool, currentCard ? currentCard.id : null);
    step = 0;
    updateProgress();
    renderCard();
  }

  function renderCard() {
    const c = currentCard;
    const meta = SUIT_META[c.suit];
    let inner = `
      <div class="flash-suit-tag">
        <span class="suit-pill">${TarotIcons.svg(meta.icon)}<span>${TarotUI.t(meta.nameKey)}</span></span>
      </div>
      <div class="flash-step-label">${TarotIcons.svg("book")}<span data-step-label></span></div>
      <div class="flash-image-frame"><img src="${c.image}" alt="${step >= 1 ? c.name : TarotUI.t('studyPrompt')}" /></div>
    `;

    if (step === 0) {
      inner += `<p class="flash-prompt" data-i18n="studyPrompt">${TarotUI.t("studyPrompt")}</p>
        <p class="flash-hint" data-i18n="heroCardCta">${TarotUI.t("heroCardCta")}</p>`;
    }

    if (step >= 1) {
      inner += `<h2 class="flash-name">${c.name}</h2>
        <div class="flash-block">
          <h4>${TarotIcons.svg("tag")}<span data-i18n="studyKeywords">${TarotUI.t("studyKeywords")}</span></h4>
          <ul class="keyword-list">${c.keywords.map((k) => `<li>${k}</li>`).join("")}</ul>
        </div>`;
    }

    if (step >= 2) {
      inner += `<div class="flash-block">
          <h4>${TarotIcons.svg("upright")}<span data-i18n="studyMeaning">${TarotUI.t("studyMeaning")}</span></h4>
          <p>${c.meaning}</p>
        </div>
        <div class="flash-block">
          <h4>${TarotIcons.svg("reversed")}<span data-i18n="studyReversedKeywords">${TarotUI.t("studyReversedKeywords")}</span></h4>
          <ul class="keyword-list">${c.reKeywords.map((k) => `<li>${k}</li>`).join("")}</ul>
        </div>`;
    }

    if (step >= 3) {
      inner += `<div class="flash-block">
          <h4>${TarotIcons.svg("book")}<span data-i18n="studyDescription">${TarotUI.t("studyDescription")}</span></h4>
          <p>${c.description}</p>
        </div>`;
    }

    if (step < MAX_STEP) {
      inner += `<div class="flash-actions">
        <button class="btn btn-primary" id="reveal-btn">
          <span data-i18n="studyReveal">${TarotUI.t("studyReveal")}</span>
          ${TarotIcons.svg("arrowRight")}
        </button>
      </div>`;
    } else {
      inner += `<div class="flash-judge-actions">
        <button class="judge-btn review" id="judge-review">
          ${TarotIcons.svg("reversed")}
          <span data-i18n="studyNeedsReview">${TarotUI.t("studyNeedsReview")}</span>
        </button>
        <button class="judge-btn remembered" id="judge-remembered">
          ${TarotIcons.svg("check")}
          <span data-i18n="studyRemembered">${TarotUI.t("studyRemembered")}</span>
        </button>
      </div>`;
    }

    stage.innerHTML = `<div class="flash-card" data-suit="${c.suit}">${inner}</div>`;

    const stepLabels = ["studyStepImage", "studyStepName", "studyStepMeaning", "studyStepDescription"];
    stage.querySelector("[data-step-label]").textContent = TarotUI.t(stepLabels[step]);

    const revealBtn = document.getElementById("reveal-btn");
    if (revealBtn) revealBtn.addEventListener("click", () => { step++; renderCard(); });

    const remBtn = document.getElementById("judge-remembered");
    const revBtn = document.getElementById("judge-review");
    if (remBtn) remBtn.addEventListener("click", () => judge("learned"));
    if (revBtn) revBtn.addEventListener("click", () => judge("weak"));
  }

  function judge(status) {
    TarotStore.setCardStatus(currentCard.id, status);
    if (status === "learned") {
      TarotUI.toast(TarotUI.t("studyRemembered") + " ✓");
    }
    updateProgress();
    nextCard();
  }

  renderFilters();
  updatePool();
  nextCard();

  document.addEventListener("tarot:langchange", () => {
    renderFilters();
    document.querySelector(`.chip[data-suit="${activeSuit}"]`)?.classList.add("is-active");
    renderCard();
    updateProgress();
  });
})();
