"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GitBranch, ArrowRight, Star, GitFork, Zap } from "lucide-react";
import RecentSearches, { addRecentSearch } from "@/components/RecentSearches";

const EXAMPLE_REPOS = [
  {
    owner: "vercel",
    repo: "next.js",
    description: "The React Framework for the Web",
    stars: "125k",
    language: "TypeScript",
  },
  {
    owner: "facebook",
    repo: "react",
    description: "The library for web and native UIs",
    stars: "228k",
    language: "JavaScript",
  },
  {
    owner: "microsoft",
    repo: "vscode",
    description: "Visual Studio Code",
    stars: "165k",
    language: "TypeScript",
  },
  {
    owner: "torvalds",
    repo: "linux",
    description: "Linux kernel source tree",
    stars: "180k",
    language: "C",
  },
];

function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim();

  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/\s]+)/
  );
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, "") };
  }

  const slashMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (slashMatch) {
    return { owner: slashMatch[1], repo: slashMatch[2].replace(/\.git$/, "") };
  }

  return null;
}

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const parsed = parseRepoInput(input);
    if (!parsed) {
      setError("Enter a valid GitHub repo URL or owner/repo format.");
      return;
    }

    addRecentSearch(`${parsed.owner}/${parsed.repo}`);
    router.push(`/story/${parsed.owner}/${parsed.repo}`);
  }

  function handleExampleClick(owner: string, repo: string) {
    addRecentSearch(`${owner}/${repo}`);
    router.push(`/story/${owner}/${repo}`);
  }

  function handleRecentSelect(repo: string) {
    addRecentSearch(repo);
    router.push(`/story/${repo}`);
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0e1a" }}>
      {/* Nav */}
      <nav
        className="border-b px-6 py-4"
        style={{ borderColor: "rgba(148,163,184,0.1)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <GitBranch className="w-5 h-5" style={{ color: "#22d3ee" }} />
          <span
            className="font-mono font-bold tracking-tight"
            style={{ color: "#22d3ee" }}
          >
            commit-story
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Badge */}
          <div
            className="hero-fade hero-fade-1 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            style={{
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.2)",
              color: "#22d3ee",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Powered by GitHub API</span>
          </div>

          {/* Heading */}
          <h1
            className="hero-fade hero-fade-2 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            style={{ color: "#f1f5f9" }}
          >
            Turn your Git history
            <br />
            <span
              className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              into a story
            </span>
          </h1>

          <p
            className="hero-fade hero-fade-3 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "#94a3b8" }}
          >
            Visualize any GitHub repository's commit history as an interactive
            timeline, contributors map, and milestone journey.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="hero-fade hero-fade-4 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError("");
                  }}
                  placeholder="github.com/owner/repo or owner/repo"
                  className="w-full rounded-xl px-4 py-3.5 text-sm transition-all outline-none font-mono"
                  style={{
                    background: "rgba(15,22,41,0.8)",
                    border: "1px solid rgba(148,163,184,0.15)",
                    color: "#f1f5f9",
                    backdropFilter: "blur(12px)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#22d3ee";
                    e.currentTarget.style.boxShadow = "0 0 0 2px rgba(34,211,238,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label="GitHub repo URL or owner/repo"
                  aria-describedby={error ? "input-error" : undefined}
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl transition-opacity shrink-0 hover:opacity-90"
                style={{
                  background: "linear-gradient(to right, #22d3ee, #a78bfa)",
                  color: "#0a0e1a",
                }}
              >
                <span>View Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <p
                id="input-error"
                role="alert"
                className="mt-2 text-sm text-left"
                style={{ color: "#f87171" }}
              >
                {error}
              </p>
            )}
            <RecentSearches onSelect={handleRecentSelect} />
          </form>
        </div>

        {/* Example Repos */}
        <div className="hero-fade hero-fade-5 max-w-6xl w-full mt-24">
          <p
            className="text-sm text-center mb-6 uppercase tracking-widest"
            style={{ color: "#475569" }}
          >
            Try an example
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXAMPLE_REPOS.map((example) => (
              <button
                key={`${example.owner}/${example.repo}`}
                onClick={() => handleExampleClick(example.owner, example.repo)}
                className="group text-left rounded-xl p-5 transition-all"
                style={{
                  background: "rgba(15,22,41,0.8)",
                  border: "1px solid rgba(148,163,184,0.1)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(148,163,184,0.1)";
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <GitFork
                    className="w-4 h-4 transition-colors"
                    style={{ color: "#475569" }}
                  />
                  <span className="font-mono text-xs" style={{ color: "#475569" }}>
                    {example.owner}
                  </span>
                </div>
                <div
                  className="font-semibold mb-1 transition-colors"
                  style={{ color: "#f1f5f9" }}
                >
                  {example.repo}
                </div>
                <p
                  className="text-xs mb-4 line-clamp-2"
                  style={{ color: "#475569" }}
                >
                  {example.description}
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#475569" }}
                  >
                    <Star className="w-3 h-3" />
                    {example.stars}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "#334155" }}
                  >
                    {example.language}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t py-6 px-6"
        style={{ borderColor: "rgba(148,163,184,0.1)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: "#334155" }}>
          <span>Built by <a href="https://scuton.com" target="_blank" rel="noopener noreferrer" style={{ color: "#475569" }}>Scuton Technology</a></span>
          <span className="font-mono">commitstory.dev</span>
        </div>
      </footer>
    </main>
  );
}
