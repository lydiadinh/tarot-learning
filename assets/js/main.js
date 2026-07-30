/* ============================================================
   main.js: homepage
   ============================================================ */

(async function () {
  const iconMap = {
    "icon-study": "study",
    "icon-quiz": "quiz",
    "icon-explore": "explore",
    "icon-progress": "progress",
    "icon-arrow": "arrowRight",
  };
  Object.entries(iconMap).forEach(([id, icon]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = TarotIcons.svg(icon);
  });

  let cards = [];
  try {
    cards = await TarotData.load();
  } catch (e) {
    console.error(e);
    return;
  }

  function drawRandomCard() {
    if (!cards.length) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    const img = document.getElementById("orbit-card-image");
    img.src = card.image;
    img.alt = card.name;
    return card;
  }

  drawRandomCard();
  document.getElementById("orbit-center").addEventListener("click", drawRandomCard);

  function renderStats() {
    const counts = TarotStore.statusCounts(cards.length);
    const streak = TarotStore.getStreak();
    const mount = document.getElementById("home-stats");
    mount.innerHTML = `
      <div class="stat-card">
        ${TarotIcons.svg("check")}
        <div class="stat-value">${counts.learned}/${cards.length}</div>
        <div class="stat-label" data-i18n="statCardsLearned">${TarotUI.t("statCardsLearned")}</div>
      </div>
      <div class="stat-card">
        ${TarotIcons.svg("star")}
        <div class="stat-value">${counts.mastery}%</div>
        <div class="stat-label" data-i18n="statMastery">${TarotUI.t("statMastery")}</div>
      </div>
      <div class="stat-card">
        ${TarotIcons.svg("timer")}
        <div class="stat-value">${streak}</div>
        <div class="stat-label" data-i18n="statStreak">${TarotUI.t("statStreak")}</div>
      </div>
    `;
  }

  const SUIT_META = {
    major: { icon: "suitMajor", nameKey: "exploreFilterMajor", themeKey: "suitThemeMajor" },
    wands: { icon: "suitWands", nameKey: "exploreFilterWands", themeKey: "suitThemeWands" },
    cups: { icon: "suitCups", nameKey: "exploreFilterCups", themeKey: "suitThemeCups" },
    swords: { icon: "suitSwords", nameKey: "exploreFilterSwords", themeKey: "suitThemeSwords" },
    pentacles: { icon: "suitPentacles", nameKey: "exploreFilterPentacles", themeKey: "suitThemePentacles" },
  };

  function renderSuitTeaser() {
    const mount = document.getElementById("suit-teaser-grid");
    const suits = TarotData.suits();
    mount.innerHTML = suits
      .map((suit) => {
        const meta = SUIT_META[suit];
        const total = TarotData.bySuitName(suit).length;
        return `
        <a class="suit-teaser-card" data-suit="${suit}" href="explorer.html?suit=${suit}">
          ${TarotIcons.svg(meta.icon)}
          <strong>${TarotUI.t(meta.nameKey)}</strong>
          <small>${total} &middot; ${TarotUI.t(meta.themeKey)}</small>
        </a>`;
      })
      .join("");
  }

  renderStats();
  renderSuitTeaser();

  document.addEventListener("tarot:langchange", () => {
    renderStats();
    renderSuitTeaser();
  });
})();
