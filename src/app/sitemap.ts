import type { MetadataRoute } from "next";

const FEATURED_REPOS = [
  { owner: "vercel", repo: "next.js" },
  { owner: "facebook", repo: "react" },
  { owner: "microsoft", repo: "vscode" },
  { owner: "torvalds", repo: "linux" },
  { owner: "sindresorhus", repo: "execa" },
  { owner: "tailwindlabs", repo: "tailwindcss" },
  { owner: "vitejs", repo: "vite" },
  { owner: "denoland", repo: "deno" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://commitstory.dev";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const repoRoutes: MetadataRoute.Sitemap = FEATURED_REPOS.map(({ owner, repo }) => ({
    url: `${base}/story/${owner}/${repo}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...repoRoutes];
}
