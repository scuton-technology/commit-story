"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface BadgeSectionProps {
  owner: string;
  repo: string;
}

const BADGE_STYLES = [
  { id: "flat", label: "Flat" },
  { id: "flat-square", label: "Square" },
  { id: "for-the-badge", label: "For the Badge" },
] as const;

type BadgeStyle = (typeof BADGE_STYLES)[number]["id"];
type Tab = "badge" | "embed";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  return (
    <button
      onClick={handleCopy}
      className="shrink-0 p-1.5 rounded-lg transition-all"
      style={{ background: "var(--bg-secondary)", color: copied ? "var(--accent)" : "var(--text-tertiary)" }}
      aria-label="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function BadgeSection({ owner, repo }: BadgeSectionProps) {
  const [activeStyle, setActiveStyle] = useState<BadgeStyle>("flat");
  const [activeTab, setActiveTab] = useState<Tab>("badge");

  const badgeUrl = `https://commitstory.dev/api/badge/${owner}/${repo}?style=${activeStyle}`;
  const storyUrl = `https://commitstory.dev/story/${owner}/${repo}`;
  const embedUrl = `https://commitstory.dev/embed/${owner}/${repo}`;
  const markdown = `[![Commit Story](${badgeUrl})](${storyUrl})`;
  const iframeCode = `<iframe src="${embedUrl}" width="300" height="160" frameborder="0" style="border-radius:12px;overflow:hidden;" title="${owner}/${repo} on CommitStory"></iframe>`;

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
          Add to your README
        </h2>
        {/* Tab switcher */}
        <div className="flex gap-1">
          {(["badge", "embed"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="text-xs px-3 py-1 rounded-lg capitalize transition-all"
              style={{
                background: activeTab === tab ? "var(--accent-light)" : "transparent",
                border: activeTab === tab ? "1px solid var(--accent)" : "1px solid transparent",
                color: activeTab === tab ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "badge" && (
        <>
          {/* Style picker */}
          <div className="flex gap-2 mb-4">
            {BADGE_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStyle(s.id)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: activeStyle === s.id ? "var(--accent-light)" : "var(--bg-secondary)",
                  border: activeStyle === s.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                  color: activeStyle === s.id ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Badge preview */}
          <div
            className="rounded-xl p-4 mb-4 flex items-center gap-3"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Preview:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badgeUrl}
              alt={`CommitStory badge for ${owner}/${repo}`}
              style={{ height: activeStyle === "for-the-badge" ? 28 : 20 }}
            />
          </div>

          {/* Markdown code */}
          <div
            className="rounded-xl p-3 flex items-start gap-3"
            style={{ background: "var(--code-bg)", border: "1px solid var(--border)" }}
          >
            <code className="flex-1 text-xs break-all leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {markdown}
            </code>
            <CopyButton text={markdown} />
          </div>
        </>
      )}

      {activeTab === "embed" && (
        <>
          {/* Embed preview */}
          <div
            className="rounded-xl p-4 mb-4 flex items-center justify-center"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          >
            <iframe
              src={embedUrl}
              width={300}
              height={160}
              style={{ borderRadius: 12, border: "none", display: "block" }}
              title={`${owner}/${repo} on CommitStory`}
            />
          </div>

          {/* iframe code */}
          <div
            className="rounded-xl p-3 flex items-start gap-3"
            style={{ background: "var(--code-bg)", border: "1px solid var(--border)" }}
          >
            <code className="flex-1 text-xs break-all leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {iframeCode}
            </code>
            <CopyButton text={iframeCode} />
          </div>
        </>
      )}
    </section>
  );
}
