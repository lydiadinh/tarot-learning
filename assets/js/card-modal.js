/* ============================================================
   card-modal.js
   Shared full-detail modal for a single card, with an
   upright / reversed toggle. Used by Explorer and Progress.
   ============================================================ */

const TarotCardModal = (() => {
  const SUIT_META = {
    major: { icon: "suitMajor", nameKey: "exploreFilterMajor" },
    wands: { icon: "suitWands", nameKey: "exploreFilterWands" },
    cups: { icon: "suitCups", nameKey: "exploreFilterCups" },
    swords: { icon: "suitSwords", nameKey: "exploreFilterSwords" },
    pentacles: { icon: "suitPentacles", nameKey: "exploreFilterPentacles" },
  };

  let backdrop, content, orientation;

  function ensureNodes() {
    backdrop = document.getElementById("card-modal");
    content = document.getElementById("modal-card-content");
  }

  function render(card) {
    const meta = SUIT_META[card.suit];
    orientation = "upright";

    content.innerHTML = `
      <button class="modal-close" id="modal-close-btn" data-i18n-aria="close" aria-label="${TarotUI.t("close")}">
        ${TarotIcons.svg("close")}
      </button>
      <div class="modal-image-wrap"><img src="${card.image}" alt="${card.name}" /></div>
      <h2 class="modal-name">${card.name}</h2>
      <div class="modal-suit-tag">
        <span class="suit-pill">${TarotIcons.svg(meta.icon)}<span>${TarotUI.t(meta.nameKey)}</span></span>
      </div>

      <div class="modal-orientation-tabs">
        <button class="orientation-tab is-active" data-o="upright">${TarotIcons.svg("upright")}<span>${TarotUI.t("cardModalUpright")}</span></button>
        <button class="orientation-tab" data-o="reversed">${TarotIcons.svg("reversed")}<span>${TarotUI.t("cardModalReversed")}</span></button>
      </div>

      <div class="modal-section" data-o-section="upright">
        <h4>${TarotIcons.svg("tag")}<span>${TarotUI.t("studyKeywords")}</span></h4>
        <ul class="keyword-list">${card.keywords.map((k) => `<li>${k}</li>`).join("")}</ul>
        <h4 style="margin-top:14px;">${TarotIcons.svg("upright")}<span>${TarotUI.t("studyMeaning")}</span></h4>
        <p>${card.meaning}</p>
      </div>

      <div class="modal-section reversed" data-o-section="reversed" style="display:none;">
        <h4>${TarotIcons.svg("tag")}<span>${TarotUI.t("studyKeywords")}</span></h4>
        <ul class="keyword-list">${card.reKeywords.map((k) => `<li>${k}</li>`).join("")}</ul>
        <h4 style="margin-top:14px;">${TarotIcons.svg("reversed")}<span>${TarotUI.t("studyMeaning")}</span></h4>
        <p>${card.reMeaning}</p>
      </div>

      <div class="modal-section">
        <h4>${TarotIcons.svg("book")}<span>${TarotUI.t("studyDescription")}</span></h4>
        <p>${card.description}</p>
      </div>
    `;

    content.querySelectorAll(".orientation-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        content.querySelectorAll(".orientation-tab").forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        content.querySelectorAll("[data-o-section]").forEach((sec) => {
          sec.style.display = sec.dataset.oSection === tab.dataset.o ? "" : "none";
        });
      });
    });

    content.querySelector("#modal-close-btn").addEventListener("click", close);
  }

  function open(card) {
    ensureNodes();
    render(card);
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function bindGlobalClose() {
    document.addEventListener("DOMContentLoaded", () => {
      ensureNodes();
      if (!backdrop) return;
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) close();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    });
  }

  bindGlobalClose();

  return { open, close };
})();
