/* ============================================================
   TarotStorage — everything persisted to localStorage.
   No backend. Progress = { [cardId]: { status, box, lastSeen, seenCount } }
   status: "new" | "learned" | "review"
   box (Leitner-style level 1-5): higher box = longer gaps = more
   "mastered", used to weight spaced-repetition draws.
   ============================================================ */
const TarotStorage = (() => {
  const KEY_PROGRESS = "tarot_progress_v1";
  const KEY_QUIZ = "tarot_quiz_history_v1";
  const KEY_ACH = "tarot_achievements_v1";

  function readJSON(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v || fallback;
    } catch {
      return fallback;
    }
  }
  function writeJSON(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* storage unavailable — fail silently, app still works this session */
    }
  }

  // ---------- Progress ----------
  function getProgress() {
    return readJSON(KEY_PROGRESS, {});
  }
  function getCardProgress(id) {
    const p = getProgress();
    return p[id] || { status: "new", box: 1, lastSeen: null, seenCount: 0 };
  }
  function markCard(id, remembered) {
    const p = getProgress();
    const cur = p[id] || { status: "new", box: 1, lastSeen: null, seenCount: 0 };
    cur.seenCount = (cur.seenCount || 0) + 1;
    cur.lastSeen = Date.now();
    if (remembered) {
      cur.status = "learned";
      cur.box = Math.min(5, (cur.box || 1) + 1);
    } else {
      cur.status = "review";
      cur.box = 1;
    }
    p[id] = cur;
    writeJSON(KEY_PROGRESS, p);
    checkAchievements();
    return cur;
  }
  function stats() {
    const p = getProgress();
    const vals = Object.values(p);
    return {
      learned: vals.filter((v) => v.status === "learned").length,
      review: vals.filter((v) => v.status === "review").length,
      studied: vals.length,
    };
  }
  function resetProgress() {
    localStorage.removeItem(KEY_PROGRESS);
    localStorage.removeItem(KEY_ACH);
    localStorage.removeItem(KEY_QUIZ);
  }

  // ---------- Spaced repetition weighted queue ----------
  // Cards never seen, or in "review" / low box, are weighted heavier.
  function weightedQueue(cards) {
    const p = getProgress();
    const weighted = cards.map((c) => {
      const info = p[c.id];
      let weight = 5; // new card, high priority
      if (info) {
        if (info.status === "review") weight = 8;
        else weight = Math.max(1, 6 - info.box); // mastered cards -> low weight
      }
      return { card: c, weight };
    });
    // Weighted shuffle: repeat entries proportionally then shuffle
    const pool = [];
    weighted.forEach(({ card, weight }) => {
      for (let i = 0; i < weight; i++) pool.push(card);
    });
    // Fisher-Yates on pool, then dedupe preserving first occurrence order
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const seen = new Set();
    const ordered = [];
    pool.forEach((c) => {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        ordered.push(c);
      }
    });
    return ordered;
  }

  // ---------- Quiz history ----------
  function logQuizResult(mode, correct, total) {
    const hist = readJSON(KEY_QUIZ, []);
    hist.push({ mode, correct, total, date: Date.now() });
    writeJSON(KEY_QUIZ, hist.slice(-100));
    checkAchievements();
  }
  function getQuizHistory() {
    return readJSON(KEY_QUIZ, []);
  }

  // ---------- Achievements ----------
  const DEFS = [
    { id: "explorer", nameKey: "achExplorerName", descKey: "achExplorerDesc", icon: "🧭", test: (s) => s.learned >= 10 },
    { id: "pilgrim", nameKey: "achPilgrimName", descKey: "achPilgrimDesc", icon: "🕊️", test: (s, p, cards) => {
        const major = cards.filter((c) => c.suit === "major");
        return major.length > 0 && major.every((c) => (p[c.id] || {}).status === "learned");
      } },
    { id: "keeper", nameKey: "achKeeperName", descKey: "achKeeperDesc", icon: "📖", test: (s, p, cards) => cards.length > 0 && s.learned / cards.length >= 0.8 },
    { id: "master", nameKey: "achFullName", descKey: "achFullDesc", icon: "🌟", test: (s, p, cards) => cards.length > 0 && s.learned === cards.length },
  ];

  function getUnlocked() {
    return readJSON(KEY_ACH, []);
  }
  function checkAchievements() {
    const cards = (window.TarotData && TarotData.getAll()) || [];
    if (!cards.length) return getUnlocked();
    const p = getProgress();
    const s = stats();
    const unlocked = new Set(getUnlocked());
    DEFS.forEach((d) => {
      if (d.test(s, p, cards)) unlocked.add(d.id);
    });
    const arr = Array.from(unlocked);
    writeJSON(KEY_ACH, arr);
    return arr;
  }

  return {
    getProgress,
    getCardProgress,
    markCard,
    stats,
    resetProgress,
    weightedQueue,
    logQuizResult,
    getQuizHistory,
    DEFS,
    getUnlocked,
    checkAchievements,
  };
})();
