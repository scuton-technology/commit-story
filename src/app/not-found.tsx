"use client";

import Link from "next/link";
import { GitBranch, ArrowLeft } from "lucide-react";

const EXAMPLES = [
  { owner: "vercel", repo: "next.js" },
  { owner: "facebook", repo: "react" },
  { owner: "microsoft", repo: "vscode" },
  { owner: "torvalds", repo: "linux" },
];

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <GitBranch className="w-5 h-5" style={{ color: "var(--accent)" }} />
          <span className="font-bold" style={{ color: "var(--accent)" }}>
            Commit Story
          </span>
        </div>

        {/* 404 */}
        <div
          className="text-8xl font-bold tabular-nums"
          style={{ color: "var(--text)" }}
        >
          404
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
            Page not found
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            This repo story doesn&apos;t exist — or maybe you mistyped the URL.
          </p>
        </div>

        {/* Example repos */}
        <div
          className="rounded-xl p-5 text-left"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-tertiary)" }}>
            Try one of these
          </p>
          <div className="space-y-2">
            {EXAMPLES.map((ex) => (
              <Link
                key={`${ex.owner}/${ex.repo}`}
                href={`/story/${ex.owner}/${ex.repo}`}
                className="flex items-center justify-between group rounded-lg px-3 py-2 transition-all"
                style={{ border: "1px solid var(--border)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <span className="text-sm font-mono" style={{ color: "var(--text)" }}>
                  {ex.owner}/{ex.repo}
                </span>
                <span className="text-xs" style={{ color: "var(--accent)" }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
