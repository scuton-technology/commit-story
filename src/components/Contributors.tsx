import Image from "next/image";
import type { ContributorData } from "@/lib/github";

interface ContributorsProps {
  contributors: ContributorData[];
}

const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

const PLACEHOLDER_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#ea580c",
  "#eab308",
  "#ec4899",
];

function placeholderColor(login: string): string {
  let hash = 0;
  for (let i = 0; i < login.length; i++) {
    hash = login.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length] ?? "#2563eb";
}

export default function Contributors({ contributors }: ContributorsProps) {
  if (contributors.length === 0) return null;

  const maxContributions = contributors[0]?.contributions ?? 1;

  return (
    <section
      className="rounded-2xl p-6"
      aria-labelledby="contributors-heading"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        id="contributors-heading"
        className="text-base font-semibold mb-5"
        style={{ color: "var(--text)" }}
      >
        Contributors
        <span
          className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full"
          style={{
            color: "var(--accent)",
            background: "var(--accent-light)",
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
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
                aria-label={`${contributor.login} \u2014 ${contributor.contributions} commits, view GitHub profile`}
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
                      style={{ background: "var(--bg-tertiary)" }}
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                      aria-hidden="true"
                      style={{
                        background: `${color}15`,
                        color: color,
                      }}
                    >
                      {contributor.login.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Username */}
                <div
                  className="font-medium text-sm truncate mb-0.5"
                  style={{ color: "var(--text)" }}
                >
                  {contributor.login}
                </div>

                {/* Commit count */}
                <div
                  className="text-xs mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {contributor.contributions.toLocaleString("en-US")} commits
                </div>

                {/* Contribution bar */}
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "var(--border)" }}
                  role="progressbar"
                  aria-valuenow={contributor.contributions}
                  aria-valuemax={maxContributions}
                  aria-label={`${contributor.login}: ${contributor.contributions} commit`}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${barWidth}%`,
                      background: "var(--accent)",
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
