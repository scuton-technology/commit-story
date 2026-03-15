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
    <div className="min-h-screen" style={{ backgroundColor: "#0a0e1a" }}>
      <NavHeader />
      <div className="flex flex-col items-center justify-center px-6" style={{ minHeight: "calc(100vh - 65px)" }}>
        <div className="max-w-lg w-full text-center space-y-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}
          >
            <User className="w-3.5 h-3.5" />
            GitHub Wrapped
          </div>

          <h1 className="text-4xl font-bold" style={{ color: "#f1f5f9" }}>
            Your GitHub
            <br />
            <span
              className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              at a glance
            </span>
          </h1>

          <p className="text-sm" style={{ color: "#64748b" }}>
            Enter a GitHub username to see their profile summary — top repos, languages, stars, and more.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="username"
              className="flex-1 rounded-xl px-4 py-3.5 text-sm font-mono outline-none"
              style={{ background: "rgba(15,22,41,0.8)", border: "1px solid rgba(148,163,184,0.15)", color: "#f1f5f9" }}
            />
            <button
              type="submit"
              className="flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(to right, #a78bfa, #22d3ee)", color: "#0a0e1a" }}
            >
              Go <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
