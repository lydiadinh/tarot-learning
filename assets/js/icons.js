/* ============================================================
   icons.js
   A small internal set of outline, stroke-based line icons.
   Every icon shares the same visual language: 24x24 grid,
   ~1.8px stroke, round joins, no fill, colored via currentColor
   so it can be recolored per suit/theme with plain CSS.
   ============================================================ */

const TarotIcons = (() => {
  const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

  const raw = {
    home: `<path ${S} d="M3 11.5 12 4l9 7.5"/><path ${S} d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9"/>`,

    study: `<path ${S} d="M12 6.5C10.2 5 7.8 4.4 4.5 4.6v13.4c3.3-.2 5.7.4 7.5 1.9 1.8-1.5 4.2-2.1 7.5-1.9V4.6c-3.3-.2-5.7.4-7.5 1.9Z"/><path ${S} d="M12 6.5v13.4"/>`,

    quiz: `<circle ${S} cx="12" cy="12" r="8.5"/><path ${S} d="M9.6 9.8c.2-1.4 1.4-2.3 2.7-2.2 1.4.1 2.4 1.1 2.3 2.4-.1 1.2-1 1.7-1.9 2.3-.7.5-1 .9-1 1.7"/><circle cx="11.7" cy="16.4" r="0.9" fill="currentColor" stroke="none"/>`,

    explore: `<circle ${S} cx="12" cy="12" r="8.5"/><path ${S} d="m14.8 9.2-1.6 4.4-4.4 1.6 1.6-4.4Z"/>`,

    progress: `<path ${S} d="M4 18.5C6 12 8 8.5 12 8.5s6 3.5 8 10"/><circle cx="12" cy="8.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="4" cy="18.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="20" cy="18.5" r="1.2" fill="currentColor" stroke="none"/>`,

    search: `<circle ${S} cx="10.5" cy="10.5" r="6.5"/><path ${S} d="m19.5 19.5-4.2-4.2"/>`,

    close: `<path ${S} d="M5.5 5.5 18.5 18.5"/><path ${S} d="M18.5 5.5 5.5 18.5"/>`,

    check: `<path ${S} d="m4.5 12.5 5 5 10-11"/>`,

    arrowRight: `<path ${S} d="M4.5 12h15"/><path ${S} d="m13 5.5 6.5 6.5-6.5 6.5"/>`,

    star: `<path ${S} d="M12 3.5 14.4 9l6 .6-4.5 4 1.3 5.9L12 16.6 6.8 19.5l1.3-5.9-4.5-4 6-.6Z"/>`,

    book: `<path ${S} d="M4.5 5.2A2.5 2.5 0 0 1 7 4.5h5v15H7a2.5 2.5 0 0 0-2.5.7Z"/><path ${S} d="M19.5 5.2A2.5 2.5 0 0 0 17 4.5h-5v15h5a2.5 2.5 0 0 1 2.5.7Z"/>`,

    key: `<circle ${S} cx="8" cy="12" r="3.6"/><path ${S} d="M11.2 12h9.3"/><path ${S} d="M17 12v3"/><path ${S} d="M20.5 12v2.4"/>`,

    tag: `<path ${S} d="M11 4.5h5.5a1 1 0 0 1 1 1V11a1 1 0 0 1-.3.7l-7.2 7.2a1 1 0 0 1-1.4 0l-5.5-5.5a1 1 0 0 1 0-1.4l7.2-7.2a1 1 0 0 1 .7-.3Z"/><circle cx="14.8" cy="8.2" r="1.1" fill="currentColor" stroke="none"/>`,

    timer: `<circle ${S} cx="12" cy="13" r="7.5"/><path ${S} d="M12 13V9"/><path ${S} d="M9.5 3.5h5"/>`,

    infinity: `<path ${S} d="M7 9.5a3.5 3.5 0 1 0 0 7c2.5 0 3.5-2 5-3.5s2.5-3.5 5-3.5a3.5 3.5 0 1 1 0 7c-2.5 0-3.5-2-5-3.5s-2.5-3.5-5-3.5Z"/>`,

    upright: `<path ${S} d="M12 19V5.5"/><path ${S} d="m6.5 10.5 5.5-5.5 5.5 5.5"/>`,

    reversed: `<path ${S} d="M12 5v13.5"/><path ${S} d="m6.5 13.5 5.5 5.5 5.5-5.5"/>`,

    // Suit glyphs, each with a distinct silhouette
    suitMajor: `<path ${S} d="M12 3.5v3"/><path ${S} d="M12 17.5v3"/><path ${S} d="M3.5 12h3"/><path ${S} d="M17.5 12h3"/><circle ${S} cx="12" cy="12" r="4"/>`,

    suitCups: `<path ${S} d="M6 5.5h12l-1 6.5a5 5 0 0 1-10 0Z"/><path ${S} d="M12 15.5V19"/><path ${S} d="M8 19h8"/>`,

    suitWands: `<path ${S} d="m7 19 10-14"/><path ${S} d="M15.5 3.8 17.5 6"/><path ${S} d="M17.5 3.8 15.5 6"/><path ${S} d="M4.7 7.5 4 4.7"/><path ${S} d="M4.7 4.7 4 7.5"/>`,

    suitSwords: `<path ${S} d="M6 18 18 6"/><path ${S} d="m14.5 6 3.5-.5-.5 3.5"/><path ${S} d="M6 18v-3.2"/><path ${S} d="M6 18H9.2"/>`,

    suitPentacles: `<circle ${S} cx="12" cy="12" r="8"/><path ${S} d="m12 7 1.7 3.6 3.8.4-2.9 2.6.8 3.9-3.4-2-3.4 2 .8-3.9-2.9-2.6 3.8-.4Z"/>`,

    // Achievement badges
    badgeExplorer: `<path ${S} d="M12 3.5v3.2"/><path ${S} d="m7.5 6 2 2.6"/><path ${S} d="m16.5 6-2 2.6"/><circle ${S} cx="12" cy="14" r="6.5"/><path ${S} d="m10 15.6 1-3.6 3.4 1.2-4.4 4.3Z"/>`,

    badgePilgrim: `<path ${S} d="M3.5 18.5 9 8l3 5 2-3.2 6.5 8.7Z"/><circle cx="9" cy="8" r="1.1" fill="currentColor" stroke="none"/>`,

    badgeKeeper: `<path ${S} d="M12 3.5c2.6 1 4.6 1.4 7 1.3v6.4c0 4.8-3 7.6-7 9-4-1.4-7-4.2-7-9V4.8c2.4.1 4.4-.3 7-1.3Z"/><path ${S} d="M9.3 12.2l1.9 1.9 3.5-3.9"/>`,
  };

  function svg(name, extraAttrs) {
    const inner = raw[name] || raw.star;
    const attrs = extraAttrs || "";
    return `<svg class="icon icon-${name}" ${attrs} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  }

  return { svg, raw };
})();
