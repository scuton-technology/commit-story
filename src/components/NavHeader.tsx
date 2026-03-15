"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch } from "lucide-react";

const NAV_LINKS = [
  { href: "/trending", label: "Trending" },
  { href: "/compare", label: "Compare" },
  { href: "/wrapped", label: "Wrapped" },
];

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(10,14,26,0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(148,163,184,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <GitBranch className="w-5 h-5" style={{ color: "#22d3ee" }} />
          <span
            className="font-mono font-bold tracking-tight"
            style={{ color: "#22d3ee" }}
          >
            commit-story
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1 ml-auto">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  color: isActive ? "#22d3ee" : "#64748b",
                  background: isActive ? "rgba(34,211,238,0.08)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
