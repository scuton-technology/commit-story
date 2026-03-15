import Image from "next/image";
import type { ContributorData } from "@/lib/github";

interface ContributorsProps {
  contributors: ContributorData[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

const PLACEHOLDER_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#f97316",
  "#fbbf24",
  "#f472b6",
];

function placeholderColor(login: string): string {
  let hash = 0;
  for (let i = 0; i < login.length; i++) {
    hash = login.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length] ?? "#22d3ee";
}

export default function Contributors({ contributors }: ContributorsProps) {
  if (contributors.length === 0) return null;

  const maxContributions = contributors[0]?.contributions ?? 1;

  return (
    <section
      className="rounded-2xl p-6"
      aria-labelledby="contributors-heading"
      style={{
        background: "rgba(15,22,41,0.8)",
        border: "1px solid rgba(148,163,184,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2
        id="contributors-heading"
        className="text-base font-semibold mb-5"
        style={{ color: "#f1f5f9" }}
      >
        Contributors
        <span
          className="ml-2 text-sm font-normal font-mono px-2 py-0.5 rounded-full"
          style={{
            color: "#a78bfa",
            background: "rgba(167,139,250,0.1)",
            border: "1px solid rgba(167,139,250,0.2)",
          }}
        >
          {contributors.length}
        </span>
      </h2>

      <ol
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Contributors ranking"
      >
        {contributors.map((contributor, index) => {
          const barWidth = Math.max(
            4,
            Math.round((contributor.contributions / maxContributions) * 100)
          );
          const medal = MEDALS[index];
          const color = placeholderColor(contributor.login);

          return (
            <li key={contributor.login} className="relative">
              <a
                href={`https://github.com/${contributor.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl p-4 transition-all group"
                style={{
                  background: "rgba(10,14,26,0.6)",
                  border: "1px solid rgba(148,163,184,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(148,163,184,0.08)";
                }}
                aria-label={`${contributor.login} — ${contributor.contributions} commits, view GitHub profile`}
              >
                {/* Medal badge */}
                {medal && (
                  <div
                    className="absolute top-3 right-3 text-base"
                    aria-label={`Rank ${index + 1}`}
                  >
                    {medal}
                  </div>
                )}

                {/* Avatar */}
                <div className="mb-3">
                  {contributor.avatar_url ? (
                    <Image
                      src={contributor.avatar_url}
                      alt={`${contributor.login}'s profile picture`}
                      width={48}
                      height={48}
                      unoptimized
                      className="rounded-full"
                      style={{ background: "rgba(30,41,59,0.8)" }}
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-mono font-bold"
                      aria-hidden="true"
                      style={{
                        background: `${color}18`,
                        color: color,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {contributor.login.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Username */}
                <div
                  className="font-medium text-sm truncate mb-0.5 transition-colors"
                  style={{ color: "#cbd5e1" }}
                >
                  {contributor.login}
                </div>

                {/* Commit count */}
                <div
                  className="text-xs font-mono mb-3"
                  style={{ color: "#475569" }}
                >
                  {contributor.contributions.toLocaleString("en-US")} commits
                </div>

                {/* Contribution bar */}
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(148,163,184,0.08)" }}
                  role="progressbar"
                  aria-valuenow={contributor.contributions}
                  aria-valuemax={maxContributions}
                  aria-label={`${contributor.login}: ${contributor.contributions} commit`}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(to right, #22d3ee, #a78bfa)`,
                    }}
                  />
                </div>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
