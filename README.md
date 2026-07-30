# Tarot Journey

Tarot Journey is a Tarot learning platform, not a reading site and not an
encyclopedia. The goal is simple: help you memorize and understand all 78
cards through flashcards, quizzes, a constellation-style deck explorer, and
a progress journey. It is built with plain HTML, CSS, and vanilla
JavaScript, so it runs anywhere, including GitHub Pages, with no build step
and no backend.

## Features

* Flashcard study mode with a four step reveal flow (image, name and
  keywords, meaning and reversed keywords, full description) followed by a
  self judged "Đã nhớ" or "Cần ôn thêm" check.
* Weighted spaced repetition so cards marked "Cần ôn thêm" resurface more
  often.
* Six quiz modes generated automatically from the data file: Meaning to
  Card, Card to Meaning, Keyword to Card, Card to Keyword, a 60 second
  timed challenge, and an endless practice mode.
* A constellation style deck explorer with suit filters and a live,
  animated search gallery.
* A Major Arcana journey path, radial progress rings, and unlockable
  achievement badges.
* Vietnamese and English interface, with card names always kept in
  English.
* Everything is stored in the browser through LocalStorage. No account,
  no server, no tracking.

## Folder structure

```
.
├── index.html            Homepage with the floating card and orbit nav
├── flashcard.html         Study mode
├── quiz.html               Quiz mode
├── explorer.html            Deck explorer
├── progress.html              Progress and achievements
├── data/
│   └── tarotMeaning.json    All 78 cards: name, keywords, meanings, image
├── assets/
│   ├── css/
│   │   ├── style.css        Shared tokens, header, buttons, modal
│   │   ├── home.css          Homepage specific styles
│   │   ├── flashcard.css      Flashcard specific styles
│   │   ├── quiz.css            Quiz specific styles
│   │   ├── explorer.css         Explorer specific styles
│   │   └── progress.css          Progress specific styles
│   ├── js/
│   │   ├── data.js            Loads and normalizes tarotMeaning.json
│   │   ├── storage.js          LocalStorage state and spaced repetition
│   │   ├── icons.js             Inline SVG line icon set
│   │   ├── common.js             Shared header, i18n, toast, starfield
│   │   ├── card-modal.js          Shared card detail modal
│   │   ├── main.js                 Homepage logic
│   │   ├── flashcard.js             Study mode logic
│   │   ├── quiz.js                   Quiz mode logic
│   │   ├── explorer.js                Explorer logic
│   │   └── progress.js                 Progress page logic
│   └── images/                Card artwork, one file per card
└── README.md
```

## Running it locally

Because the app loads `data/tarotMeaning.json` with `fetch`, it needs to be
served over HTTP rather than opened directly as a `file://` path. Any of
the following work.

Using Python:

```bash
python3 -m http.server 8000
```

Using Node:

```bash
npx serve .
```

Then open `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this project to it.

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. In your repository, open **Settings** then **Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a
   branch**.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. GitHub will publish the site at
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`. The first deployment can
   take a minute or two.

No build tools, bundlers, or environment variables are required.

## Customizing the deck

The app never hardcodes card names, meanings, or the total number of
cards. Everything is read from `data/tarotMeaning.json` at runtime, so you
can edit the deck freely.

Each entry in the JSON file uses this shape:

```json
{
  "name": "The Fool",
  "keywords": "Khởi đầu; Tiềm năng; Ngây thơ",
  "reKeywords": "Do dự; Liều lĩnh",
  "description": ["Paragraph one.", "Paragraph two."],
  "meaning": ["Paragraph one.", "Paragraph two."],
  "reMeaning": ["Paragraph one."],
  "image": "1.png"
}
```

Notes:

* `keywords` and `reKeywords` are semicolon separated strings.
* `description`, `meaning`, and `reMeaning` accept either a single string
  or an array of paragraphs.
* `image` is a filename that must exist in `assets/images/`.
* The card's suit (Major Arcana, Wands, Cups, Swords, or Pentacles) is
  detected automatically from the card name, so there is nothing extra to
  configure.
* Adding, removing, or renaming cards updates every page automatically:
  the explorer, the flashcard pool, the quiz question bank, and the
  Major Arcana journey all read the same source file.

## Design notes

* Colors, spacing, and type scale live as CSS custom properties at the
  top of `assets/css/style.css`.
* All interface icons are hand drawn, stroke based SVG on a 24 by 24
  grid, colored with `currentColor` so they inherit theme colors per
  suit. There is no icon font and no emoji used as interface icons.
* The interface text is bilingual. UI labels switch between Vietnamese
  and English through the language toggle in the header, while card
  names always stay in English.

## License

This project is provided as is for personal or educational use. Replace
the card artwork and text with your own licensed content if you plan to
publish or distribute the app further.
