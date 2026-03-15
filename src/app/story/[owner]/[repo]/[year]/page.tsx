"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, TrendingUp, Link2, Check } from "lucide-react";
import NavHeader from "@/components/NavHeader";

interface YearData {
  year: number;
  totalCommits: number;
  monthlyCommits: number[];
  mostActiveMonth: string;
  uniqueContributors: number;
  repoFullName: string;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function YearInReviewPage() {
  const { owner, repo, year } = useParams<{ owner: string; repo: string; year: string }>();
  const [data, setData] = useState<YearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!owner || !repo || !year) return;
    setLoading(true);
    fetch(`/api/year/${owner}/${repo}/${year}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load year data");
        return r.json() as Promise<YearData>;
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e: Error) => { setError(e.message); setLoading(false); });
  }, [owner, repo, year]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <NavHeader />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href={`/story/${owner}/${repo}`}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {owner}/{repo}
        </Link>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ height: 100, background: "var(--bg-tertiary)" }} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--red)" }}>No data available</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="text-6xl font-bold tabular-nums mb-2"
                style={{ color: "var(--accent)" }}
              >
                {data.year}
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                Year in Review
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {data.repoFullName}
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <Calendar className="w-4 h-4 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text)" }}>
                  {data.totalCommits.toLocaleString()}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Commits in {data.year}</div>
              </div>
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <Users className="w-4 h-4 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text)" }}>
                  {data.uniqueContributors}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Contributors</div>
              </div>
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <TrendingUp className="w-4 h-4 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                <div className="text-lg font-bold" style={{ color: "var(--text)" }}>
                  {data.mostActiveMonth}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Most Active Month</div>
              </div>
            </div>

            {/* Monthly bar chart */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text)" }}>Monthly Breakdown</h2>
              <div className="flex items-end gap-2" style={{ height: 200 }}>
                {data.monthlyCommits.map((count, i) => {
                  const max = Math.max(...data.monthlyCommits, 1);
                  const height = Math.max(4, (count / max) * 180);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {count > 0 ? count : ""}
                      </span>
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{
                          height,
                          background: "var(--accent)",
                          opacity: count > 0 ? 0.7 : 0.1,
                        }}
                      />
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {MONTHS_SHORT[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Share */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: copied ? "var(--accent)" : "var(--text-secondary)" }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Share"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const text = `${data.repoFullName} had ${data.totalCommits.toLocaleString()} commits in ${data.year}! Most active month: ${data.mostActiveMonth}`;
                  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, "_blank", "noopener,noreferrer");
                }}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Share on X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
