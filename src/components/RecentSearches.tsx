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
          style={{ color: "#475569" }}
        >
          Recent
        </span>
        <button
          onClick={clear}
          className="text-xs transition-colors"
          style={{ color: "#334155" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recent.map((repo) => (
          <div key={repo} className="flex items-center group">
            <button
              onClick={() => onSelect(repo)}
              className="flex items-center gap-1.5 text-xs font-mono pl-3 pr-2 py-1.5 rounded-l-lg transition-all"
              style={{
                background: "rgba(15,22,41,0.8)",
                border: "1px solid rgba(148,163,184,0.1)",
                borderRight: "none",
                color: "#94a3b8",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)";
                e.currentTarget.style.color = "#22d3ee";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.1)";
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              <Clock className="w-3 h-3 shrink-0" />
              {repo}
            </button>
            <button
              onClick={() => remove(repo)}
              className="flex items-center justify-center px-1.5 py-1.5 rounded-r-lg transition-all opacity-0 group-hover:opacity-100"
              style={{
                background: "rgba(15,22,41,0.8)",
                border: "1px solid rgba(148,163,184,0.1)",
                borderLeft: "1px solid rgba(148,163,184,0.06)",
                color: "#334155",
              }}
              aria-label={`Remove ${repo}`}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
