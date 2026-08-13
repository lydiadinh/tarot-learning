/* ============================================================
   Starfield — lightweight canvas particles. Purely ambient,
   pauses when tab hidden, respects reduced-motion.
   ============================================================ */
(function initStarfield() {
  document.addEventListener("DOMContentLoaded", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sky = document.createElement("div");
    sky.className = "sky";
    sky.innerHTML = '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>';
    document.body.prepend(sky);

    if (reduce) return;

    const canvas = document.createElement("canvas");
    canvas.id = "stars-canvas";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w, h, raf;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.round((w * h) / 22000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        s: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
      }));
    }
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(58,46,77,0.55)";
      stars.forEach((st) => {
        const twinkle = 0.5 + 0.5 * Math.sin(t / 900 + st.phase);
        ctx.globalAlpha = 0.15 + twinkle * 0.35;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(tick);
    });
    resize();
    raf = requestAnimationFrame(tick);
  });
})();
