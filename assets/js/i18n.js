/* ============================================================
   I18N — Vietnamese default, English optional.
   Card names are NEVER translated (see data.js — they pass
   through untouched regardless of language).
   ============================================================ */
const I18N = (() => {
  const dict = {
    vi: {
      appName: "Huyền Bài",
      navHome: "Trang chủ",
      navStudy: "Học bài",
      navQuiz: "Trắc nghiệm",
      navExplorer: "Khám phá",
      navProgress: "Tiến độ",

      heroEyebrow: "Hành trình 78 lá bài",
      heroTitle: "Học Tarot như một cuộc phiêu lưu",
      heroSubtitle: "Ghi nhớ, khám phá và làm chủ toàn bộ bộ bài — từng lá một.",
      nodeStudy: "Học bài",
      nodeQuiz: "Trắc nghiệm",
      nodeExplorer: "Khám phá bộ bài",
      nodeProgress: "Tiến độ học tập",

      statLearned: "Đã nhớ",
      statReview: "Cần ôn thêm",
      statTotal: "Tổng số lá",

      cardOfDay: "Lá bài hôm nay",
      cardOfDayCta: "Xem chi tiết",
      startStudy: "Bắt đầu học",
      continueStudy: "Tiếp tục học",

      searchPlaceholder: "Tìm theo tên hoặc từ khoá…",
      filterAll: "Tất cả",
      filterMajor: "Ẩn Chính",
      filterCups: "Cups",
      filterWands: "Wands",
      filterSwords: "Swords",
      filterPentacles: "Pentacles",
      noResults: "Không tìm thấy lá bài nào phù hợp.",

      typeMajor: "Ẩn Chính",
      typeMinor: "Ẩn Phụ",
      upright: "Xuôi",
      reversed: "Ngược",
      keywords: "Từ khoá",
      reKeywords: "Từ khoá ngược",
      description: "Hình ảnh lá bài",
      meaning: "Ý nghĩa",
      close: "Đóng",
      studyThisCard: "Học lá này",

      studyAskRecall: "Bạn nhớ lá bài này không?",
      studyTapToReveal: "Chạm để lật bài",
      revealName: "Xem tên & từ khoá",
      revealMeaning: "Xem ý nghĩa",
      revealDescription: "Xem mô tả hình ảnh",
      askResult: "Bạn có nhớ lá bài này không?",
      btnRemembered: "Đã nhớ",
      btnReview: "Cần ôn thêm",
      studyDone: "Bạn đã ôn xong lượt học này!",
      studyDoneSub: "Hãy quay lại sau để tiếp tục ghi nhớ những lá còn lại.",
      studyAgain: "Học lại từ đầu",
      backHome: "Về trang chủ",
      studyOf: "trên",

      quizTitle: "Chọn chế độ trắc nghiệm",
      quizSub: "Tự động tạo câu hỏi từ dữ liệu bộ bài — không giới hạn số lần chơi.",
      quizMeaningToCard: "Ý nghĩa → Lá bài",
      quizMeaningToCardDesc: "Đọc ý nghĩa, đoán tên lá bài",
      quizCardToMeaning: "Lá bài → Ý nghĩa",
      quizCardToMeaningDesc: "Xem lá bài, chọn ý nghĩa đúng",
      quizKeywordToCard: "Từ khoá → Lá bài",
      quizKeywordToCardDesc: "Đoán lá bài từ từ khoá",
      quizCardToKeyword: "Lá bài → Từ khoá",
      quizCardToKeywordDesc: "Xem lá bài, chọn từ khoá đúng",
      quizTimed: "Thử thách 60 giây",
      quizTimedDesc: "Trả lời càng nhiều câu càng tốt trong 60s",
      quizEndless: "Chế độ vô tận",
      quizEndlessDesc: "Luyện tập không giới hạn",
      quizQuestion: "Câu hỏi",
      quizScore: "Điểm",
      quizWhichCard: "Đây là lá bài nào?",
      quizWhichMeaning: "Ý nghĩa của lá bài này là gì?",
      quizWhichKeyword: "Từ khoá nào thuộc về lá bài này?",
      quizTimeUp: "Hết giờ!",
      quizResultTitle: "Kết quả của bạn",
      quizCorrect: "câu đúng",
      quizPlayAgain: "Chơi lại",
      quizBackMenu: "Chọn chế độ khác",
      quizNext: "Câu tiếp theo →",
      quizFinish: "Xem kết quả",

      progressTitle: "Tiến độ học tập",
      progressSub: "Theo dõi hành trình ghi nhớ 78 lá bài Tarot của bạn.",
      masteryLabel: "Mức độ thành thạo",
      journeyTitle: "Hành trình Ẩn Chính",
      journeySub: "Từ The Fool đến The World — từng bước một.",
      suitTitle: "Tiến độ theo bộ",
      achievementsTitle: "Huy hiệu",
      lockedBadge: "Chưa mở khoá",
      resetProgress: "Đặt lại toàn bộ tiến độ",
      resetConfirm: "Bạn chắc chắn muốn xoá toàn bộ tiến độ học tập chứ?",
      statusNew: "Chưa học",
      statusLearned: "Đã nhớ",
      statusReview: "Cần ôn thêm",

      achExplorerName: "Nhà Thám Hiểm",
      achExplorerDesc: "Học 10 lá bài đầu tiên",
      achPilgrimName: "Người Hành Hương",
      achPilgrimDesc: "Thành thạo toàn bộ Ẩn Chính",
      achKeeperName: "Người Giữ Tri Thức",
      achKeeperDesc: "Đạt 80% mức độ thành thạo",
      achFullName: "Bậc Thầy Huyền Bí",
      achFullDesc: "Ghi nhớ toàn bộ 78 lá bài",

      toastRemembered: "Tuyệt vời! Đã ghi nhớ lá bài.",
      toastReview: "Đã thêm vào danh sách cần ôn.",
      loading: "Đang tải bộ bài…",
      footerNote: "Được tạo ra để bạn học Tarot mỗi ngày.",
    },
    en: {
      appName: "Huyền Bài",
      navHome: "Home",
      navStudy: "Study",
      navQuiz: "Quiz",
      navExplorer: "Explorer",
      navProgress: "Progress",

      heroEyebrow: "A 78-card journey",
      heroTitle: "Learn Tarot like an adventure",
      heroSubtitle: "Memorize, explore, and master the whole deck — one card at a time.",
      nodeStudy: "Study",
      nodeQuiz: "Quiz",
      nodeExplorer: "Deck Explorer",
      nodeProgress: "Progress",

      statLearned: "Learned",
      statReview: "To review",
      statTotal: "Total cards",

      cardOfDay: "Card of the day",
      cardOfDayCta: "View detail",
      startStudy: "Start studying",
      continueStudy: "Continue studying",

      searchPlaceholder: "Search by name or keyword…",
      filterAll: "All",
      filterMajor: "Major Arcana",
      filterCups: "Cups",
      filterWands: "Wands",
      filterSwords: "Swords",
      filterPentacles: "Pentacles",
      noResults: "No matching cards found.",

      typeMajor: "Major Arcana",
      typeMinor: "Minor Arcana",
      upright: "Upright",
      reversed: "Reversed",
      keywords: "Keywords",
      reKeywords: "Reversed keywords",
      description: "Card imagery",
      meaning: "Meaning",
      close: "Close",
      studyThisCard: "Study this card",

      studyAskRecall: "Do you remember this card?",
      studyTapToReveal: "Tap to flip",
      revealName: "Reveal name & keywords",
      revealMeaning: "Reveal meaning",
      revealDescription: "Reveal imagery description",
      askResult: "Did you remember this card?",
      btnRemembered: "Remembered",
      btnReview: "Needs review",
      studyDone: "You've finished this study session!",
      studyDoneSub: "Come back later to keep reinforcing the rest.",
      studyAgain: "Study again",
      backHome: "Back home",
      studyOf: "of",

      quizTitle: "Choose a quiz mode",
      quizSub: "Questions are generated automatically from the deck data — play as many times as you like.",
      quizMeaningToCard: "Meaning → Card",
      quizMeaningToCardDesc: "Read the meaning, guess the card",
      quizCardToMeaning: "Card → Meaning",
      quizCardToMeaningDesc: "See the card, pick the right meaning",
      quizKeywordToCard: "Keyword → Card",
      quizKeywordToCardDesc: "Guess the card from a keyword",
      quizCardToKeyword: "Card → Keyword",
      quizCardToKeywordDesc: "See the card, pick the right keyword",
      quizTimed: "60-Second Challenge",
      quizTimedDesc: "Answer as many as you can in 60s",
      quizEndless: "Endless Mode",
      quizEndlessDesc: "Unlimited practice",
      quizQuestion: "Question",
      quizScore: "Score",
      quizWhichCard: "Which card is this?",
      quizWhichMeaning: "What does this card mean?",
      quizWhichKeyword: "Which keyword belongs to this card?",
      quizTimeUp: "Time's up!",
      quizResultTitle: "Your results",
      quizCorrect: "correct",
      quizPlayAgain: "Play again",
      quizBackMenu: "Choose another mode",
      quizNext: "Next question →",
      quizFinish: "See results",

      progressTitle: "Learning progress",
      progressSub: "Track your journey through all 78 Tarot cards.",
      masteryLabel: "Mastery level",
      journeyTitle: "Major Arcana Journey",
      journeySub: "From The Fool to The World — one step at a time.",
      suitTitle: "Progress by suit",
      achievementsTitle: "Achievements",
      lockedBadge: "Locked",
      resetProgress: "Reset all progress",
      resetConfirm: "Are you sure you want to erase all your learning progress?",
      statusNew: "Not studied",
      statusLearned: "Learned",
      statusReview: "Needs review",

      achExplorerName: "The Explorer",
      achExplorerDesc: "Learn your first 10 cards",
      achPilgrimName: "The Pilgrim",
      achPilgrimDesc: "Master the entire Major Arcana",
      achKeeperName: "The Keeper",
      achKeeperDesc: "Reach 80% mastery",
      achFullName: "The Grand Master",
      achFullDesc: "Learn all 78 cards",

      toastRemembered: "Nice! Card marked as learned.",
      toastReview: "Added to your review pile.",
      loading: "Loading the deck…",
      footerNote: "Made to help you learn Tarot every day.",
    },
  };

  let lang = localStorage.getItem("tarot_lang") || "vi";

  function t(key) {
    return (dict[lang] && dict[lang][key]) || dict.vi[key] || key;
  }
  function getLang() {
    return lang;
  }
  function setLang(l) {
    lang = dict[l] ? l : "vi";
    localStorage.setItem("tarot_lang", lang);
    document.documentElement.lang = lang;
    applyToDom();
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  function applyToDom() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = lang;
    applyToDom();
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  });

  return { t, getLang, setLang, applyToDom };
})();
