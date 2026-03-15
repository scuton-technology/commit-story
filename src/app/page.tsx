"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, GitFork, Zap } from "lucide-react";
import RecentSearches, { addRecentSearch } from "@/components/RecentSearches";
import NavHeader from "@/components/NavHeader";

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
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg)" }}>
      <NavHeader />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Badge */}
          <div
            className="hero-fade hero-fade-1 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Powered by GitHub API</span>
          </div>

          {/* Heading */}
          <h1
            className="hero-fade hero-fade-2 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Turn your Git history
            <br />
            <span style={{ color: "var(--accent)" }}>
              into a story
            </span>
          </h1>

          <p
            className="hero-fade hero-fade-3 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Visualize any GitHub repository&#39;s commit history as an interactive
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
                  className="w-full rounded-xl px-4 py-3.5 text-sm transition-all outline-none"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-light)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label="GitHub repo URL or owner/repo"
                  aria-describedby={error ? "input-error" : undefined}
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl transition-opacity shrink-0 hover:opacity-90"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
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
                style={{ color: "var(--red)" }}
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
            style={{ color: "var(--text-tertiary)" }}
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
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <GitFork
                    className="w-4 h-4"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {example.owner}
                  </span>
                </div>
                <div
                  className="font-semibold mb-1"
                  style={{ color: "var(--text)" }}
                >
                  {example.repo}
                </div>
                <p
                  className="text-xs mb-4 line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {example.description}
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Star className="w-3 h-3" />
                    {example.stars}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
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
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
          <span>Built by <a href="https://scuton.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }}>Scuton Technology</a></span>
          <span>commitstory.dev</span>
        </div>
      </footer>
    </main>
  );
}
