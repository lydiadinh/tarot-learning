/* ============================================================
   Shared card detail modal (bottom sheet on mobile, dialog on desktop)
   ============================================================ */
const SUIT_GRADIENT = {
  major: "linear-gradient(135deg, var(--suit-major-a), var(--suit-major-b))",
  cups: "linear-gradient(135deg, var(--suit-cups-a), var(--suit-cups-b))",
  wands: "linear-gradient(135deg, var(--suit-wands-a), var(--suit-wands-b))",
  swords: "linear-gradient(135deg, var(--suit-swords-a), var(--suit-swords-b))",
  pentacles: "linear-gradient(135deg, var(--suit-pentacles-a), var(--suit-pentacles-b))",
};

function openCardModal(card) {
  const backdrop = document.getElementById("modal-backdrop");
  const sheet = document.getElementById("modal-sheet");
  if (!backdrop || !sheet || !card) return;

  const typeLabel = card.suit === "major" ? I18N.t("typeMajor") : I18N.t("typeMinor");
  const grad = SUIT_GRADIENT[card.suit] || SUIT_GRADIENT.major;

  const kwHtml = card.keywords.map((k) => `<span class="kw">${escapeHtml(k)}</span>`).join("");
  const reKwHtml = card.reKeywords.map((k) => `<span class="kw re">${escapeHtml(k)}</span>`).join("");

  const descHtml = card.description.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  const meanHtml = card.meaning.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  const reMeanHtml = (card.reMeaning || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("");

  sheet.innerHTML = `
    <button class="modal-close" id="modal-close-btn" aria-label="${I18N.t("close")}">✕</button>
    <div class="modal-head">
      <img src="${TarotData.imagePath(card)}" alt="${escapeHtml(card.name)}" />
      <div>
        <h3>${escapeHtml(card.name)}</h3>
        <span class="type-tag" style="background:${grad}">${typeLabel}</span>
        <div class="kw-row">${kwHtml}</div>
      </div>
    </div>

    <div class="modal-block">
      <h4>${I18N.t("description")}</h4>
      ${descHtml || ""}
    </div>

    <div class="modal-block">
      <h4>${I18N.t("meaning")} — ${I18N.t("upright")}</h4>
      ${meanHtml || ""}
    </div>

    ${reMeanHtml ? `<div class="modal-block"><h4>${I18N.t("meaning")} — ${I18N.t("reversed")}</h4>${reMeanHtml}
      <div class="kw-row" style="margin-top:10px">${reKwHtml}</div>
    </div>` : ""}

    <div class="modal-actions">
      <a class="btn btn-primary" href="flashcard.html?id=${card.id}">${I18N.t("studyThisCard")}</a>
      <button class="btn btn-ghost" id="modal-close-btn2">${I18N.t("close")}</button>
    </div>
  `;

  backdrop.classList.add("open");
  const close = () => backdrop.classList.remove("open");
  document.getElementById("modal-close-btn").addEventListener("click", close);
  document.getElementById("modal-close-btn2").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", esc);
    }
  });
}
