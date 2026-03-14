"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CommitData } from "@/lib/github";
import StoryCard from "./StoryCard";

interface CommitListProps {
  commits: CommitData[];
  totalCommits?: number;
}

const PAGE_SIZE = 20;

const FILTER_TYPES = [
  { id: "all",      label: "All",      color: "#94a3b8" },
  { id: "feat",     label: "✨ feat",   color: "#4ade80" },
  { id: "fix",      label: "🐛 fix",    color: "#f87171" },
  { id: "refactor", label: "♻️ refactor", color: "#a78bfa" },
  { id: "docs",     label: "📝 docs",   color: "#60a5fa" },
  { id: "chore",    label: "🔧 chore",  color: "#64748b" },
  { id: "test",     label: "🧪 test",   color: "#fb923c" },
  { id: "ci",       label: "⚙️ ci",     color: "#94a3b8" },
  { id: "perf",     label: "⚡ perf",   color: "#fbbf24" },
] as const;

type FilterType = (typeof FILTER_TYPES)[number]["id"];

function getCommitType(message: string): string | null {
  const match = message.match(/^(\w+)(\(.+\))?!?:\s/);
  return match?.[1] ?? null;
}

export default function CommitList({ commits, totalCommits }: CommitListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Detect which types actually exist in this repo's commits
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    commits.forEach((c) => {
      const t = getCommitType(c.message);
      if (t) types.add(t);
    });
    return types;
  }, [commits]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return commits;
    return commits.filter((c) => getCommitType(c.message) === activeFilter);
  }, [commits, activeFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function setFilter(f: FilterType) {
    setActiveFilter(f);
    setVisibleCount(PAGE_SIZE);
  }

  function loadMore() {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  }

  if (commits.length === 0) return null;

  const isPartial = totalCommits !== undefined && totalCommits > commits.length;

  const visibleFilters = FILTER_TYPES.filter(
    (f) => f.id === "all" || availableTypes.has(f.id)
  );

  return (
    <section aria-labelledby="commits-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2
          className="text-base font-semibold"
          style={{ color: "#f1f5f9" }}
          id="commits-heading"
        >
          Commits
        </h2>
        <span className="text-xs font-mono" style={{ color: "#475569" }}>
          {visible.length} / {filtered.length} shown
          {activeFilter !== "all" && (
            <span style={{ color: "#334155" }}> (filtered)</span>
          )}
        </span>
      </div>

      {/* Partial data notice */}
      {isPartial && (
        <div
          className="mb-4 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
          style={{
            background: "rgba(34,211,238,0.06)",
            border: "1px solid rgba(34,211,238,0.15)",
            color: "#64748b",
          }}
        >
          <span style={{ color: "#22d3ee" }}>ℹ</span>
          Showing latest {commits.length.toLocaleString("en-US")} of{" "}
          <span style={{ color: "#f1f5f9", fontWeight: 500 }}>
            {totalCommits.toLocaleString("en-US")}
          </span>{" "}
          total commits
        </div>
      )}

      {/* Category filters — only shown if repo uses conventional commits */}
      {visibleFilters.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleFilters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="text-xs font-mono px-2.5 py-1 rounded-lg transition-all"
                style={{
                  background: isActive
                    ? `${f.color}18`
                    : "rgba(15,22,41,0.6)",
                  border: isActive
                    ? `1px solid ${f.color}50`
                    : "1px solid rgba(148,163,184,0.1)",
                  color: isActive ? f.color : "#475569",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((commit, i) => (
            <motion.div
              key={commit.sha}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, delay: i < PAGE_SIZE ? 0 : 0.05 }}
            >
              <StoryCard commit={commit} />
            </motion.div>
          ))}
        </AnimatePresence>

        {visible.length === 0 && (
          <div
            className="text-center py-12 text-sm"
            style={{ color: "#475569" }}
          >
            No commits match this filter.
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(15,22,41,0.8)",
              border: "1px solid rgba(148,163,184,0.15)",
              color: "#94a3b8",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)";
              e.currentTarget.style.color = "#22d3ee";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}
