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
  { id: "all",      label: "All",      color: "var(--text-secondary)" },
  { id: "feat",     label: "feat",     color: "#059669" },
  { id: "fix",      label: "fix",      color: "#dc2626" },
  { id: "refactor", label: "refactor", color: "#7c3aed" },
  { id: "docs",     label: "docs",     color: "#2563eb" },
  { id: "chore",    label: "chore",    color: "#6b7280" },
  { id: "test",     label: "test",     color: "#ea580c" },
  { id: "ci",       label: "ci",       color: "#6b7280" },
  { id: "perf",     label: "perf",     color: "#eab308" },
] as const;

type FilterType = (typeof FILTER_TYPES)[number]["id"];

function getCommitType(message: string): string | null {
  const match = message.match(/^(\w+)(\(.+\))?!?:\s/);
  return match?.[1] ?? null;
}

export default function CommitList({ commits, totalCommits }: CommitListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

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
          style={{ color: "var(--text)" }}
          id="commits-heading"
        >
          Commits
        </h2>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {visible.length} / {filtered.length} shown
          {activeFilter !== "all" && (
            <span style={{ color: "var(--text-tertiary)" }}> (filtered)</span>
          )}
        </span>
      </div>

      {/* Partial data notice */}
      {isPartial && (
        <div
          className="mb-4 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
          style={{
            background: "var(--accent-light)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <span style={{ color: "var(--accent)" }}>i</span>
          Showing latest {commits.length.toLocaleString("en-US")} of{" "}
          <span style={{ color: "var(--text)", fontWeight: 500 }}>
            {totalCommits.toLocaleString("en-US")}
          </span>{" "}
          total commits
        </div>
      )}

      {/* Category filters */}
      {visibleFilters.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleFilters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="text-xs px-2.5 py-1 rounded-lg transition-all"
                style={{
                  background: isActive
                    ? `${f.color}15`
                    : "var(--bg-secondary)",
                  border: isActive
                    ? `1px solid ${f.color}40`
                    : "1px solid var(--border)",
                  color: isActive ? f.color : "var(--text-secondary)",
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
            style={{ color: "var(--text-secondary)" }}
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
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}
