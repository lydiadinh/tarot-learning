/* ============================================================
   Homepage — orbit hero, stats, card of the day
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await TarotData.load();
  const cards = TarotData.getAll();

  renderOrbit();
  renderStats();
  renderDailyCard(cards);

  document.addEventListener("langchange", () => renderStats());
});

function renderOrbit() {
  const system = document.getElementById("orbit-system");
  const nodes = [
    { icon: "🃏", labelKey: "nodeStudy", href: "flashcard.html", angle: -55 },
    { icon: "❓", labelKey: "nodeQuiz", href: "quiz.html", angle: 35 },
    { icon: "🔭", labelKey: "nodeExplorer", href: "explorer.html", angle: 145 },
    { icon: "🌙", labelKey: "nodeProgress", href: "progress.html", angle: 235 },
  ];
  const heroImg = document.getElementById("hero-card-img");

  function place() {
    const rect = system.getBoundingClientRect();
    const radius = rect.width * 0.46;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    document.querySelectorAll(".orbit-node").forEach((n) => n.remove());
    nodes.forEach((n, i) => {
      const rad = (n.angle * Math.PI) / 180;
      const x = cx + radius * Math.cos(rad);
      const y = cy + radius * Math.sin(rad);
      const el = document.createElement("a");
      el.href = n.href;
      el.className = "orbit-node";
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.animationDelay = `${i * 0.4}s`;
      el.innerHTML = `<span class="node-dot">${n.icon}</span><span class="label" data-i18n="${n.labelKey}">${I18N.t(n.labelKey)}</span>`;
      system.appendChild(el);
    });
  }
  place();
  window.addEventListener("resize", place);

  // Hero card = deterministic "featured" card, changes daily
  const cards = TarotData.getAll();
  if (cards.length) {
    const dayIndex = dayOfYear() % cards.length;
    const featured = cards[dayIndex];
    heroImg.src = TarotData.imagePath(featured);
    heroImg.alt = featured.name;
  }
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

function renderStats() {
  const s = TarotStorage.stats();
  const cards = TarotData.getAll();
  document.getElementById("stat-learned").textContent = s.learned;
  document.getElementById("stat-review").textContent = s.review;
  document.getElementById("stat-total").textContent = cards.length || 78;
}

function renderDailyCard(cards) {
  if (!cards.length) return;
  const idx = dayOfYear() % cards.length;
  const card = cards[idx];
  document.getElementById("daily-card-img").src = TarotData.imagePath(card);
  document.getElementById("daily-card-img").alt = card.name;
  document.getElementById("daily-card-name").textContent = card.name;
  document.getElementById("daily-card-type").textContent =
    card.suit === "major" ? I18N.t("typeMajor") : I18N.t("typeMinor");
  document.getElementById("daily-card-kw").textContent = card.keywords.slice(0, 3).join(" · ");
  document.getElementById("daily-card-btn").addEventListener("click", () => openCardModal(card));
}
