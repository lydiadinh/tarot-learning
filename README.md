# 🔮 Huyền Bài — Tarot Learning Web App

A mobile-first, gamified web app for memorizing all 78 Tarot cards. Built with
**plain HTML, CSS, and vanilla JavaScript only** — no frameworks, no build step.
Fully static, so it deploys directly to GitHub Pages.

Vietnamese is the default interface language, with an English toggle. Card
names always stay in English (`The Fool`, `Ace of Cups`, …) regardless of the
selected language.

---

## ✨ Features

- **Orbit-style homepage** — a floating hero card surrounded by four
  navigation nodes instead of a boring nav bar.
- **Flashcard study mode** — progressive reveal flow (image → name & keywords
  → meaning → imagery description → "remembered / needs review"), with a
  weighted spaced-repetition queue so weaker cards resurface more often.
- **Deck Explorer** — animated card gallery, filterable by Major Arcana /
  Cups / Wands / Swords / Pentacles, each with its own accent color, plus
  live search by name or keyword.
- **Quiz mode** — six auto-generated quiz types (Meaning→Card, Card→Meaning,
  Keyword→Card, Card→Keyword, 60-second Timed Challenge, Endless practice).
  Every question is generated from `data/tarotMeaning.json` at runtime.
- **Progress / Journey page** — a mastery ring, per-suit progress bars, a
  Major Arcana "journey path" from The Fool to The World, and unlockable
  achievement badges.
- **Everything persists locally** via `localStorage` — no backend, no
  account, no tracking.

The app never hardcodes card names, meanings, or the "78 cards" count —
everything is derived dynamically from `data/tarotMeaning.json`, so the app
adapts automatically if you edit that file.

---

## 📁 Folder structure

```
.
├── index.html            Homepage (orbit hero navigation)
├── flashcard.html         Flashcard study mode
├── quiz.html               Quiz mode
├── explorer.html           Deck explorer
├── progress.html            Progress / journey / achievements
├── data/
│   └── tarotMeaning.json    Source of truth for all 78 cards
├── assets/
│   ├── css/
│   │   ├── tokens.css       Design tokens (colors, type, radii)
│   │   └── style.css        Layout, components, page styles
│   ├── js/
│   │   ├── data.js           Loads & normalizes tarotMeaning.json
│   │   ├── i18n.js            Vietnamese / English dictionary + switch
│   │   ├── storage.js          localStorage: progress, spaced repetition, achievements
│   │   ├── particles.js         Ambient starfield / aurora background
│   │   ├── nav.js                 Shared nav highlighting, toast, escapeHtml
│   │   ├── card-modal.js           Shared card-detail bottom sheet
│   │   ├── home.js                  Homepage logic
│   │   ├── explorer.js               Explorer filtering & search
│   │   ├── flashcard.js               Flashcard study flow
│   │   ├── quiz.js                     Quiz question generation & scoring
│   │   └── progress.js                  Progress page rendering
│   └── images/
│       └── 1.png … 78.png              Card artwork (id matches JSON key)
└── README.md
```

---

## 🚀 Run locally

Because the app uses `fetch()` to load `data/tarotMeaning.json`, opening
`index.html` directly via `file://` will fail in most browsers (CORS).
Serve it with any static server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

---

## 🌐 Deploy to GitHub Pages

1. Create a new GitHub repository and push this folder's contents to it
   (the repo root should contain `index.html` directly, not a subfolder).

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tarot learning app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then **Save**.
5. Wait a minute, then visit `https://<your-username>.github.io/<your-repo>/`.

No build step, no environment variables, no server — it just works.

---

## 🎨 Customization guide

### Add / edit cards
Edit `data/tarotMeaning.json`. Each entry looks like:

```json
"1": {
  "name": "The Fool",
  "type": "1",
  "keywords": "Khởi đầu; Tiềm năng; Ngây thơ",
  "reKeywords": "Do dự; Liều lĩnh",
  "description": ["..."],
  "meaning": ["..."],
  "reMeaning": ["..."],
  "image": "1.png"
}
```

- `type`: `"1"` = Major Arcana, `"0"` = Minor Arcana.
- Suit (Cups / Wands / Swords / Pentacles) is inferred automatically from the
  card `name` for Minor Arcana cards — no separate field needed.
- `keywords` / `reKeywords` are semicolon-separated strings.
- Add the matching artwork file to `assets/images/` (filename referenced by
  `image`). The app resolves images relative to the deployed site path, so it
  works both at a domain root and at a GitHub Pages subpath.

The whole app — counts, filters, quiz questions, journey path — updates
automatically. Nothing needs to change in the JS or HTML.

### Change the color palette
All colors are CSS custom properties in `assets/css/tokens.css`
(`--gold`, `--lavender`, `--sky`, `--mint`, `--coral`, …) and suit-specific
gradients (`--suit-cups-a/b`, etc.). Edit them there; every component
references these variables.

### Change fonts
Fonts are loaded from Google Fonts in each HTML `<head>` and referenced via
`--font-display`, `--font-body`, `--font-utility` in `tokens.css`.

### Add a UI language
Add a new language object to the `dict` in `assets/js/i18n.js` and a button
in each page's `.lang-switch` block. Card names are never translated by
design (see `card-modal.js`, `flashcard.js`, `explorer.js` — they always
render `card.name` verbatim).

### Adjust spaced repetition
The weighting logic lives in `TarotStorage.weightedQueue()` inside
`assets/js/storage.js`. Cards marked "cần ôn thêm" get a higher draw weight;
cards with a higher Leitner `box` level (more consecutive "đã nhớ") get a
lower weight, so they appear less often once mastered.

### Adjust quiz question count / timer
Constants `FIXED_LENGTH` (default 10) and the 60-second timer are defined at
the top of `assets/js/quiz.js`.

---

## 🧭 Design notes

The visual direction avoids dashboard/admin aesthetics on purpose — warm
parchment backgrounds, gilded gold accents, soft aurora gradients, and a
constellation-style orbit navigation instead of a generic sidebar or card
grid. Each suit has its own color identity (fire/coral for Wands,
water/rose for Cups, wind/sky for Swords, earth/mint for Pentacles, and
cosmic lavender for the Major Arcana) applied consistently across filters,
badges, and the card detail sheet.
