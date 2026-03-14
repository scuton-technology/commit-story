"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RepoStory } from "@/lib/github";
import RepoHeader from "@/components/RepoHeader";
import StatsGrid from "@/components/StatsGrid";
import Timeline from "@/components/Timeline";
import CommitList from "@/components/CommitList";
import Contributors from "@/components/Contributors";
import StoryLoading from "./loading";
import BadgeSection from "@/components/BadgeSection";
import Link from "next/link";
import { ArrowLeft, Link2, Check, Share2, Linkedin } from "lucide-react";

export default function StoryPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [story, setStory] = useState<RepoStory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  }

  function handleShareX() {
    const text = `Explore the commit history of ${owner}/${repo} on CommitStory`;
    const url = window.location.href;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleShareLinkedIn() {
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleShareReddit() {
    const title = `Commit history of ${owner}/${repo} — visual story`;
    const url = window.location.href;
    window.open(
      `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  useEffect(() => {
    if (!owner || !repo) return;
    setLoading(true);
    setError(null);

    fetch(`/api/story/${owner}/${repo}`)
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API hatası (${r.status})`);
        return r.json() as Promise<RepoStory>;
      })
      .then((data) => {
        setStory(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, [owner, repo]);

  if (loading) return <StoryLoading />;

  if (error || !story) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#0a0e1a" }}
      >
        <div className="p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#64748b" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div
            className="rounded-2xl p-8 max-w-md w-full text-center"
            style={{
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#f87171" }}>
              Failed to load repo
            </h2>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              {error ?? "Unknown error"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: "rgba(30,41,59,0.8)",
                color: "#cbd5e1",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0e1a" }}>
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(10,14,26,0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(148,163,184,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#64748b" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span style={{ color: "#334155" }}>/</span>
          <span className="font-mono text-sm" style={{ color: "#cbd5e1" }}>
            {owner}/{repo}
          </span>

          {/* Share actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(148,163,184,0.15)",
                color: copied ? "#22d3ee" : "#94a3b8",
              }}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Link2 className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy link"}
            </button>

            <button
              type="button"
              onClick={handleShareX}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(148,163,184,0.15)",
                color: "#94a3b8",
              }}
              aria-label="Share on X"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button
              type="button"
              onClick={handleShareLinkedIn}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(148,163,184,0.15)",
                color: "#94a3b8",
              }}
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <RepoHeader repo={story.repo} />
        <StatsGrid stats={story.stats} />
        <Timeline commits={story.commits} milestones={story.milestones} />
        <CommitList commits={story.commits} />
        <Contributors contributors={story.contributors} />
        <BadgeSection owner={owner} repo={repo} />
      </div>
    </div>
  );
}
