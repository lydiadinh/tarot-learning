/* ============================================================
   Progress page — mastery ring, Major Arcana journey, suits, badges
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await TarotData.load();
  renderAll();
  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm(I18N.t("resetConfirm"))) {
      TarotStorage.resetProgress();
      renderAll();
    }
  });
  document.addEventListener("langchange", renderAll);
});

const SUIT_COLORS = {
  major: "linear-gradient(90deg, var(--suit-major-a), var(--suit-major-b))",
  cups: "linear-gradient(90deg, var(--suit-cups-a), var(--suit-cups-b))",
  wands: "linear-gradient(90deg, var(--suit-wands-a), var(--suit-wands-b))",
  swords: "linear-gradient(90deg, var(--suit-swords-a), var(--suit-swords-b))",
  pentacles: "linear-gradient(90deg, var(--suit-pentacles-a), var(--suit-pentacles-b))",
};

function renderAll() {
  const cards = TarotData.getAll();
  const progress = TarotStorage.getProgress();
  const stats = TarotStorage.stats();

  renderMastery(cards, stats);
  renderSuits(cards, progress);
  renderJourney(cards, progress);
  renderBadges(stats, progress, cards);
}

function renderMastery(cards, stats) {
  const pct = cards.length ? Math.round((stats.learned / cards.length) * 100) : 0;
  const circumference = 264;
  const offset = circumference - (circumference * pct) / 100;
  document.getElementById("mastery-arc").style.strokeDashoffset = offset;
  document.getElementById("mastery-num").textContent = `${pct}%`;
}

function renderSuits(cards, progress) {
  const suits = ["major", "cups", "wands", "swords", "pentacles"];
  const grid = document.getElementById("suit-grid");
  grid.innerHTML = suits
    .map((s) => {
      const list = cards.filter((c) => c.suit === s);
      const learned = list.filter((c) => (progress[c.id] || {}).status === "learned").length;
      const pct = list.length ? Math.round((learned / list.length) * 100) : 0;
      const meta = TarotData.SUIT_META[s];
      return `<div class="panel suit-progress-card">
        <div class="sp-icon">${meta.icon}</div>
        <div class="sp-name">${I18N.getLang() === "vi" ? meta.labelVi : meta.labelEn}</div>
        <div class="sp-bar"><i style="width:${pct}%;background:${SUIT_COLORS[s]}"></i></div>
        <div class="sp-count">${learned}/${list.length}</div>
      </div>`;
    })
    .join("");
}

function renderJourney(cards, progress) {
  const major = cards.filter((c) => c.suit === "major").sort((a, b) => Number(a.id) - Number(b.id));
  const track = document.getElementById("journey-track");

  // "current" = first not-learned card in sequence
  let currentSet = false;
  track.innerHTML = major
    .map((c) => {
      const info = progress[c.id];
      const status = info ? info.status : "new";
      let rowClass = "locked";
      let statusLabel = I18N.t("statusNew");
      if (status === "learned") {
        rowClass = "done";
        statusLabel = I18N.t("statusLearned");
      } else if (status === "review") {
        rowClass = "current";
        statusLabel = I18N.t("statusReview");
      } else if (!currentSet) {
        rowClass = "current";
        statusLabel = I18N.t("statusNew");
        currentSet = true;
      }
      return `<a class="journey-node-row ${rowClass}" href="flashcard.html?id=${c.id}">
        <div class="journey-dot"><img src="${TarotData.imagePath(c)}" alt="${escapeHtml(c.name)}" /></div>
        <div class="journey-info">
          <div class="name">${escapeHtml(c.name)}</div>
          <div class="status">${statusLabel}</div>
        </div>
      </a>`;
    })
    .join("");
}

function renderBadges(stats, progress, cards) {
  const unlocked = new Set(TarotStorage.checkAchievements());
  const grid = document.getElementById("badge-grid");
  grid.innerHTML = TarotStorage.DEFS.map((d) => {
    const isUnlocked = unlocked.has(d.id);
    return `<div class="panel badge-card ${isUnlocked ? "" : "locked"}">
      <div class="bg-icon">${d.icon}</div>
      <h4>${I18N.t(d.nameKey)}</h4>
      <p>${isUnlocked ? I18N.t(d.descKey) : I18N.t("lockedBadge")}</p>
    </div>`;
  }).join("");
}
