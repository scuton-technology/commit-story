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
      style={{ backgroundColor: "#0a0e1a" }}
    >
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <GitBranch className="w-5 h-5" style={{ color: "#22d3ee" }} />
          <span className="font-mono font-bold" style={{ color: "#22d3ee" }}>
            commit-story
          </span>
        </div>

        {/* 404 */}
        <div
          className="text-8xl font-bold font-mono tabular-nums"
          style={{
            background: "linear-gradient(to right, #22d3ee, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: "#f1f5f9" }}>
            Page not found
          </h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            This repo story doesn&apos;t exist — or maybe you mistyped the URL.
          </p>
        </div>

        {/* Example repos */}
        <div
          className="rounded-2xl p-5 text-left"
          style={{
            background: "rgba(15,22,41,0.8)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#334155" }}>
            Try one of these
          </p>
          <div className="space-y-2">
            {EXAMPLES.map((ex) => (
              <Link
                key={`${ex.owner}/${ex.repo}`}
                href={`/story/${ex.owner}/${ex.repo}`}
                className="flex items-center justify-between group rounded-lg px-3 py-2 transition-all"
                style={{ border: "1px solid rgba(148,163,184,0.08)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.08)";
                }}
              >
                <span className="text-sm font-mono" style={{ color: "#cbd5e1" }}>
                  {ex.owner}/{ex.repo}
                </span>
                <span className="text-xs" style={{ color: "#22d3ee" }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#64748b" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
