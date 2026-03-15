"use client";

import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";

const STORAGE_KEY = "commitstory_recent";
const MAX_ITEMS = 8;

export function addRecentSearch(repo: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current: string[] = stored ? JSON.parse(stored) : [];
    const next = [repo, ...current.filter((r) => r !== repo)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage not available
  }
}

interface RecentSearchesProps {
  onSelect: (repo: string) => void;
}

export default function RecentSearches({ onSelect }: RecentSearchesProps) {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {}
  }, []);

  function clear() {
    setRecent([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  function remove(repo: string) {
    const next = recent.filter((r) => r !== repo);
    setRecent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  if (recent.length === 0) return null;

  return (
    <div className="mt-4 text-left max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs uppercase tracking-wider font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          Recent
        </span>
        <button
          onClick={clear}
          className="text-xs transition-colors"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recent.map((repo) => (
          <div key={repo} className="flex items-center group">
            <button
              onClick={() => onSelect(repo)}
              className="flex items-center gap-1.5 text-xs pl-3 pr-2 py-1.5 rounded-l-lg transition-all"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRight: "none",
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
              <Clock className="w-3 h-3 shrink-0" />
              {repo}
            </button>
            <button
              onClick={() => remove(repo)}
              className="flex items-center justify-center px-1.5 py-1.5 rounded-r-lg transition-all opacity-0 group-hover:opacity-100"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderLeft: "1px solid var(--border)",
                color: "var(--text-tertiary)",
              }}
              aria-label={`Remove ${repo}`}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
