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
import ContributionHeatmap from "@/components/ContributionHeatmap";
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
    const commits = story?.stats.total_commits
      ? `${story.stats.total_commits.toLocaleString("en-US")} commits`
      : "commits";
    const contribs = story?.stats.total_contributors
      ? `${story.stats.total_contributors} contributors`
      : "contributors";
    const age = story?.stats.project_age_days
      ? `${Math.floor(story.stats.project_age_days / 365)}y`
      : "";
    const text = `${owner}/${repo} has ${commits} from ${contribs}${age ? ` over ${age}` : ""} 🚀 See the full story →`;
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
            <button
              type="button"
              onClick={handleShareReddit}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(148,163,184,0.15)",
                color: "#94a3b8",
              }}
              aria-label="Share on Reddit"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              Reddit
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <RepoHeader repo={story.repo} />
        <StatsGrid stats={story.stats} />
        <Timeline commits={story.commits} milestones={story.milestones} repoCreatedAt={story.repo.created_at} owner={owner} repo={repo} />
        <ContributionHeatmap commits={story.commits} owner={owner} repo={repo} />
        <CommitList commits={story.commits} totalCommits={story.stats.total_commits} />
        <Contributors contributors={story.contributors} />
        <BadgeSection owner={owner} repo={repo} />
      </div>
    </div>
  );
}
