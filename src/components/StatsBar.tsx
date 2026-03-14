import { GitCommit, Users, TrendingUp, TrendingDown } from "lucide-react";
import type { RepoStats } from "@/lib/github";

interface StatsBarProps {
  stats: RepoStats;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("tr-TR");
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: "green" | "red" | "blue" | "default";
  sublabel?: string;
}

function StatCard({ label, value, icon, accent = "default", sublabel }: StatCardProps) {
  const accentClasses: Record<string, string> = {
    green: "text-green-400",
    red: "text-red-400",
    blue: "text-blue-400",
    default: "text-gray-300",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3 text-gray-500">
        {icon}
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className={`text-3xl font-bold font-mono tabular-nums ${accentClasses[accent]}`}>
        {value}
      </div>
      {sublabel && (
        <div className="text-xs text-gray-600 mt-1">{sublabel}</div>
      )}
    </div>
  );
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <section aria-label="Repo istatistikleri">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Toplam Commit"
          value={formatNumber(stats.total_commits)}
          icon={<GitCommit className="w-4 h-4" />}
          accent="blue"
          sublabel={`~${stats.avg_commits_per_week}/hafta`}
        />
        <StatCard
          label="Katkıda Bulunan"
          value={formatNumber(stats.total_contributors)}
          icon={<Users className="w-4 h-4" />}
          accent="default"
          sublabel={`En aktif: ${stats.most_active_author}`}
        />
        <StatCard
          label="Eklenen Satır"
          value={`+${formatNumber(stats.total_additions)}`}
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          accent="green"
        />
        <StatCard
          label="Silinen Satır"
          value={`-${formatNumber(stats.total_deletions)}`}
          icon={<TrendingDown className="w-4 h-4 text-red-500" />}
          accent="red"
        />
      </div>

      <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 flex flex-wrap gap-x-8 gap-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-gray-600 text-xs uppercase tracking-wider">Proje yaşı</span>
          <span className="font-mono font-medium text-gray-300">
            {stats.project_age_days.toLocaleString("tr-TR")} gün
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-gray-600 text-xs uppercase tracking-wider">En aktif gün</span>
          <span className="font-mono font-medium text-gray-300">{stats.most_active_day}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-gray-600 text-xs uppercase tracking-wider">Net satır</span>
          <span
            className={`font-mono font-medium ${
              stats.total_additions >= stats.total_deletions
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {stats.total_additions - stats.total_deletions >= 0 ? "+" : ""}
            {formatNumber(stats.total_additions - stats.total_deletions)}
          </span>
        </div>
      </div>
    </section>
  );
}
