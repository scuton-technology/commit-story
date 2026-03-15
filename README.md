<div align="center">

<img src="https://commitstory.dev/favicon.ico" width="60" />

# Commit Story

### See the story behind any GitHub repository.

Paste a repo URL. Get an interactive timeline, contributor map, and milestone journey — instantly.

[![Live Demo](https://img.shields.io/badge/Live_Demo-commitstory.dev-2563eb?style=for-the-badge)](https://commitstory.dev)
&nbsp;&nbsp;
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

**[Try it now →](https://commitstory.dev)**&emsp;·&emsp;**[Compare Repos](https://commitstory.dev/compare)**&emsp;·&emsp;**[GitHub Wrapped](https://commitstory.dev/wrapped)**&emsp;·&emsp;**[Report Bug](https://github.com/scuton-technology/commit-story/issues)**

<br />

<a href="https://commitstory.dev/story/vercel/next.js">
  <img src="https://commitstory.dev/api/og/vercel/next.js" width="720" alt="Commit Story — vercel/next.js" />
</a>

<br />
<sub>↑ Auto-generated story card for vercel/next.js</sub>

</div>

<br />

---

<br />

## What is Commit Story?

Every repository has a story — the first commit, the early contributors, the milestones, the growth. **Commit Story makes it visible.**

Enter any public GitHub repo URL and get a complete visual overview: how active is the project, who drives it, when did it peak, and how does it compare to others.

<br />

## Features

**📊 Repository Story** — Stats at a glance: total commits, contributors, project age, weekly commit average, most active day, top author.

**📈 Commit Activity Heatmap** — GitHub-style contribution grid showing the last 52 weeks of activity, powered by the GitHub Statistics API.

**🕐 Interactive Timeline** — Visual timeline of the latest 100 commits with milestone markers (first commit, version tags, 100th commit milestone).

**⚔️ Compare Repos** — Put two repositories side by side. See which one has more commits, more contributors, higher weekly velocity. Winner badge included.

**🎁 GitHub Wrapped** — Enter any username and see their profile summary: top repos by stars, most-used languages, total stars, member since date.

**📅 Year in Review** — Annual commit breakdown with a monthly bar chart. See which month was the busiest and how many contributors were active.

**📛 README Badge** — Drop a live badge into your project's README with one click. Three styles: Flat, Square, For the Badge.

**🔗 Embeddable Widget** — A compact card widget you can iframe into any page or blog post.

**🌙 Dark Mode** — Toggle between light and dark themes. Light mode is the default.

**🔍 Category Filters** — Filter commits by type: feat, fix, docs, chore, perf.

**📤 Share Buttons** — One-click share to X/Twitter, LinkedIn, Reddit, or copy the link.

<br />

## Live Examples

| Page | Link |
|------|------|
| Story — vercel/next.js | [commitstory.dev/story/vercel/next.js](https://commitstory.dev/story/vercel/next.js) |
| Story — facebook/react | [commitstory.dev/story/facebook/react](https://commitstory.dev/story/facebook/react) |
| Compare — Next.js vs React | [commitstory.dev/compare?repo1=vercel/next.js&repo2=facebook/react](https://commitstory.dev/compare?repo1=vercel/next.js&repo2=facebook/react) |
| Wrapped — Linus Torvalds | [commitstory.dev/wrapped/torvalds](https://commitstory.dev/wrapped/torvalds) |
| Year in Review — Next.js 2025 | [commitstory.dev/story/vercel/next.js/2025](https://commitstory.dev/story/vercel/next.js/2025) |
| Trending | [commitstory.dev/trending](https://commitstory.dev/trending) |

<br />

## Add a Badge to Your README

Show off your project's commit stats:

```markdown
[![Commit Story](https://commitstory.dev/api/badge/YOUR_OWNER/YOUR_REPO?style=flat)](https://commitstory.dev/story/YOUR_OWNER/YOUR_REPO)
```

**Example:**

[![Commit Story](https://commitstory.dev/api/badge/vercel/next.js?style=flat)](https://commitstory.dev/story/vercel/next.js)

Three styles available: `flat` (default), `square`, `for-the-badge`.

<br />

## API

All endpoints are public and free to use.

```
GET /api/story/:owner/:repo        → Repository story as JSON
GET /api/badge/:owner/:repo        → SVG badge (query: ?style=flat|square|for-the-badge)
GET /api/og/:owner/:repo           → OG image (1200×630)
```

<br />

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) — App Router, Server Components |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Data | [GitHub REST API](https://docs.github.com/en/rest) via [Octokit](https://github.com/octokit/octokit.js) |
| Heatmap | [GitHub Statistics API](https://docs.github.com/en/rest/metrics/statistics) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |
| Hosting | [Vercel](https://vercel.com/) |

<br />

## Getting Started

### Prerequisites

- Node.js 18+
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (for higher API rate limits)

### Install

```bash
git clone https://github.com/scuton-technology/commit-story.git
cd commit-story
npm install
```

### Configure

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your GitHub token:

```
GITHUB_TOKEN=ghp_your_token_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste any repo URL.

<br />

## Self-Hosting with Docker

```bash
docker compose up -d
```

The app runs on port 3000. Set `GITHUB_TOKEN` as an environment variable.

<br />

## Project Structure

```
commit-story/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── story/        # Repository story page
│   │   ├── compare/      # Compare two repos
│   │   ├── trending/     # Trending repositories
│   │   ├── wrapped/      # GitHub user wrapped
│   │   └── api/          # Badge, OG image, story endpoints
│   ├── components/       # React components
│   └── lib/              # GitHub API client, utilities
├── public/               # Static assets
├── Dockerfile            # Docker support
├── docker-compose.yml    # Docker Compose
└── next.config.ts        # Next.js configuration
```

<br />

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br />

## License

MIT — see [LICENSE](LICENSE) for details.

<br />

## Credits

Built by [Scuton Technology](https://scuton.com)

---

<div align="center">

<br />

**If you find this useful, [give it a ⭐](https://github.com/scuton-technology/commit-story)**

<br />

<sub>Made with code, coffee, and curiosity.</sub>

</div>
