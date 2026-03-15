"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, GitCommit, TrendingUp } from "lucide-react";
import NavHeader from "@/components/NavHeader";

interface TrendingRepo {
  owner: string;
  repo: string;
  description: string;
  stars: string;
  language: string;
  langColor: string;
  category: string[];
}

const REPOS: TrendingRepo[] = [
  { owner: "vercel", repo: "next.js", description: "The React Framework for the Web", stars: "125k", language: "TypeScript", langColor: "#3178c6", category: ["stars", "active"] },
  { owner: "facebook", repo: "react", description: "The library for web and native UIs", stars: "228k", language: "JavaScript", langColor: "#f1e05a", category: ["stars", "active"] },
  { owner: "microsoft", repo: "vscode", description: "Visual Studio Code", stars: "165k", language: "TypeScript", langColor: "#3178c6", category: ["stars", "active"] },
  { owner: "torvalds", repo: "linux", description: "Linux kernel source tree", stars: "180k", language: "C", langColor: "#555555", category: ["stars", "active"] },
  { owner: "denoland", repo: "deno", description: "A modern runtime for JavaScript and TypeScript", stars: "96k", language: "Rust", langColor: "#dea584", category: ["rising"] },
  { owner: "sveltejs", repo: "svelte", description: "Cybernetically enhanced web apps", stars: "80k", language: "JavaScript", langColor: "#f1e05a", category: ["rising"] },
  { owner: "vuejs", repo: "core", description: "The progressive JavaScript framework", stars: "47k", language: "TypeScript", langColor: "#3178c6", category: ["stars", "active"] },
  { owner: "golang", repo: "go", description: "The Go programming language", stars: "124k", language: "Go", langColor: "#00ADD8", category: ["stars", "active"] },
  { owner: "rust-lang", repo: "rust", description: "Empowering everyone to build reliable software", stars: "98k", language: "Rust", langColor: "#dea584", category: ["stars", "active"] },
  { owner: "microsoft", repo: "TypeScript", description: "TypeScript is a superset of JavaScript", stars: "101k", language: "TypeScript", langColor: "#3178c6", category: ["stars"] },
  { owner: "nodejs", repo: "node", description: "Node.js JavaScript runtime", stars: "108k", language: "JavaScript", langColor: "#f1e05a", category: ["stars", "active"] },
  { owner: "tailwindlabs", repo: "tailwindcss", description: "A utility-first CSS framework", stars: "83k", language: "TypeScript", langColor: "#3178c6", category: ["rising", "active"] },
];

const TABS = [
  { id: "all", label: "All", icon: <GitCommit className="w-3.5 h-3.5" /> },
  { id: "stars", label: "Most Stars", icon: <Star className="w-3.5 h-3.5" /> },
  { id: "active", label: "Most Active", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "rising", label: "Rising", icon: <TrendingUp className="w-3.5 h-3.5" /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TrendingPage() {
  const [tab, setTab] = useState<TabId>("all");

  const filtered = tab === "all" ? REPOS : REPOS.filter((r) => r.category.includes(tab));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <NavHeader />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
            Trending Stories
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Explore the commit history of the most popular open-source projects
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-all"
              style={{
                background: tab === t.id ? "var(--accent-light)" : "var(--bg-secondary)",
                border: `1px solid ${tab === t.id ? "var(--accent)" : "var(--border)"}`,
                color: tab === t.id ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Link
              key={`${r.owner}/${r.repo}`}
              href={`/story/${r.owner}/${r.repo}`}
              className="group rounded-2xl p-6 transition-all"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>
                {r.owner}
              </div>
              <div className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
                {r.repo}
              </div>
              <p className="text-xs mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                {r.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <Star className="w-3 h-3" style={{ color: "#eab308" }} />
                  {r.stars}
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: r.langColor }}
                  />
                  {r.language}
                </span>
              </div>
              <div
                className="mt-4 text-xs font-medium"
                style={{ color: "var(--accent)" }}
              >
                View Story &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
