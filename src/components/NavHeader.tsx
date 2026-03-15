"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

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
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <GitBranch className="w-5 h-5" style={{ color: "var(--accent)" }} />
          <span
            className="font-semibold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Commit Story
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1 ml-auto">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: isActive ? "var(--accent-light)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
