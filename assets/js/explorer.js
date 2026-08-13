/* ============================================================
   Deck Explorer — filter + search + animated gallery
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await TarotData.load();
  let activeSuit = "all";
  let query = "";

  const gallery = document.getElementById("gallery");
  const loadingMsg = document.getElementById("loading-msg");
  const emptyMsg = document.getElementById("empty-msg");
  const countEl = document.getElementById("explorer-count");

  function currentList() {
    if (query.trim()) return TarotData.search(query);
    return TarotData.getBySuit(activeSuit);
  }

  function render() {
    const list = currentList();
    loadingMsg.style.display = "none";
    countEl.textContent = `${list.length} / ${TarotData.getAll().length}`;

    if (!list.length) {
      gallery.style.display = "none";
      emptyMsg.style.display = "block";
      return;
    }
    emptyMsg.style.display = "none";
    gallery.style.display = "grid";

    const progress = TarotStorage.getProgress();
    gallery.innerHTML = list
      .map((c, i) => {
        const mastered = (progress[c.id] || {}).status === "learned";
        return `<div class="tarot-tile ${mastered ? "mastered" : ""}" data-id="${c.id}" style="animation-delay:${Math.min(i * 0.03, 0.5)}s">
          <img loading="lazy" src="${TarotData.imagePath(c)}" alt="${escapeHtml(c.name)}" />
          <span class="tile-badge">${TarotData.SUIT_META[c.suit] ? TarotData.SUIT_META[c.suit].icon : "✦"}</span>
          <span class="tile-name">${escapeHtml(c.name)}</span>
        </div>`;
      })
      .join("");

    gallery.querySelectorAll(".tarot-tile").forEach((tile) => {
      tile.addEventListener("click", () => {
        const card = TarotData.getById(tile.dataset.id);
        openCardModal(card);
      });
    });
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeSuit = chip.dataset.suit;
      document.getElementById("search-input").value = "";
      query = "";
      render();
    });
  });

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    query = searchInput.value;
    render();
  });

  render();
});
