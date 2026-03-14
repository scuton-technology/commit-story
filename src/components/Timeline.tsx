"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { CommitData, MilestoneData } from "@/lib/github";

interface TimelineProps {
  commits: CommitData[];
  milestones: MilestoneData[];
  repoCreatedAt?: string;
}

interface TooltipData {
  x: number;
  y: number;
  commit: CommitData;
}

const MILESTONE_ICONS: Record<MilestoneData["type"], string> = {
  "first-commit": "🚀",
  "release": "🏷️",
  "big-refactor": "♻️",
  "contributor-joined": "👋",
  "100-commits": "💯",
  "1000-stars": "⭐",
};

const MILESTONE_COLORS: Record<MilestoneData["type"], string> = {
  "first-commit": "#22c55e",
  "release": "#f59e0b",
  "big-refactor": "#a78bfa",
  "contributor-joined": "#22d3ee",
  "100-commits": "#f97316",
  "1000-stars": "#fbbf24",
};

// Heatmap color: low density = dim green, high density = bright cyan
function commitColor(density: number): string {
  if (density > 0.75) return "#22d3ee";
  if (density > 0.5) return "#34d399";
  if (density > 0.25) return "#4ade80";
  return "#16a34a";
}

export default function Timeline({ commits, milestones, repoCreatedAt }: TimelineProps) {
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
    const domainStart = repoCreatedAt ? new Date(repoCreatedAt) : dates[0];
    const domainEnd = new Date();
    const xScale = d3
      .scaleTime()
      .domain([domainStart, domainEnd])
      .range([0, innerWidth]);

    // Compute per-bucket density for coloring
    const bucketCount = Math.max(20, Math.floor(innerWidth / 12));
    const buckets = new Array<number>(bucketCount).fill(0);
    sortedCommits.forEach((c) => {
      const x = xScale(new Date(c.date));
      const idx = Math.min(Math.floor((x / innerWidth) * bucketCount), bucketCount - 1);
      buckets[idx] = (buckets[idx] ?? 0) + 1;
    });
    const maxBucket = Math.max(...buckets, 1);

    // Background track
    g.append("rect")
      .attr("x", 0)
      .attr("y", midY - 1)
      .attr("width", innerWidth)
      .attr("height", 2)
      .attr("rx", 1)
      .attr("fill", "rgba(148,163,184,0.12)");

    // Commit dots with heatmap coloring
    g.selectAll<SVGCircleElement, CommitData>(".commit-dot")
      .data(sortedCommits)
      .join("circle")
      .attr("class", "commit-dot")
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", midY)
      .attr("r", 5)
      .attr("fill", (d) => {
        const x = xScale(new Date(d.date));
        const idx = Math.min(
          Math.floor((x / innerWidth) * bucketCount),
          bucketCount - 1
        );
        const density = (buckets[idx] ?? 0) / maxBucket;
        return commitColor(density);
      })
      .attr("fill-opacity", 0.75)
      .attr("stroke", "none")
      .style("cursor", "pointer")
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
        d3.select(this).attr("r", 5).attr("fill-opacity", 0.75);
        setTooltip(null);
      });

    // Milestone markers
    milestones.forEach((milestone) => {
      const mx = xScale(new Date(milestone.date));
      const color = MILESTONE_COLORS[milestone.type] ?? "#22d3ee";
      const icon = MILESTONE_ICONS[milestone.type] ?? "•";

      // Outer ring
      g.append("circle")
        .attr("cx", mx)
        .attr("cy", midY)
        .attr("r", 8)
        .attr("fill", "rgba(15,22,41,0.9)")
        .attr("stroke", color)
        .attr("stroke-width", 2);

      // Icon text above
      g.append("text")
        .attr("x", mx)
        .attr("y", midY - 18)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text(icon);
    });

    // X axis: month/year labels (hardcoded English — avoids browser locale)
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
          .attr("fill", "#475569")
          .attr("font-size", "10px")
          .attr("font-family", "monospace");
      });
  }, [sortedCommits, milestones, containerWidth]);

  if (sortedCommits.length === 0) return null;

  const rangeStart = repoCreatedAt
    ? new Date(repoCreatedAt)
    : new Date(sortedCommits[0].date);
  const dateRange = `${rangeStart.toLocaleDateString("en-US", { month: "short", year: "numeric" })} → Today`;

  return (
    <section
      className="rounded-2xl p-6"
      aria-label="Commit timeline"
      style={{
        background: "rgba(15,22,41,0.8)",
        border: "1px solid rgba(148,163,184,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: "#f1f5f9" }}>
          Timeline
        </h2>
        <span className="text-xs font-mono" style={{ color: "#475569" }}>
          {dateRange}
        </span>
      </div>

      <div ref={containerRef} className="relative">
        <svg ref={svgRef} className="w-full" style={{ overflow: "visible" }} />

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none rounded-xl px-3 py-2 text-xs shadow-2xl max-w-xs"
            style={{
              left: Math.min(tooltip.x + 12, containerWidth - 230),
              top: Math.max(tooltip.y - 80, 0),
              background: "rgba(15,22,41,0.95)",
              border: "1px solid rgba(148,163,184,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="font-mono mb-1"
              style={{ color: "#22d3ee" }}
            >
              {tooltip.commit.sha.slice(0, 7)}
            </div>
            <div
              className="font-medium leading-tight mb-1"
              style={{
                color: "#f1f5f9",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {tooltip.commit.message.split("\n")[0].slice(0, 60)}
            </div>
            <div style={{ color: "#475569" }}>
              {tooltip.commit.author.name} •{" "}
              {new Date(tooltip.commit.date).toLocaleDateString("en-US")}
            </div>
          </div>
        )}
      </div>

      {/* Milestone legend */}
      {milestones.length > 0 && (
        <div
          className="mt-4 pt-4 flex flex-wrap gap-3"
          style={{ borderTop: "1px solid rgba(148,163,184,0.08)" }}
        >
          {milestones.slice(0, 6).map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#64748b" }}
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
