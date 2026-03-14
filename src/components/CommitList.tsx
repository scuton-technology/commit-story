"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CommitData } from "@/lib/github";
import StoryCard from "./StoryCard";

interface CommitListProps {
  commits: CommitData[];
}

const PAGE_SIZE = 20;

export default function CommitList({ commits }: CommitListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (commits.length === 0) return null;

  const visible = commits.slice(0, visibleCount);
  const hasMore = visibleCount < commits.length;

  function loadMore() {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, commits.length));
  }

  return (
    <section aria-labelledby="commits-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: "#f1f5f9" }} id="commits-heading">
          Commits
        </h2>
        <span className="text-xs font-mono" style={{ color: "#475569" }}>
          {visible.length} / {commits.length} shown
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
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
            Load more ({commits.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}
