/* ============================================================
   Flashcard mode — Image → Recall → Guess → Reveal → Reinforcement
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await TarotData.load();

  const params = new URLSearchParams(window.location.search);
  const singleId = params.get("id");

  let queue;
  if (singleId && TarotData.getById(singleId)) {
    queue = [TarotData.getById(singleId)];
  } else {
    const SESSION_SIZE = 15;
    queue = TarotStorage.weightedQueue(TarotData.getAll()).slice(0, SESSION_SIZE);
  }

  let index = 0;
  let step = 0; // 0=image only, 1=name+kw, 2=meaning, 3=description+actions

  const shell = document.getElementById("study-shell");

  function renderShell() {
    shell.innerHTML = `
      <div class="study-progress">
        <div class="bar"><i id="progress-bar"></i></div>
        <span class="count" id="progress-count"></span>
      </div>
      <div class="flip-stage">
        <div class="flip-card" id="flip-card">
          <div class="face front">
            <img id="card-img" src="" alt="" />
            <span class="prompt-badge" id="prompt-badge" data-i18n="studyAskRecall">${I18N.t("studyAskRecall")}</span>
          </div>
        </div>
      </div>
      <div class="reveal-stack" id="reveal-stack"></div>
      <div class="study-controls" id="study-controls" style="display:none">
        <button class="btn btn-review" id="btn-review">${I18N.t("btnReview")}</button>
        <button class="btn btn-remember" id="btn-remember">${I18N.t("btnRemembered")}</button>
      </div>
    `;
  }

  function renderCard() {
    if (index >= queue.length) {
      renderDone();
      return;
    }
    step = 0;
    renderShell();
    const card = queue[index];
    document.getElementById("progress-bar").style.width = `${(index / queue.length) * 100}%`;
    document.getElementById("progress-count").textContent = `${index + 1} ${I18N.t("studyOf")} ${queue.length}`;
    document.getElementById("card-img").src = TarotData.imagePath(card);
    document.getElementById("card-img").alt = card.name;

    document.getElementById("flip-card").addEventListener("click", () => advanceStep(card));
  }

  function advanceStep(card) {
    if (step >= 3) return;
    step++;
    const stack = document.getElementById("reveal-stack");
    const badge = document.getElementById("prompt-badge");

    if (step === 1) {
      badge.textContent = I18N.t("revealMeaning");
      stack.insertAdjacentHTML(
        "beforeend",
        `<div class="reveal-item panel">
           <h4>${card.name}</h4>
           <div class="kw-row">${card.keywords.map((k) => `<span class="kw">${escapeHtml(k)}</span>`).join("")}</div>
         </div>`
      );
    } else if (step === 2) {
      badge.textContent = I18N.t("revealDescription");
      stack.insertAdjacentHTML(
        "beforeend",
        `<div class="reveal-item panel">
           <h4>${I18N.t("meaning")}</h4>
           ${card.meaning.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
         </div>`
      );
    } else if (step === 3) {
      badge.textContent = I18N.t("askResult");
      stack.insertAdjacentHTML(
        "beforeend",
        `<div class="reveal-item panel">
           <h4>${I18N.t("description")}</h4>
           ${card.description.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
         </div>`
      );
      document.getElementById("study-controls").style.display = "flex";
      document.getElementById("btn-remember").addEventListener("click", () => resolve(card, true));
      document.getElementById("btn-review").addEventListener("click", () => resolve(card, false));
    }
  }

  function resolve(card, remembered) {
    TarotStorage.markCard(card.id, remembered);
    showToast(remembered ? I18N.t("toastRemembered") : I18N.t("toastReview"));
    index++;
    setTimeout(renderCard, 350);
  }

  function renderDone() {
    shell.innerHTML = `
      <div class="state-msg panel" style="padding:44px 24px;">
        <div style="font-size:40px;margin-bottom:10px;">🌟</div>
        <h3 style="font-family:var(--font-display);font-size:20px;margin-bottom:8px;">${I18N.t("studyDone")}</h3>
        <p>${I18N.t("studyDoneSub")}</p>
        <div class="study-controls" style="margin-top:22px;max-width:320px;margin-left:auto;margin-right:auto;">
          <a class="btn btn-ghost" href="index.html">${I18N.t("backHome")}</a>
          <a class="btn btn-primary" href="flashcard.html">${I18N.t("studyAgain")}</a>
        </div>
      </div>
    `;
  }

  if (!queue.length) {
    shell.innerHTML = `<div class="state-msg">${I18N.t("noResults")}</div>`;
    return;
  }
  renderCard();
});
