/* ============================================================
   progress.js
   Turns raw LocalStorage stats into a Tarot Journey: a winding
   path through the Major Arcana, radial stat rings, badges,
   and quiz history, instead of a bare percentage table.
   ============================================================ */

(async function () {
  const content = document.getElementById("progress-content");
  let allCards = [];

  try {
    allCards = await TarotData.load();
  } catch (e) {
    content.innerHTML = `<div class="empty-state">${TarotIcons.svg("close")}<p>${TarotUI.t("errorLoad")}</p></div>`;
    return;
  }

  const MODE_LABELS = {
    meaningToCard: "quizMeaningToCard",
    cardToMeaning: "quizCardToMeaning",
    keywordToCard: "quizKeywordToCard",
    cardToKeyword: "quizCardToKeyword",
    timed: "quizTimed",
    endless: "quizEndless",
  };

  function ring(id, valuePct, iconName, labelKey, valueText) {
    const r = 26;
    const c = 2 * Math.PI * r;
    const offset = c - (c * Math.min(valuePct, 100)) / 100;
    return `
      <div class="pstat ${id}">
        <div class="pstat-ring">
          <svg viewBox="0 0 60 60">
            <circle class="track" cx="30" cy="30" r="${r}" />
            <circle class="fill" cx="30" cy="30" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${offset}" />
          </svg>
          <div class="pstat-value">${valueText}</div>
        </div>
        <div class="pstat-label">${TarotIcons.svg(iconName)}</div>
        <div class="pstat-label">${TarotUI.t(labelKey)}</div>
      </div>`;
  }

  function renderStats() {
    const counts = TarotStore.statusCounts(allCards.length);
    const total = allCards.length || 1;
    return `
      <div class="progress-stats">
        ${ring("learned", (counts.learned / total) * 100, "check", "progressStatLearned", counts.learned)}
        ${ring("weak", (counts.weak / total) * 100, "reversed", "progressStatWeak", counts.weak)}
        ${ring("new", (counts.newCount / total) * 100, "star", "progressStatNew", counts.newCount)}
        ${ring("mastery", counts.mastery, "infinity", "progressStatMastery", counts.mastery + "%")}
      </div>`;
  }

  function renderStreak() {
    const streak = TarotStore.getStreak();
    return `
      <div class="streak-banner">
        ${TarotIcons.svg("timer")}
        <div>
          <strong>${streak} ${TarotUI.t("progressStreak")}</strong>
          <span data-i18n="heroSubtitle">${TarotUI.t("heroSubtitle")}</span>
        </div>
      </div>`;
  }

  function renderJourney() {
    const majors = TarotData.bySuitName("major");
    if (!majors.length) return "";
    const n = majors.length;
    const width = Math.max(900, n * 62);
    const stepX = (width - 80) / Math.max(n - 1, 1);
    const points = majors.map((card, i) => {
      const x = 40 + i * stepX;
      const y = 90 + 46 * Math.sin(i * 0.85);
      return { card, x, y };
    });
    const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

    const nodesHtml = points
      .map(({ card, x, y }) => {
        const stat = TarotStore.getCardStat(card.id);
        const cls = stat.status === "learned" ? "is-learned" : stat.status === "weak" ? "is-weak" : "is-new";
        return `
        <button class="journey-node ${cls}" style="left:${x}px;top:${y}px;" data-id="${card.id}" aria-label="${card.name}">
          <div class="journey-node-dot"><img src="${card.image}" alt="" /></div>
          <div class="journey-node-label">${card.name}</div>
        </button>`;
      })
      .join("");

    return `
      <div class="section-head"><h2 data-i18n="progressJourney">${TarotUI.t("progressJourney")}</h2></div>
      <div class="journey-wrap">
        <div class="journey-track" style="width:${width}px;height:190px;">
          <svg width="${width}" height="190" style="position:absolute;top:0;left:0;">
            <polyline points="${polyline}" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="5 7" opacity="0.5" />
          </svg>
          ${nodesHtml}
        </div>
      </div>`;
  }

  function renderAchievements() {
    const achievements = TarotStore.getAchievements();
    const lang = TarotUI.getLang();
    const iconMap = { explorer: "badgeExplorer", pilgrim: "badgePilgrim", keeper: "badgeKeeper" };
    const cards = achievements
      .map((a) => {
        const copy = a[lang] || a.vi;
        return `
        <div class="badge-card ${a.unlocked ? "is-unlocked" : ""}">
          <div class="badge-icon-wrap">${TarotIcons.svg(iconMap[a.id])}</div>
          <div class="badge-name">${copy.name}</div>
          <div class="badge-desc">${copy.desc}</div>
          ${a.unlocked ? "" : `<div class="badge-status" data-i18n="progressLocked">${TarotUI.t("progressLocked")}</div>`}
        </div>`;
      })
      .join("");
    return `
      <div class="section-head"><h2 data-i18n="progressAchievements">${TarotUI.t("progressAchievements")}</h2></div>
      <div class="badge-grid">${cards}</div>`;
  }

  function renderHistory() {
    const history = TarotStore.getQuizHistory().slice().reverse();
    let listHtml;
    if (!history.length) {
      listHtml = `<div class="empty-state">${TarotIcons.svg("quiz")}<p data-i18n="progressNoHistory">${TarotUI.t("progressNoHistory")}</p></div>`;
    } else {
      listHtml = `<div class="history-list">${history
        .slice(0, 12)
        .map((h) => {
          const date = new Date(h.date);
          const dateStr = date.toLocaleDateString(TarotUI.getLang() === "vi" ? "vi-VN" : "en-US", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          return `
          <div class="history-item">
            <div class="history-icon">${TarotIcons.svg("quiz")}</div>
            <div class="history-details">
              <div class="history-mode">${TarotUI.t(MODE_LABELS[h.mode] || h.mode)}</div>
              <div class="history-date">${dateStr}</div>
            </div>
            <div class="history-score">${h.score}/${h.total}</div>
          </div>`;
        })
        .join("")}</div>`;
    }
    return `
      <div class="section-head"><h2 data-i18n="progressQuizHistory">${TarotUI.t("progressQuizHistory")}</h2></div>
      ${listHtml}`;
  }

  function render() {
    content.innerHTML = `
      ${renderStats()}
      ${renderStreak()}
      ${renderJourney()}
      ${renderAchievements()}
      ${renderHistory()}
    `;
    content.querySelectorAll(".journey-node").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = TarotData.get(parseInt(btn.dataset.id, 10));
        TarotCardModal.open(card);
      });
    });
  }

  render();

  document.addEventListener("tarot:langchange", render);
})();
