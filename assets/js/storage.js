/* ============================================================
   storage.js
   All persistence lives in LocalStorage. No backend required.
   Also implements the weighted spaced-repetition draw used by
   Flashcard mode, and the achievement-unlock checks.
   ============================================================ */

const TarotStore = (() => {
  const KEY = "tarotJourney_v1";

  const defaultState = () => ({
    lang: "vi",
    cardStats: {}, // id -> { status: 'new'|'learned'|'weak', seen, lastSeen }
    quizHistory: [], // { date, mode, score, total, mistakes: [id,...] }
    achievements: {}, // achievementId -> ISO date unlocked
    lastVisit: null,
    streakDays: 0,
  });

  let state = null;

  function load() {
    if (state) return state;
    try {
      const raw = localStorage.getItem(KEY);
      state = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
    } catch (e) {
      state = defaultState();
    }
    touchStreak();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* storage unavailable, fail silently */
    }
  }

  function touchStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastVisit === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    state.streakDays = state.lastVisit === yesterday ? state.streakDays + 1 : 1;
    state.lastVisit = today;
    save();
  }

  function getLang() {
    return load().lang;
  }

  function setLang(lang) {
    load().lang = lang;
    save();
  }

  function getCardStat(id) {
    const s = load();
    return s.cardStats[id] || { status: "new", seen: 0, lastSeen: null };
  }

  function setCardStatus(id, status) {
    const s = load();
    const prev = s.cardStats[id] || { status: "new", seen: 0, lastSeen: null };
    s.cardStats[id] = {
      status,
      seen: prev.seen + 1,
      lastSeen: new Date().toISOString(),
    };
    save();
    checkAchievements();
  }

  function statusCounts(totalCards) {
    const s = load();
    let learned = 0;
    let weak = 0;
    Object.values(s.cardStats).forEach((c) => {
      if (c.status === "learned") learned++;
      else if (c.status === "weak") weak++;
    });
    const seen = learned + weak;
    return {
      learned,
      weak,
      newCount: Math.max(totalCards - seen, 0),
      mastery: totalCards ? Math.round((learned / totalCards) * 100) : 0,
    };
  }

  // Weighted pick: cards marked "weak" appear ~3x more often,
  // "new" cards ~2x more often than already "learned" cards.
  function weightedPick(cardPool, excludeId) {
    const s = load();
    const weighted = [];
    cardPool.forEach((card) => {
      if (card.id === excludeId) return;
      const stat = s.cardStats[card.id];
      let weight = 2;
      if (stat) {
        if (stat.status === "weak") weight = 3;
        else if (stat.status === "learned") weight = 1;
      }
      for (let i = 0; i < weight; i++) weighted.push(card);
    });
    if (!weighted.length) return cardPool[0];
    return weighted[Math.floor(Math.random() * weighted.length)];
  }

  function recordQuiz(mode, score, total, mistakeIds) {
    const s = load();
    s.quizHistory.push({
      date: new Date().toISOString(),
      mode,
      score,
      total,
      mistakes: mistakeIds,
    });
    if (s.quizHistory.length > 50) s.quizHistory.shift();
    save();
    checkAchievements();
  }

  function getQuizHistory() {
    return load().quizHistory;
  }

  const ACHIEVEMENTS = [
    {
      id: "explorer",
      icon: "explorer",
      vi: { name: "Nhà Thám Hiểm", desc: "Học 10 lá bài đầu tiên." },
      en: { name: "The Explorer", desc: "Learn your first 10 cards." },
      test: (ctx) => ctx.learned >= 10,
    },
    {
      id: "pilgrim",
      icon: "pilgrim",
      vi: { name: "Người Hành Hương", desc: "Thông thạo toàn bộ 22 lá Ẩn Chính." },
      en: { name: "The Pilgrim", desc: "Master all Major Arcana cards." },
      test: (ctx) => ctx.majorLearned >= ctx.majorTotal && ctx.majorTotal > 0,
    },
    {
      id: "keeper",
      icon: "keeper",
      vi: { name: "Người Giữ Tri Thức", desc: "Đạt 80% mức độ thông thạo." },
      en: { name: "Keeper of Knowledge", desc: "Reach 80% overall mastery." },
      test: (ctx) => ctx.mastery >= 80,
    },
  ];

  function checkAchievements() {
    if (!window.TarotData) return;
    const s = load();
    const all = TarotData.all();
    if (!all.length) return;
    const counts = statusCounts(all.length);
    const majors = TarotData.bySuitName("major");
    const majorLearned = majors.filter(
      (c) => s.cardStats[c.id] && s.cardStats[c.id].status === "learned"
    ).length;

    const ctx = {
      learned: counts.learned,
      mastery: counts.mastery,
      majorLearned,
      majorTotal: majors.length,
    };

    let unlockedNew = false;
    ACHIEVEMENTS.forEach((a) => {
      if (!s.achievements[a.id] && a.test(ctx)) {
        s.achievements[a.id] = new Date().toISOString();
        unlockedNew = true;
      }
    });
    if (unlockedNew) save();
    return unlockedNew;
  }

  function getAchievements() {
    const s = load();
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: !!s.achievements[a.id],
      unlockedAt: s.achievements[a.id] || null,
    }));
  }

  function getStreak() {
    return load().streakDays;
  }

  return {
    load,
    getLang,
    setLang,
    getCardStat,
    setCardStatus,
    statusCounts,
    weightedPick,
    recordQuiz,
    getQuizHistory,
    getAchievements,
    checkAchievements,
    getStreak,
  };
})();
