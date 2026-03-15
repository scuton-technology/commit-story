"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import NavHeader from "@/components/NavHeader";

export default function WrappedLandingPage() {
  const router = useRouter();
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const username = input.trim().replace(/^@/, "");
    if (username) router.push(`/wrapped/${username}`);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <NavHeader />
      <div className="flex flex-col items-center justify-center px-6" style={{ minHeight: "calc(100vh - 65px)" }}>
        <div className="max-w-lg w-full text-center space-y-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <User className="w-3.5 h-3.5" />
            GitHub Wrapped
          </div>

          <h1 className="text-4xl font-bold" style={{ color: "var(--text)" }}>
            Your GitHub
            <br />
            <span style={{ color: "var(--accent)" }}>
              at a glance
            </span>
          </h1>

          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Enter a GitHub username to see their profile summary &mdash; top repos, languages, stars, and more.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="username"
              className="flex-1 rounded-xl px-4 py-3.5 text-sm outline-none"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button
              type="submit"
              className="flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              Go <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
