"use client";

import { useEffect, useRef, useState } from "react";
import { GitCommit, Users, Calendar, TrendingUp } from "lucide-react";
import type { RepoStats } from "@/lib/github";

function useCountUp(
  target: number,
  duration = 1400
): { count: number; ref: React.RefObject<HTMLDivElement | null> } {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setTriggered(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || target === 0) return;
    let rafId: number;
    let done = false;
    const start = performance.now();
    const tick = (now: number) => {
      if (done) return;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCount(target); // guarantee exact final value
      }
    };
    rafId = requestAnimationFrame(tick);
    // Fallback: if rAF is throttled (inactive tab), force final value
    const fallbackTimer = setTimeout(() => {
      if (!done) setCount(target);
    }, duration + 200);
    return () => {
      done = true;
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimer);
    };
  }, [triggered, target, duration]);

  return { count, ref };
}

interface StatsGridProps {
  stats: RepoStats;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

function formatAge(days: number): string {
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return months > 0 ? `${years}y ${months}mo` : `${years}y`;
}

interface StatCardConfig {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const { count: animatedCommits, ref: commitsRef } = useCountUp(stats.total_commits);
  const { count: animatedContributors, ref: contribRef } = useCountUp(stats.total_contributors);
  const { count: animatedDays, ref: daysRef } = useCountUp(stats.project_age_days);

  const cards: StatCardConfig[] = [
    {
      label: "Total Commits",
      value: formatNumber(animatedCommits),
      sublabel: `~${stats.avg_commits_per_week < 1 ? "< 1" : stats.avg_commits_per_week} commits/week`,
      icon: <GitCommit className="w-4 h-4" />,
      cardRef: commitsRef,
    },
    {
      label: "Contributors",
      value: formatNumber(animatedContributors),
      sublabel: "developers",
      icon: <Users className="w-4 h-4" />,
      cardRef: contribRef,
    },
    {
      label: "Project Age",
      value: formatAge(animatedDays),
      sublabel: `${animatedDays.toLocaleString("en-US")} days`,
      icon: <Calendar className="w-4 h-4" />,
      cardRef: daysRef,
    },
    {
      label: "Most Active Day",
      value: stats.most_active_day,
      sublabel: "by commit count",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  return (
    <section aria-label="Repo istatistikleri" className="space-y-4">
      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            ref={card.cardRef}
            className="rounded-2xl p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="flex items-center gap-2 mb-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              <span style={{ color: "var(--accent)" }}>{card.icon}</span>
              <span
                className="text-xs uppercase tracking-wider font-medium"
              >
                {card.label}
              </span>
            </div>
            <div
              className="text-3xl font-bold tabular-nums"
              style={{ color: "var(--text)" }}
            >
              {card.value}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              {card.sublabel}
            </div>
          </div>
        ))}
      </div>

      {/* Wide summary bar */}
      <div
        className="rounded-2xl px-6 py-4 flex flex-wrap gap-x-10 gap-y-3"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Top Author
          </div>
          <div className="font-medium text-sm" style={{ color: "var(--text)" }}>
            @{stats.most_active_author}
          </div>
        </div>

        <div
          className="w-px self-stretch"
          style={{ background: "var(--border)" }}
          aria-hidden="true"
        />

        <div>
          <div
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Weekly Average
          </div>
          <div className="font-medium text-sm" style={{ color: "var(--text)" }}>
            {stats.avg_commits_per_week < 1 ? "< 1" : stats.avg_commits_per_week} commits/wk
          </div>
        </div>
      </div>
    </section>
  );
}
