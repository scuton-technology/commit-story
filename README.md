<div align="center">

# 🎬 Commit Story

**Turn any GitHub repository's commit history into an interactive visual story.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Live Demo](https://commitstory.dev) · [Report Bug](https://github.com/scuton-technology/commit-story/issues) · [Request Feature](https://github.com/scuton-technology/commit-story/issues)

<!-- TODO: Add demo GIF here -->
<!-- ![Commit Story Demo](./public/demo.gif) -->

</div>

---

## What is it?

Commit Story visualizes any GitHub repository's commit history as an interactive, beautiful story. Explore project evolution, understand contributor journeys, and celebrate milestones — all in one page.

## Features

- **Interactive Timeline** — Commits visualized chronologically with D3.js heatmap coloring
- **Contributor Leaderboard** — See who contributed what, with progress bars and medals
- **Project Stats** — Total commits, contributors, project age, most active day
- **Milestone Detection** — Auto-detects first commits, releases, refactors, and 100-commit marks
- **Embeddable Badge** — Drop a live badge into any README
- **Share Button** — One-click copy link + share on X (Twitter)
- **OG Image** — Auto-generated preview card when shared on social media
- **Shareable URL** — Every repo gets a unique, permanent story page

## Quick Start

```bash
git clone https://github.com/scuton-technology/commit-story.git
cd commit-story
npm install
cp .env.example .env.local
# Add your GITHUB_TOKEN to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), paste any GitHub repo URL, and view the story.

## API

```bash
# Get repo story as JSON
GET /api/story/:owner/:repo

# Embeddable SVG badge
GET /api/badge/:owner/:repo

# OG image (1200x630)
GET /api/og/:owner/:repo
```

## README Badge

Add a live CommitStory badge to your project:

```markdown
[![Commit Story](https://commitstory.dev/api/badge/your-username/your-repo)](https://commitstory.dev/story/your-username/your-repo)
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | Full-stack framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling |
| **D3.js** | Timeline visualization |
| **Framer Motion** | Animations |
| **GitHub API (Octokit)** | Repo data |
| **Vercel** | Deployment |

## Project Structure

```
commit-story/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── story/[owner]/[repo]/   # JSON story endpoint
│   │   │   ├── og/[owner]/[repo]/      # OG image generation
│   │   │   └── badge/[owner]/[repo]/   # SVG badge
│   │   └── story/[owner]/[repo]/       # Story page
│   ├── components/
│   │   ├── Timeline.tsx       # D3 commit timeline
│   │   ├── StoryCard.tsx      # Individual commit card
│   │   ├── Contributors.tsx   # Contributor leaderboard
│   │   ├── StatsGrid.tsx      # Stats cards
│   │   └── RepoHeader.tsx     # Repo info header
│   └── lib/
│       └── github.ts          # GitHub API client + story builder
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

## Docker

```bash
docker compose up -d
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Credits

Built with ❤️ by [Scuton Technology](https://scuton.com)

---

<div align="center">

**[⬆ Back to top](#-commit-story)**

⭐ If you find this useful, give it a star!

</div>
