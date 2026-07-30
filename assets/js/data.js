/* ============================================================
   data.js
   Loads data/tarotMeaning.json and normalizes it into a flat,
   predictable structure. Nothing about card names, meanings or
   quantities is hardcoded here: everything is derived from the
   JSON file at runtime, so the app adapts automatically if the
   file changes (more cards, fewer cards, edited text, etc).
   ============================================================ */

const TarotData = (() => {
  const DATA_URL = "data/tarotMeaning.json";

  let cards = [];
  let bySuit = {};
  let byId = {};
  let loaded = false;

  function splitList(str) {
    if (!str) return [];
    return String(str)
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function joinText(value) {
    if (Array.isArray(value)) return value.join("\n\n");
    return value ? String(value) : "";
  }

  // Suit is derived purely from the card's name text, so the app
  // keeps working correctly even if the JSON's internal "type"
  // field is inconsistent or the deck size changes.
  function deriveSuit(name) {
    const n = name.toLowerCase();
    if (n.includes("cups")) return "cups";
    if (n.includes("wands")) return "wands";
    if (n.includes("swords")) return "swords";
    if (n.includes("pentacles")) return "pentacles";
    return "major";
  }

  function deriveRank(name, suit) {
    if (suit === "major") return null;
    const parts = name.split(/ of /i);
    return parts[0] ? parts[0].trim() : null;
  }

  function normalize(key, raw) {
    const id = parseInt(key, 10);
    const name = raw.name || `Card ${id}`;
    const suit = deriveSuit(name);
    const rank = deriveRank(name, suit);
    const image = raw.image
      ? `assets/images/${raw.image}`
      : `assets/images/${id}.png`;

    return {
      id,
      name,
      suit,
      rank,
      keywords: splitList(raw.keywords),
      reKeywords: splitList(raw.reKeywords),
      description: joinText(raw.description),
      meaning: joinText(raw.meaning),
      reMeaning: joinText(raw.reMeaning),
      image,
    };
  }

  async function load() {
    if (loaded) return cards;
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("Could not load tarotMeaning.json");
    const raw = await res.json();

    cards = Object.entries(raw)
      .map(([key, val]) => normalize(key, val))
      .sort((a, b) => a.id - b.id);

    bySuit = {};
    byId = {};
    cards.forEach((c) => {
      byId[c.id] = c;
      if (!bySuit[c.suit]) bySuit[c.suit] = [];
      bySuit[c.suit].push(c);
    });

    loaded = true;
    return cards;
  }

  function all() {
    return cards;
  }

  function get(id) {
    return byId[id];
  }

  function suits() {
    // Order is intentional for display (Major first, then classic
    // suit order) but the list of suits present is discovered from
    // the data, not assumed.
    const order = ["major", "wands", "cups", "swords", "pentacles"];
    return order.filter((s) => bySuit[s] && bySuit[s].length);
  }

  function bySuitName(suit) {
    return bySuit[suit] || [];
  }

  function count() {
    return cards.length;
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return cards.filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.keywords.some((k) => k.toLowerCase().includes(q))) return true;
      if (c.reKeywords.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  return { load, all, get, suits, bySuitName, count, search, deriveSuit };
})();
