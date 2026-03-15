"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { CommitData, MilestoneData } from "@/lib/github";

interface TimelineProps {
  commits: CommitData[];
  milestones: MilestoneData[];
  repoCreatedAt?: string;
  owner?: string;
  repo?: string;
}

interface TooltipData {
  x: number;
  y: number;
  commit: CommitData;
}

const MILESTONE_ICONS: Record<MilestoneData["type"], string> = {
  "first-commit": "\u{1F680}",
  "release": "\u{1F3F7}\uFE0F",
  "big-refactor": "\u267B\uFE0F",
  "contributor-joined": "\u{1F44B}",
  "100-commits": "\u{1F4AF}",
  "1000-stars": "\u2B50",
};

const MILESTONE_COLORS: Record<MilestoneData["type"], string> = {
  "first-commit": "#059669",
  "release": "#d97706",
  "big-refactor": "#7c3aed",
  "contributor-joined": "#2563eb",
  "100-commits": "#ea580c",
  "1000-stars": "#eab308",
};

const COMMIT_TYPE_COLORS: Record<string, string> = {
  feat: "#059669", fix: "#dc2626", refactor: "#7c3aed",
  docs: "#2563eb", chore: "#6b7280", test: "#ea580c",
  ci: "#6b7280", style: "#ec4899", perf: "#eab308",
};

function getCommitTypeColor(message: string): string | null {
  const match = message.match(/^(\w+)(\(.+\))?!?:\s/);
  const type = match?.[1];
  return type ? (COMMIT_TYPE_COLORS[type] ?? null) : null;
}

export default function Timeline({ commits, milestones, repoCreatedAt, owner, repo }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  const sortedCommits = [...commits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || sortedCommits.length === 0) return;

    const SVG_HEIGHT = 160;
    const margin = { top: 48, right: 24, bottom: 32, left: 24 };
    const width = containerWidth;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = SVG_HEIGHT - margin.top - margin.bottom;
    const midY = innerHeight / 2;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", SVG_HEIGHT)
      .attr("viewBox", `0 0 ${width} ${SVG_HEIGHT}`)
      .attr("aria-hidden", "true");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const dates = sortedCommits.map((c) => new Date(c.date));
    const domainStart = dates[0];
    const domainEnd = dates[dates.length - 1] ?? new Date();
    const span = domainEnd.getTime() - domainStart.getTime();
    const pad = Math.max(span * 0.05, 86400000);
    const xScale = d3
      .scaleTime()
      .domain([new Date(domainStart.getTime() - pad), new Date(domainEnd.getTime() + pad)])
      .range([0, innerWidth]);

    // Background track
    g.append("rect")
      .attr("x", 0)
      .attr("y", midY - 1)
      .attr("width", innerWidth)
      .attr("height", 2)
      .attr("rx", 1)
      .attr("fill", "var(--border)");

    // Commit dots — accent blue
    g.selectAll<SVGCircleElement, CommitData>(".commit-dot")
      .data(sortedCommits)
      .join("circle")
      .attr("class", "commit-dot")
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", midY)
      .attr("r", 5)
      .attr("fill", "var(--accent)")
      .attr("fill-opacity", 0.6)
      .attr("stroke", "none")
      .on("mouseover", function (event: MouseEvent, d: CommitData) {
        d3.select(this).attr("r", 8).attr("fill-opacity", 1);
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            commit: d,
          });
        }
      })
      .on("mousemove", function (event: MouseEvent) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip((prev) =>
            prev
              ? {
                  ...prev,
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top,
                }
              : null
          );
        }
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 5).attr("fill-opacity", 0.6);
        setTooltip(null);
      })
      .on("click", function (_event: MouseEvent, d: CommitData) {
        if (owner && repo) {
          window.open(
            `https://github.com/${owner}/${repo}/commit/${d.sha}`,
            "_blank",
            "noopener,noreferrer"
          );
        }
      })
      .style("cursor", owner && repo ? "pointer" : "default");

    // Milestone markers
    milestones.forEach((milestone) => {
      const mx = xScale(new Date(milestone.date));
      const color = MILESTONE_COLORS[milestone.type] ?? "var(--accent)";
      const icon = MILESTONE_ICONS[milestone.type] ?? "\u2022";

      g.append("circle")
        .attr("cx", mx)
        .attr("cy", midY)
        .attr("r", 8)
        .attr("fill", "var(--card)")
        .attr("stroke", color)
        .attr("stroke-width", 2);

      g.append("text")
        .attr("x", mx)
        .attr("y", midY - 18)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text(icon);
    });

    // X axis
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const tickCount = Math.min(Math.floor(innerWidth / 70), 10);
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(tickCount)
      .tickFormat((d) => {
        const date = d instanceof Date ? d : new Date(d as number);
        return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
      });

    g.append("g")
      .attr("transform", `translate(0,${innerHeight + 6})`)
      .call(xAxis)
      .call((axis) => {
        axis.select(".domain").remove();
        axis.selectAll(".tick line").remove();
        axis.selectAll(".tick text")
          .attr("fill", "var(--text-tertiary)")
          .attr("font-size", "10px");
      });
  }, [sortedCommits, milestones, containerWidth]);

  if (sortedCommits.length === 0) return null;

  const firstCommitDate = new Date(sortedCommits[0].date);
  const lastCommitDate = new Date(sortedCommits[sortedCommits.length - 1].date);
  const fmtOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const dateRange = `${firstCommitDate.toLocaleDateString("en-US", fmtOpts)} \u2192 ${lastCommitDate.toLocaleDateString("en-US", fmtOpts)}`;
  const fullHistoryNote = repoCreatedAt
    ? `Full project history: ${new Date(repoCreatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })} \u2014 Today`
    : null;

  return (
    <section
      className="rounded-2xl p-6"
      aria-label="Commit timeline"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
          Timeline
          <span className="text-xs font-normal ml-2" style={{ color: "var(--text-tertiary)" }}>
            latest {sortedCommits.length} commits
          </span>
        </h2>
        <div className="text-right">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {dateRange}
          </span>
          {fullHistoryNote && (
            <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {fullHistoryNote}
            </div>
          )}
        </div>
      </div>

      <div ref={containerRef} className="relative">
        <svg ref={svgRef} className="w-full" style={{ overflow: "visible" }} />

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none rounded-xl px-3 py-2 text-xs shadow-lg max-w-xs"
            style={{
              left: Math.min(tooltip.x + 12, containerWidth - 230),
              top: Math.max(tooltip.y - 80, 0),
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono" style={{ color: "var(--accent)" }}>
                {tooltip.commit.sha.slice(0, 7)}
              </span>
              {(() => {
                const color = getCommitTypeColor(tooltip.commit.message);
                const match = tooltip.commit.message.match(/^(\w+)(\(.+\))?!?:\s/);
                return color && match?.[1] ? (
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ color, background: `${color}15` }}
                  >
                    {match[1]}
                  </span>
                ) : null;
              })()}
            </div>
            <div
              className="font-medium leading-tight mb-1.5"
              style={{
                color: "var(--text)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {tooltip.commit.message.split("\n")[0].slice(0, 60)}
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              {tooltip.commit.author.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tooltip.commit.author.avatar_url}
                  alt=""
                  width={16}
                  height={16}
                  className="rounded-full"
                />
              )}
              <span>{tooltip.commit.author.name}</span>
              <span style={{ color: "var(--text-tertiary)" }}>&middot;</span>
              <span>{new Date(tooltip.commit.date).toLocaleDateString("en-US")}</span>
            </div>
            {owner && repo && (
              <div className="mt-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
                Click to view on GitHub &nearr;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Milestone legend */}
      {milestones.length > 0 && (
        <div
          className="mt-4 pt-4 flex flex-wrap gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {milestones.slice(0, 6).map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{MILESTONE_ICONS[m.type]}</span>
              <span>{m.title}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
