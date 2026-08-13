/* ============================================================
   TarotData — loads data/tarotMeaning.json dynamically.
   Everything about card counts, names, meanings is derived
   from this file. Nothing is hardcoded.
   ============================================================ */
const TarotData = (() => {
  let cards = null; // array, normalized
  let loadingPromise = null;

  function suitOf(card) {
    if (String(card.type) === "1") return "major";
    const n = card.name.toLowerCase();
    if (n.includes("cup")) return "cups";
    if (n.includes("wand")) return "wands";
    if (n.includes("sword")) return "swords";
    if (n.includes("pentacle")) return "pentacles";
    return "minor";
  }

  function normalize(raw) {
    return Object.keys(raw)
      .map((id) => {
        const c = raw[id];
        const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
        return {
          id: String(id),
          name: c.name || "",
          type: String(c.type),
          keywords: (c.keywords || "")
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean),
          reKeywords: (c.reKeywords || "")
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean),
          description: arr(c.description),
          meaning: arr(c.meaning),
          reMeaning: arr(c.reMeaning),
          image: c.image || `${id}.png`,
        };
      })
      .map((c) => ({ ...c, suit: suitOf(c) }))
      .sort((a, b) => Number(a.id) - Number(b.id));
  }

  function basePath() {
    // Works whether the app is served from root or a GitHub Pages subpath.
    const path = window.location.pathname;
    const dir = path.substring(0, path.lastIndexOf("/") + 1);
    return dir;
  }

  async function load() {
    if (cards) return cards;
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch(basePath() + "data/tarotMeaning.json")
      .then((r) => {
        if (!r.ok) throw new Error("Không thể tải dữ liệu bài Tarot");
        return r.json();
      })
      .then((raw) => {
        cards = normalize(raw);
        return cards;
      });
    return loadingPromise;
  }

  function imagePath(card) {
    return basePath() + "assets/images/" + card.image;
  }

  function getAll() {
    return cards || [];
  }
  function getById(id) {
    return (cards || []).find((c) => c.id === String(id));
  }
  function getBySuit(suit) {
    if (!suit || suit === "all") return getAll();
    return getAll().filter((c) => c.suit === suit);
  }
  function getMajor() {
    return getBySuit("major");
  }
  function search(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return getAll().filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.keywords.some((k) => k.toLowerCase().includes(q))) return true;
      if (c.reKeywords.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  }
  function randomCard(excludeIds = []) {
    const pool = getAll().filter((c) => !excludeIds.includes(c.id));
    const list = pool.length ? pool : getAll();
    return list[Math.floor(Math.random() * list.length)];
  }

  const SUIT_META = {
    major: { icon: "✦", labelVi: "Ẩn Chính", labelEn: "Major Arcana" },
    cups: { icon: "🌊", labelVi: "Cups", labelEn: "Cups" },
    wands: { icon: "🔥", labelVi: "Wands", labelEn: "Wands" },
    swords: { icon: "💨", labelVi: "Swords", labelEn: "Swords" },
    pentacles: { icon: "🌿", labelVi: "Pentacles", labelEn: "Pentacles" },
  };

  return {
    load,
    getAll,
    getById,
    getBySuit,
    getMajor,
    search,
    randomCard,
    imagePath,
    SUIT_META,
  };
})();
