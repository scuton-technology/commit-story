"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Trophy, Link2, Check } from "lucide-react";
import NavHeader from "@/components/NavHeader";
import type { RepoStats, RepoInfo } from "@/lib/github";

interface CompareData {
  repo: RepoInfo;
  stats: RepoStats;
}

function parseRepo(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/\s]+)/);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, "") };
  const slashMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (slashMatch) return { owner: slashMatch[1], repo: slashMatch[2].replace(/\.git$/, "") };
  return null;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

function formatAge(days: number): string {
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  const y = Math.floor(days / 365);
  const m = Math.floor((days % 365) / 30);
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

interface StatRowProps {
  label: string;
  v1: number;
  v2: number;
  format: (n: number) => string;
}

function StatRow({ label, v1, v2, format }: StatRowProps) {
  const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;
  return (
    <div
      className="rounded-xl p-4 grid grid-cols-3 items-center text-center"
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
    >
      <div>
        <span className="text-xl font-bold tabular-nums" style={{ color: winner === 1 ? "var(--accent)" : "var(--text-secondary)" }}>
          {format(v1)}
        </span>
        {winner === 1 && <span className="ml-1 text-xs" style={{ color: "var(--green)" }}>&blacktriangle;</span>}
      </div>
      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>{label}</span>
      <div>
        {winner === 2 && <span className="mr-1 text-xs" style={{ color: "var(--green)" }}>&blacktriangle;</span>}
        <span className="text-xl font-bold tabular-nums" style={{ color: winner === 2 ? "var(--accent)" : "var(--text-secondary)" }}>
          {format(v2)}
        </span>
      </div>
    </div>
  );
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [input1, setInput1] = useState(searchParams.get("repo1") ?? "");
  const [input2, setInput2] = useState(searchParams.get("repo2") ?? "");
  const [data1, setData1] = useState<CompareData | null>(null);
  const [data2, setData2] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function fetchRepo(owner: string, repo: string): Promise<CompareData> {
    const r = await fetch(`/api/story/${owner}/${repo}`);
    if (!r.ok) throw new Error(`Failed to load ${owner}/${repo}`);
    const data = await r.json();
    return { repo: data.repo, stats: data.stats };
  }

  async function runCompare(r1: string, r2: string) {
    const p1 = parseRepo(r1);
    const p2 = parseRepo(r2);
    if (!p1 || !p2) { setError("Enter valid owner/repo for both fields"); return; }
    setLoading(true);
    setError("");
    setData1(null);
    setData2(null);
    try {
      const [d1, d2] = await Promise.all([
        fetchRepo(p1.owner, p1.repo),
        fetchRepo(p2.owner, p2.repo),
      ]);
      setData1(d1);
      setData2(d2);
      router.replace(`/compare?repo1=${p1.owner}/${p1.repo}&repo2=${p2.owner}/${p2.repo}`, { scroll: false });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runCompare(input1, input2);
  }

  useEffect(() => {
    const r1 = searchParams.get("repo1");
    const r2 = searchParams.get("repo2");
    if (r1 && r2) {
      setInput1(r1);
      setInput2(r2);
      runCompare(r1, r2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  let winner = 0;
  if (data1 && data2) {
    let score1 = 0, score2 = 0;
    if (data1.stats.total_commits > data2.stats.total_commits) score1++; else if (data2.stats.total_commits > data1.stats.total_commits) score2++;
    if (data1.stats.total_contributors > data2.stats.total_contributors) score1++; else if (data2.stats.total_contributors > data1.stats.total_contributors) score2++;
    if (data1.stats.avg_commits_per_week > data2.stats.avg_commits_per_week) score1++; else if (data2.stats.avg_commits_per_week > data1.stats.avg_commits_per_week) score2++;
    winner = score1 > score2 ? 1 : score2 > score1 ? 2 : 0;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Compare Repos
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Put two repositories side by side and see which one leads
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>First repo</label>
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="vercel/next.js"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <span className="text-lg font-bold self-center pb-1" style={{ color: "var(--text-tertiary)" }}>vs</span>
          <div className="flex-1">
            <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>Second repo</label>
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              placeholder="facebook/react"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-opacity shrink-0 hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            {loading ? "Loading..." : "Compare"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="mt-2 text-sm" style={{ color: "var(--red)" }}>{error}</p>}
      </form>

      {/* Results */}
      {data1 && data2 && (
        <div className="space-y-6">
          {/* Repo names header */}
          <div className="grid grid-cols-3 items-center text-center">
            <div>
              <div className="font-semibold text-lg" style={{ color: winner === 1 ? "var(--accent)" : "var(--text)" }}>
                {data1.repo.full_name}
              </div>
              {winner === 1 && (
                <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--text-tertiary)" }}>VS</span>
            <div>
              <div className="font-semibold text-lg" style={{ color: winner === 2 ? "var(--accent)" : "var(--text)" }}>
                {data2.repo.full_name}
              </div>
              {winner === 2 && (
                <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>
          </div>

          {/* Stats comparison */}
          <div
            className="rounded-2xl p-6 space-y-3"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <StatRow label="Commits" v1={data1.stats.total_commits} v2={data2.stats.total_commits} format={formatNum} />
            <StatRow label="Contributors" v1={data1.stats.total_contributors} v2={data2.stats.total_contributors} format={formatNum} />
            <StatRow label="Age" v1={data1.stats.project_age_days} v2={data2.stats.project_age_days} format={formatAge} />
            <StatRow label="Weekly Avg" v1={data1.stats.avg_commits_per_week} v2={data2.stats.avg_commits_per_week} format={(n) => `${n}`} />
          </div>

          {/* Share */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg transition-all"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: copied ? "var(--accent)" : "var(--text-secondary)" }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => {
                const text = `${data1.repo.full_name} vs ${data2.repo.full_name} \u2014 who has more commits?`;
                window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg transition-all"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share on X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <NavHeader />
      <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-12 text-center" style={{ color: "var(--text-secondary)" }}>Loading...</div>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
