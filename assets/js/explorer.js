/* ============================================================
   explorer.js
   Default view is a constellation wheel grouping every card by
   suit ring. Filtering by suit or searching switches to an
   animated card gallery instead of a plain grid/table.
   ============================================================ */

(async function () {
  const SUIT_META = {
    major: { icon: "suitMajor", nameKey: "exploreFilterMajor" },
    wands: { icon: "suitWands", nameKey: "exploreFilterWands" },
    cups: { icon: "suitCups", nameKey: "exploreFilterCups" },
    swords: { icon: "suitSwords", nameKey: "exploreFilterSwords" },
    pentacles: { icon: "suitPentacles", nameKey: "exploreFilterPentacles" },
  };
  const RING_ORDER = ["major", "wands", "cups", "swords", "pentacles"];

  let allCards = [];
  let activeSuit = "all";
  let query = "";

  const content = document.getElementById("explorer-content");
  const resultCount = document.getElementById("result-count");

  try {
    allCards = await TarotData.load();
  } catch (e) {
    content.innerHTML = `<div class="empty-state">${TarotIcons.svg("close")}<p>${TarotUI.t("errorLoad")}</p></div>`;
    return;
  }

  document.getElementById("icon-search").innerHTML = TarotIcons.svg("search");

  const params = new URLSearchParams(window.location.search);
  if (params.get("suit") && SUIT_META[params.get("suit")]) {
    activeSuit = params.get("suit");
  }

  function statusClass(cardId) {
    const stat = TarotStore.getCardStat(cardId);
    if (stat.status === "learned") return "is-learned";
    if (stat.status === "weak") return "is-weak";
    return "";
  }

  function renderFilters() {
    const mount = document.getElementById("suit-filters");
    let html = `<button class="chip${activeSuit === "all" ? " is-active" : ""}" data-suit="all">${TarotUI.t("exploreFilterAll")}</button>`;
    TarotData.suits().forEach((suit) => {
      const meta = SUIT_META[suit];
      html += `<button class="chip${activeSuit === suit ? " is-active" : ""}" data-suit="${suit}">${TarotIcons.svg(meta.icon)}<span>${TarotUI.t(meta.nameKey)}</span></button>`;
    });
    mount.innerHTML = html;
    mount.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        activeSuit = chip.dataset.suit;
        mount.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        render();
      });
    });
  }

  function renderConstellation() {
    const container = document.createElement("div");
    container.className = "constellation";

    // subtle guide rings, one per suit group present
    const suitsPresent = RING_ORDER.filter((s) => TarotData.bySuitName(s).length);
    suitsPresent.forEach((suit, i) => {
      const pct = 16 + i * (74 / Math.max(suitsPresent.length - 1, 1));
      const ring = document.createElement("div");
      ring.className = "constellation-ring";
      ring.style.width = pct + "%";
      ring.style.height = pct + "%";
      container.appendChild(ring);
    });

    suitsPresent.forEach((suit, ringIndex) => {
      const cardsInSuit = TarotData.bySuitName(suit);
      const radiusPct = 8 + ringIndex * (37 / Math.max(suitsPresent.length - 1, 1));
      const angleOffset = ringIndex * 12;
      cardsInSuit.forEach((card, i) => {
        const angle = (360 / cardsInSuit.length) * i + angleOffset;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + radiusPct * Math.cos(rad);
        const y = 50 + radiusPct * Math.sin(rad);
        const node = document.createElement("button");
        node.className = `const-node ${statusClass(card.id)}`;
        node.style.left = x + "%";
        node.style.top = y + "%";
        node.setAttribute("aria-label", card.name);
        node.innerHTML = `<img src="${card.image}" alt="" /><span class="status-dot"></span>`;
        node.addEventListener("click", () => TarotCardModal.open(card));
        container.appendChild(node);
      });
    });

    content.innerHTML = "";
    content.appendChild(container);
  }

  function renderGallery(cards) {
    if (!cards.length) {
      content.innerHTML = `<div class="empty-state">${TarotIcons.svg("search")}<p>${TarotUI.t("exploreEmpty")}</p></div>`;
      return;
    }
    const gallery = document.createElement("div");
    gallery.className = "card-gallery";
    gallery.innerHTML = cards
      .map(
        (c) => `
      <button class="gallery-card ${statusClass(c.id)}" data-id="${c.id}">
        <img src="${c.image}" alt="" />
        <div class="gallery-card-name">${c.name}</div>
        <span class="status-dot"></span>
      </button>`
      )
      .join("");
    content.innerHTML = "";
    content.appendChild(gallery);
    gallery.querySelectorAll(".gallery-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = TarotData.get(parseInt(btn.dataset.id, 10));
        TarotCardModal.open(card);
      });
    });
  }

  function render() {
    if (query.trim()) {
      const results = TarotData.search(query);
      resultCount.textContent = `${results.length} ${TarotUI.t("exploreCardCount")}`;
      renderGallery(results);
      return;
    }
    if (activeSuit === "all") {
      resultCount.textContent = `${allCards.length} ${TarotUI.t("exploreCardCount")}`;
      renderConstellation();
    } else {
      const cards = TarotData.bySuitName(activeSuit);
      resultCount.textContent = `${cards.length} ${TarotUI.t("exploreCardCount")}`;
      renderGallery(cards);
    }
  }

  document.getElementById("search-input").addEventListener("input", (e) => {
    query = e.target.value;
    render();
  });

  renderFilters();
  render();

  document.addEventListener("tarot:langchange", () => {
    renderFilters();
    render();
  });
})();
