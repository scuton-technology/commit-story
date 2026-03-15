"use client";

import { useEffect, useMemo, useState } from "react";
import type { CommitData } from "@/lib/github";

interface ContributionHeatmapProps {
  commits: CommitData[];   // fallback if API fails
  owner: string;
  repo: string;
}

interface WeekActivity {
  week: number;
  days: number[];
  total: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function cellColor(count: number): string {
  if (count === 0) return "var(--bg-tertiary)";
  if (count === 1) return "#bbf7d0";
  if (count <= 3) return "#86efac";
  if (count <= 6) return "#4ade80";
  if (count <= 10) return "#22c55e";
  return "#16a34a";
}

interface Cell {
  dateKey: string;      // "YYYY-MM-DD"
  count: number;
}

export default function ContributionHeatmap({ commits, owner, repo }: ContributionHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [apiWeeks, setApiWeeks] = useState<WeekActivity[] | null>(null);
  const [apiStatus, setApiStatus] = useState<"loading" | "ok" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;
    async function fetchActivity() {
      try {
        const r = await fetch(`/api/activity/${owner}/${repo}`);
        if (cancelled) return;
        if (r.status === 202) {
          await new Promise((res) => setTimeout(res, 4000));
          if (cancelled) return;
          const r2 = await fetch(`/api/activity/${owner}/${repo}`);
          if (cancelled) return;
          if (!r2.ok) { setApiStatus("fallback"); return; }
          const data = await r2.json() as WeekActivity[];
          if (Array.isArray(data) && data.length > 0) {
            setApiWeeks(data);
            setApiStatus("ok");
          } else {
            setApiStatus("fallback");
          }
          return;
        }
        if (!r.ok) { setApiStatus("fallback"); return; }
        const data = await r.json() as WeekActivity[];
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setApiWeeks(data);
          setApiStatus("ok");
        } else {
          setApiStatus("fallback");
        }
      } catch {
        if (!cancelled) setApiStatus("fallback");
      }
    }
    fetchActivity();
    return () => { cancelled = true; };
  }, [owner, repo]);

  const { grid, monthLabels, totalCommits } = useMemo(() => {
    let cells: Cell[][] = [];
    let total = 0;

    if (apiStatus === "ok" && apiWeeks) {
      const weeks = apiWeeks.slice(-52);
      cells = weeks.map((w) =>
        w.days.map((count, dayIdx) => {
          const date = new Date((w.week + dayIdx * 86400) * 1000);
          const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
          total += count;
          return { dateKey: key, count };
        })
      );
    } else if (apiStatus === "fallback") {
      const countMap: Record<string, number> = {};
      commits.forEach((c) => {
        const d = new Date(c.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        countMap[key] = (countMap[key] ?? 0) + 1;
      });
      total = commits.length;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDay = new Date(today);
      startDay.setDate(startDay.getDate() - 363);
      startDay.setDate(startDay.getDate() - startDay.getDay());

      for (let w = 0; w < 52; w++) {
        const col: Cell[] = [];
        for (let d = 0; d < 7; d++) {
          const date = new Date(startDay);
          date.setDate(startDay.getDate() + w * 7 + d);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          col.push({ dateKey: key, count: countMap[key] ?? 0 });
        }
        cells.push(col);
      }
    } else {
      return { grid: [], monthLabels: [], totalCommits: 0 };
    }

    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;
    cells.forEach((col, wi) => {
      const firstCell = col[0];
      if (firstCell) {
        const d = new Date(firstCell.dateKey + "T12:00:00Z");
        if (d.getUTCMonth() !== lastMonth) {
          months.push({ label: MONTHS[d.getUTCMonth()]!, col: wi });
          lastMonth = d.getUTCMonth();
        }
      }
    });

    return { grid: cells, monthLabels: months, totalCommits: total };
  }, [apiWeeks, apiStatus, commits]);

  const CELL = 13;
  const GAP = 2;
  const LABEL_HEIGHT = 18;
  const DAY_LABEL_WIDTH = 28;

  return (
    <section
      className="rounded-2xl p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
          Commit Activity
        </h2>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {apiStatus === "loading" && "Loading\u2026"}
          {apiStatus === "ok" && `${totalCommits.toLocaleString("en-US")} commits \u00b7 last 52 weeks`}
          {apiStatus === "fallback" && `Based on latest ${commits.length} commits`}
        </span>
      </div>

      {apiStatus === "loading" && (
        <div
          className="rounded-xl animate-pulse"
          style={{ height: 120, background: "var(--bg-tertiary)" }}
        />
      )}

      {(apiStatus === "ok" || apiStatus === "fallback") && grid.length > 0 && (
        <div className="overflow-x-auto">
          <div style={{ position: "relative", paddingLeft: DAY_LABEL_WIDTH }}>
            {/* Month labels */}
            <div style={{ display: "flex", height: LABEL_HEIGHT, position: "relative", marginBottom: 4 }}>
              {monthLabels.map((m, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: m.col * (CELL + GAP),
                    fontSize: 10,
                    color: "var(--text-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: GAP, position: "relative" }}>
              {/* Day labels */}
              <div
                style={{
                  position: "absolute",
                  left: -DAY_LABEL_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  gap: GAP,
                }}
              >
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    style={{
                      height: CELL,
                      fontSize: 9,
                      color: i % 2 === 1 ? "var(--text-tertiary)" : "transparent",
                      lineHeight: `${CELL}px`,
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid */}
              {grid.map((col, wi) => (
                <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                  {col.map((cell) => (
                    <div
                      key={cell.dateKey}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        background: cellColor(cell.count),
                        cursor: cell.count > 0 ? "pointer" : "default",
                      }}
                      onMouseEnter={(e) => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        const section = (e.currentTarget.closest("section") as HTMLElement)?.getBoundingClientRect();
                        setTooltipPos({
                          x: rect.left - (section?.left ?? 0) + CELL / 2,
                          y: rect.top - (section?.top ?? 0) - 8,
                        });
                        setTooltip({ date: cell.dateKey, count: cell.count });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 rounded-lg px-2.5 py-1.5 text-xs shadow-lg"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 36,
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            whiteSpace: "nowrap",
            transform: "translateX(-50%)",
          }}
        >
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>{tooltip.count}</span>
          {" "}commit{tooltip.count !== 1 ? "s" : ""} on{" "}
          {new Date(tooltip.date + "T12:00:00Z").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}
        </div>
      )}

      {/* Legend */}
      {(apiStatus === "ok" || apiStatus === "fallback") && (
        <div className="flex items-center gap-1.5 mt-4 justify-end">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Less</span>
          {[0, 1, 3, 6, 11].map((n) => (
            <div key={n} style={{ width: 12, height: 12, borderRadius: 2, background: cellColor(n) }} />
          ))}
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>More</span>
        </div>
      )}
    </section>
  );
}
