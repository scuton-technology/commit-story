"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Users, Link2, Check } from "lucide-react";
import NavHeader from "@/components/NavHeader";

interface WrappedData {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
  };
  totalStars: number;
  totalRepos: number;
  languages: { name: string; count: number }[];
  topRepos: {
    name: string;
    full_name: string;
    stars: number;
    language: string;
    description: string;
  }[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5", Rust: "#dea584",
  Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d", C: "#555555", Ruby: "#701516",
  PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  Shell: "#89e051", HTML: "#e34c26", CSS: "#563d7c", Vue: "#41b883",
  Svelte: "#ff3e00", Zig: "#ec915c",
};

export default function WrappedPage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError("");
    fetch(`/api/wrapped/${username}`)
      .then((r) => {
        if (!r.ok) throw new Error("User not found");
        return r.json() as Promise<WrappedData>;
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e: Error) => { setError(e.message); setLoading(false); });
  }, [username]);

  const memberYears = data
    ? Math.floor((Date.now() - new Date(data.user.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;
  const maxLang = data?.languages[0]?.count ?? 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <NavHeader />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ height: 120, background: "var(--bg-tertiary)" }} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--red)" }}>User not found</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{error}</p>
            <Link href="/wrapped" className="text-sm" style={{ color: "var(--accent)" }}>Try another username</Link>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Profile card */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.user.avatar_url}
                alt={data.user.login}
                width={96}
                height={96}
                className="rounded-full mx-auto mb-4"
                style={{ border: "3px solid var(--border)" }}
              />
              <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>{data.user.name}</h1>
              <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>@{data.user.login}</p>
              {data.user.bio && <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>{data.user.bio}</p>}

              <div className="flex justify-center gap-6 mt-6">
                <div className="text-center">
                  <div className="text-xl font-bold tabular-nums" style={{ color: "var(--accent)" }}>{data.totalRepos}</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Repos</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold tabular-nums" style={{ color: "#eab308" }}>{data.totalStars.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Stars</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold tabular-nums" style={{ color: "var(--text)" }}>{data.user.followers.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold tabular-nums" style={{ color: "var(--text-secondary)" }}>{memberYears}y</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Member</div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text)" }}>Top Languages</h2>
              <div className="space-y-2.5">
                {data.languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-3">
                    <span className="text-xs w-24 text-right shrink-0" style={{ color: "var(--text-secondary)" }}>{lang.name}</span>
                    <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                      <div
                        className="h-full rounded-md transition-all"
                        style={{
                          width: `${Math.max(8, (lang.count / maxLang) * 100)}%`,
                          background: LANG_COLORS[lang.name] ?? "var(--text-secondary)",
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <span className="text-xs w-8" style={{ color: "var(--text-tertiary)" }}>{lang.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top repos */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text)" }}>Top Repositories</h2>
              <div className="space-y-3">
                {data.topRepos.map((repo) => (
                  <Link
                    key={repo.full_name}
                    href={`/story/${repo.full_name}`}
                    className="block rounded-xl p-4 transition-all"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{repo.name}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#eab308" }}>
                        <Star className="w-3 h-3" /> {repo.stars.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-1" style={{ color: "var(--text-secondary)" }}>{repo.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: copied ? "var(--accent)" : "var(--text-secondary)" }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
