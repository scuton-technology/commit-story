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
    <div className="min-h-screen" style={{ backgroundColor: "#0a0e1a" }}>
      <NavHeader />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href={`/story/${owner}/${repo}`}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "#64748b" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {owner}/{repo}
        </Link>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ height: 100, background: "rgba(30,41,59,0.6)" }} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#f87171" }}>No data available</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>{error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="text-6xl font-bold font-mono tabular-nums mb-2"
                style={{
                  background: "linear-gradient(to right, #22d3ee, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {data.year}
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>
                Year in Review
              </h1>
              <p className="font-mono text-sm mt-1" style={{ color: "#64748b" }}>
                {data.repoFullName}
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: "rgba(15,22,41,0.8)", border: "1px solid rgba(148,163,184,0.1)" }}
              >
                <Calendar className="w-4 h-4 mx-auto mb-2" style={{ color: "#22d3ee" }} />
                <div className="text-2xl font-bold font-mono" style={{ color: "#22d3ee" }}>
                  {data.totalCommits.toLocaleString()}
                </div>
                <div className="text-xs mt-1" style={{ color: "#475569" }}>Commits in {data.year}</div>
              </div>
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: "rgba(15,22,41,0.8)", border: "1px solid rgba(148,163,184,0.1)" }}
              >
                <Users className="w-4 h-4 mx-auto mb-2" style={{ color: "#a78bfa" }} />
                <div className="text-2xl font-bold font-mono" style={{ color: "#a78bfa" }}>
                  {data.uniqueContributors}
                </div>
                <div className="text-xs mt-1" style={{ color: "#475569" }}>Contributors</div>
              </div>
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: "rgba(15,22,41,0.8)", border: "1px solid rgba(148,163,184,0.1)" }}
              >
                <TrendingUp className="w-4 h-4 mx-auto mb-2" style={{ color: "#fbbf24" }} />
                <div className="text-lg font-bold" style={{ color: "#fbbf24" }}>
                  {data.mostActiveMonth}
                </div>
                <div className="text-xs mt-1" style={{ color: "#475569" }}>Most Active Month</div>
              </div>
            </div>

            {/* Monthly bar chart */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(15,22,41,0.8)", border: "1px solid rgba(148,163,184,0.1)" }}
            >
              <h2 className="text-base font-semibold mb-6" style={{ color: "#f1f5f9" }}>Monthly Breakdown</h2>
              <div className="flex items-end gap-2" style={{ height: 200 }}>
                {data.monthlyCommits.map((count, i) => {
                  const max = Math.max(...data.monthlyCommits, 1);
                  const height = Math.max(4, (count / max) * 180);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-mono" style={{ color: "#64748b" }}>
                        {count > 0 ? count : ""}
                      </span>
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{
                          height,
                          background: `linear-gradient(to top, #22d3ee, #a78bfa)`,
                          opacity: count > 0 ? 0.8 : 0.15,
                        }}
                      />
                      <span className="text-xs font-mono" style={{ color: "#475569" }}>
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
                style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(148,163,184,0.15)", color: copied ? "#22d3ee" : "#94a3b8" }}
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
                style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(148,163,184,0.15)", color: "#94a3b8" }}
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
