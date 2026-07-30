/* ============================================================
   common.js
   Shared across every page: language dictionary, header/nav
   markup, toast notifications and the ambient starfield.
   Card names are NEVER translated. Only interface labels are.
   ============================================================ */

const TarotUI = (() => {
  const LABELS = {
    vi: {
      appName: "Tarot Journey",
      navHome: "Trang chủ",
      navStudy: "Học bài",
      navQuiz: "Trắc nghiệm",
      navExplore: "Khám phá bộ bài",
      navProgress: "Tiến độ",
      langLabel: "Ngôn ngữ",

      heroTitle: "Hành trình học Tarot",
      heroSubtitle: "Ghi nhớ trọn bộ 78 lá bài qua trải nghiệm khám phá mỗi ngày.",
      heroCardCta: "Chạm để rút một lá bài ngẫu nhiên",
      startStudy: "Bắt đầu học",

      studyTitle: "Học bài",
      studyPrompt: "Bạn nhớ lá bài này không?",
      studyReveal: "Lật bài",
      studyNext: "Lá tiếp theo",
      studyRemembered: "Đã nhớ",
      studyNeedsReview: "Cần ôn thêm",
      studyKeywords: "Từ khóa",
      studyReversedKeywords: "Từ khóa ngược",
      studyMeaning: "Ý nghĩa",
      studyDescription: "Mô tả hình ảnh",
      studyStepImage: "Bước 1: Quan sát hình ảnh",
      studyStepName: "Bước 2: Tên bài và từ khóa",
      studyStepMeaning: "Bước 3: Ý nghĩa và từ khóa ngược",
      studyStepDescription: "Bước 4: Mô tả chi tiết",
      studyDeckDone: "Bạn đã ôn hết một vòng. Tiếp tục để củng cố trí nhớ.",
      studyFilterAll: "Tất cả",

      quizTitle: "Trắc nghiệm",
      quizPickMode: "Chọn chế độ trắc nghiệm",
      quizMeaningToCard: "Ý nghĩa, đoán tên bài",
      quizCardToMeaning: "Tên bài, đoán ý nghĩa",
      quizKeywordToCard: "Từ khóa, đoán tên bài",
      quizCardToKeyword: "Tên bài, đoán từ khóa",
      quizTimed: "Thử thách 60 giây",
      quizEndless: "Chế độ vô tận",
      quizScore: "Điểm",
      quizQuestion: "Câu hỏi",
      quizTimeLeft: "Thời gian còn lại",
      quizCorrect: "Chính xác",
      quizWrong: "Chưa đúng, đáp án là",
      quizFinished: "Kết thúc trắc nghiệm",
      quizFinalScore: "Kết quả của bạn",
      quizMistakes: "Những lá cần ôn lại",
      quizPlayAgain: "Chơi lại",
      quizBackToModes: "Chọn chế độ khác",
      quizNoMistakes: "Không có lá nào cần ôn lại. Xuất sắc!",
      quizQuit: "Kết thúc sớm",
      quizFourOptions: "4 lựa chọn mỗi câu",

      exploreTitle: "Khám phá bộ bài",
      exploreSubtitle: "Chạm vào từng lá bài để xem chi tiết.",
      exploreSearchPlaceholder: "Tìm theo tên bài hoặc từ khóa",
      exploreFilterAll: "Toàn bộ",
      exploreFilterMajor: "Ẩn Chính",
      exploreFilterWands: "Wands",
      exploreFilterCups: "Cups",
      exploreFilterSwords: "Swords",
      exploreFilterPentacles: "Pentacles",
      exploreEmpty: "Không tìm thấy lá bài phù hợp.",
      exploreCardCount: "lá bài",

      progressTitle: "Tiến độ học tập",
      progressJourney: "Hành trình Ẩn Chính",
      progressStatLearned: "Đã nhớ",
      progressStatWeak: "Cần ôn thêm",
      progressStatNew: "Chưa học",
      progressStatMastery: "Mức độ thông thạo",
      progressStreak: "ngày liên tiếp",
      progressAchievements: "Huy hiệu",
      progressLocked: "Chưa mở khóa",
      progressQuizHistory: "Lịch sử trắc nghiệm",
      progressNoHistory: "Bạn chưa hoàn thành trắc nghiệm nào.",

      cardModalUpright: "Xuôi",
      cardModalReversed: "Ngược",
      close: "Đóng",
      loading: "Đang tải bộ bài...",
      errorLoad: "Không thể tải dữ liệu bộ bài. Vui lòng kiểm tra lại đường dẫn data/tarotMeaning.json.",

      suitThemeMajor: "Vũ trụ và định mệnh",
      suitThemeWands: "Lửa và năng lượng",
      suitThemeCups: "Nước và cảm xúc",
      suitThemeSwords: "Gió và trí tuệ",
      suitThemePentacles: "Đất và thịnh vượng",

      statCardsLearned: "Lá đã nhớ",
      statMastery: "Mức thông thạo",
      statStreak: "Ngày liên tiếp",
    },
    en: {
      appName: "Tarot Journey",
      navHome: "Home",
      navStudy: "Study",
      navQuiz: "Quiz",
      navExplore: "Explore Deck",
      navProgress: "Progress",
      langLabel: "Language",

      heroTitle: "Your Tarot Learning Journey",
      heroSubtitle: "Master all 78 cards through a daily journey of discovery.",
      heroCardCta: "Tap to draw a random card",
      startStudy: "Start studying",

      studyTitle: "Study",
      studyPrompt: "Do you remember this card?",
      studyReveal: "Reveal",
      studyNext: "Next card",
      studyRemembered: "I remembered",
      studyNeedsReview: "Needs review",
      studyKeywords: "Keywords",
      studyReversedKeywords: "Reversed keywords",
      studyMeaning: "Meaning",
      studyDescription: "Image description",
      studyStepImage: "Step 1: Observe the image",
      studyStepName: "Step 2: Card name and keywords",
      studyStepMeaning: "Step 3: Meaning and reversed keywords",
      studyStepDescription: "Step 4: Full description",
      studyDeckDone: "You have reviewed a full round. Keep going to reinforce memory.",
      studyFilterAll: "All",

      quizTitle: "Quiz",
      quizPickMode: "Choose a quiz mode",
      quizMeaningToCard: "Meaning to Card",
      quizCardToMeaning: "Card to Meaning",
      quizKeywordToCard: "Keyword to Card",
      quizCardToKeyword: "Card to Keyword",
      quizTimed: "60 Second Challenge",
      quizEndless: "Endless Mode",
      quizScore: "Score",
      quizQuestion: "Question",
      quizTimeLeft: "Time left",
      quizCorrect: "Correct",
      quizWrong: "Not quite, the answer is",
      quizFinished: "Quiz finished",
      quizFinalScore: "Your result",
      quizMistakes: "Cards to review",
      quizPlayAgain: "Play again",
      quizBackToModes: "Choose another mode",
      quizNoMistakes: "No cards to review. Excellent work.",
      quizQuit: "End early",
      quizFourOptions: "4 options per question",

      exploreTitle: "Explore the Deck",
      exploreSubtitle: "Tap any card to see its full detail.",
      exploreSearchPlaceholder: "Search by name or keyword",
      exploreFilterAll: "All",
      exploreFilterMajor: "Major Arcana",
      exploreFilterWands: "Wands",
      exploreFilterCups: "Cups",
      exploreFilterSwords: "Swords",
      exploreFilterPentacles: "Pentacles",
      exploreEmpty: "No matching cards found.",
      exploreCardCount: "cards",

      progressTitle: "Learning Progress",
      progressJourney: "Major Arcana Journey",
      progressStatLearned: "Learned",
      progressStatWeak: "Needs review",
      progressStatNew: "Not started",
      progressStatMastery: "Mastery level",
      progressStreak: "day streak",
      progressAchievements: "Achievements",
      progressLocked: "Locked",
      progressQuizHistory: "Quiz history",
      progressNoHistory: "You have not completed a quiz yet.",

      cardModalUpright: "Upright",
      cardModalReversed: "Reversed",
      close: "Close",
      loading: "Loading the deck...",
      errorLoad: "Could not load the deck data. Please check the data/tarotMeaning.json path.",

      suitThemeMajor: "Cosmos and destiny",
      suitThemeWands: "Fire and energy",
      suitThemeCups: "Water and emotion",
      suitThemeSwords: "Wind and intellect",
      suitThemePentacles: "Earth and prosperity",

      statCardsLearned: "Cards learned",
      statMastery: "Mastery level",
      statStreak: "Day streak",
    },
  };

  let lang = "vi";

  function t(key) {
    return (LABELS[lang] && LABELS[lang][key]) || (LABELS.vi[key] || key);
  }

  function setLang(newLang) {
    lang = newLang === "en" ? "en" : "vi";
    TarotStore.setLang(lang);
    document.documentElement.lang = lang === "vi" ? "vi" : "en";
    applyTranslations();
    document.dispatchEvent(new CustomEvent("tarot:langchange", { detail: lang }));
  }

  function getLang() {
    return lang;
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
  }

  const NAV_ITEMS = [
    { page: "index.html", icon: "home", label: "navHome" },
    { page: "flashcard.html", icon: "study", label: "navStudy" },
    { page: "quiz.html", icon: "quiz", label: "navQuiz" },
    { page: "explorer.html", icon: "explore", label: "navExplore" },
    { page: "progress.html", icon: "progress", label: "navProgress" },
  ];

  function currentPageName() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function renderHeader(mountEl) {
    const current = currentPageName();
    const navHtml = NAV_ITEMS.map((item) => {
      const active = item.page === current ? " is-active" : "";
      return `
        <a class="nav-link${active}" href="${item.page}">
          ${TarotIcons.svg(item.icon, 'class="icon nav-icon"')}
          <span data-i18n="${item.label}">${t(item.label)}</span>
        </a>`;
    }).join("");

    mountEl.innerHTML = `
      <div class="header-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark" aria-hidden="true">${TarotIcons.svg("star", 'class="icon"')}</span>
          <span class="brand-name" data-i18n="appName">${t("appName")}</span>
        </a>
        <nav class="main-nav" aria-label="Main">${navHtml}</nav>
        <div class="lang-switch" role="group" data-i18n-aria="langLabel" aria-label="${t("langLabel")}">
          <button type="button" class="lang-btn" data-lang="vi">VI</button>
          <button type="button" class="lang-btn" data-lang="en">EN</button>
        </div>
      </div>
      <nav class="mobile-nav" aria-label="Mobile">${navHtml}</nav>
    `;

    mountEl.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
      btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
        mountEl.querySelectorAll(".lang-btn").forEach((b) => {
          b.classList.toggle("is-active", b.dataset.lang === lang);
        });
      });
    });
  }

  function renderStars(mountEl, count) {
    if (!mountEl) return;
    let html = "";
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = (Math.random() * 2 + 1).toFixed(1);
      const delay = (Math.random() * 6).toFixed(2);
      const dur = (Math.random() * 3 + 3).toFixed(2);
      html += `<span class="star" style="top:${top}%;left:${left}%;width:${size}px;height:${size}px;animation-delay:${delay}s;animation-duration:${dur}s;"></span>`;
    }
    mountEl.innerHTML = html;
  }

  let toastTimer = null;
  function toast(message) {
    let el = document.getElementById("tarot-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "tarot-toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2400);
  }

  function init() {
    lang = TarotStore.getLang();
    document.documentElement.lang = lang === "vi" ? "vi" : "en";
    const header = document.getElementById("app-header");
    if (header) renderHeader(header);
    applyTranslations();
    const starfield = document.querySelector(".starfield");
    if (starfield) renderStars(starfield, 60);
  }

  return { t, setLang, getLang, applyTranslations, renderHeader, renderStars, toast, init, LABELS };
})();

document.addEventListener("DOMContentLoaded", () => TarotUI.init());
