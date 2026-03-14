"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import Image from "next/image";

interface BadgeSectionProps {
  owner: string;
  repo: string;
}

const STYLES = [
  { id: "flat", label: "Flat" },
  { id: "flat-square", label: "Square" },
  { id: "for-the-badge", label: "For the Badge" },
] as const;

type BadgeStyle = (typeof STYLES)[number]["id"];

export default function BadgeSection({ owner, repo }: BadgeSectionProps) {
  const [activeStyle, setActiveStyle] = useState<BadgeStyle>("flat");
  const [copied, setCopied] = useState(false);

  const badgeUrl = `https://commitstory.dev/api/badge/${owner}/${repo}?style=${activeStyle}`;
  const storyUrl = `https://commitstory.dev/story/${owner}/${repo}`;
  const markdown = `[![Commit Story](${badgeUrl})](${storyUrl})`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <section
      className="rounded-2xl p-6"
      style={{
        background: "rgba(15,22,41,0.8)",
        border: "1px solid rgba(148,163,184,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2 className="text-base font-semibold mb-4" style={{ color: "#f1f5f9" }}>
        Add to your README
      </h2>

      {/* Style picker */}
      <div className="flex gap-2 mb-4">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStyle(s.id)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background:
                activeStyle === s.id
                  ? "rgba(34,211,238,0.12)"
                  : "rgba(15,22,41,0.6)",
              border:
                activeStyle === s.id
                  ? "1px solid rgba(34,211,238,0.35)"
                  : "1px solid rgba(148,163,184,0.1)",
              color: activeStyle === s.id ? "#22d3ee" : "#64748b",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Badge preview */}
      <div
        className="rounded-xl p-4 mb-4 flex items-center gap-3"
        style={{
          background: "rgba(10,14,26,0.6)",
          border: "1px solid rgba(148,163,184,0.08)",
        }}
      >
        <span className="text-xs" style={{ color: "#475569" }}>
          Preview:
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeUrl}
          alt={`CommitStory badge for ${owner}/${repo}`}
          style={{ height: activeStyle === "for-the-badge" ? 28 : 20 }}
        />
      </div>

      {/* Markdown code */}
      <div
        className="rounded-xl p-3 flex items-start gap-3 group"
        style={{
          background: "rgba(10,14,26,0.6)",
          border: "1px solid rgba(148,163,184,0.08)",
        }}
      >
        <code
          className="flex-1 text-xs font-mono break-all leading-relaxed"
          style={{ color: "#64748b" }}
        >
          {markdown}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg transition-all"
          style={{
            background: "rgba(30,41,59,0.8)",
            color: copied ? "#22d3ee" : "#475569",
          }}
          aria-label="Copy markdown"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </section>
  );
}
