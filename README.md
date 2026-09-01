# Subhankar Nag — Academic Website

Personal academic website of **Subhankar Nag**, Ph.d. Scholar in Computer Science and Engineering at IIT Bombay.

🌐 **Live site:** [subhankarnag.github.io](https://subhankarnag.github.io)

---

## About

This is a single-page academic website built with [Jekyll](https://jekyllrb.com/) and the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme, hosted on [GitHub Pages](https://pages.github.com/).

The site covers:
- Research interests
- Publications
- Projects
- Curriculum Vitae (education, experience, skills, achievements)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Jekyll](https://jekyllrb.com/) | Static site generator |
| [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes) | Theme (via `remote_theme`) |
| [GitHub Pages](https://pages.github.com/) | Hosting |
| Markdown + Kramdown | Content authoring |

---

## Project Structure

```
subhankarnag.github.io/
├── _config.yml             # Site configuration (author, theme, plugins)
├── _data/
│   └── navigation.yml      # Top navbar links (in-page anchors)
├── _includes/
│   ├── head/
│   │   └── custom.html     # Injects custom CSS into <head>
│   └── footer.html         # Custom footer (empty = uses theme default)
├── _pages/
│   ├── about.md            # Redirects → /#research
│   ├── cv.md               # Redirects → /#education
│   ├── education.md        # Redirects → /#education
│   ├── projects.md         # Redirects → /#projects
│   └── publications.md     # Redirects → /#publications
├── assets/
│   ├── css/
│   │   └── custom-styles.css   # Theme styles, light/dark mode, layout
│   ├── images/
│   │   └── iitb_dp_1.png       # Profile photo
│   ├── js/
│   │   └── darkmode.js         # Theme toggle logic
│   └── pdf/
│       └── cv.pdf              # Curriculum Vitae PDF
├── index.md                # Single-page homepage (all sections)
├── Gemfile                 # Ruby gem dependencies
└── .ruby-version           # Ruby version specification
```

---

## Local Development

### Prerequisites

- [Ruby](https://www.ruby-lang.org/) (use [rbenv](https://github.com/rbenv/rbenv) or [RVM](https://rvm.io/) to manage versions)
- [Bundler](https://bundler.io/) (`gem install bundler`)

### Setup & Run

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve --livereload

# Open in browser
# http://localhost:4000
```

> **Tip:** Changes to `_config.yml` require a server restart. All other edits hot-reload automatically.

---

## Updating Content

All content lives in [`index.md`](./index.md). Edit the relevant section directly:

| Section | Anchor ID | Location in `index.md` |
|---------|-----------|------------------------|
| Research Interests | `#research` | After intro paragraph |
| Publications | `#publications` | After research interests |
| Projects | `#projects` | After publications |
| Education | `#education` | After projects |

After editing, commit and push — GitHub Pages rebuilds automatically (usually within 1–2 minutes).

---

## Customisation

### Change theme skin
In `_config.yml`, change `minimal_mistakes_skin` to one of:
`"default"` · `"air"` · `"aqua"` · `"contrast"` · `"dark"` · `"dirt"` · `"neon"` · `"mint"` · `"plum"` · `"sunrise"`

### Add a new navigation link
In `_data/navigation.yml`, add an entry:
```yaml
- title: "Blog"
  url: /blog/
```

### Custom styles
Add CSS rules to [`assets/css/custom-styles.css`](./assets/css/custom-styles.css) — it is automatically injected via `_includes/head/custom.html`.

---

## Deployment

Pushes to the `main` (or `master`) branch trigger an automatic GitHub Pages build. No CI configuration needed.

---

## License

Site content © Subhankar Nag. The Minimal Mistakes theme is licensed under [MIT](https://github.com/mmistakes/minimal-mistakes/blob/master/LICENSE).
