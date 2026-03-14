import type { MilestoneData } from "@/lib/github";

interface MilestoneCardProps {
  milestone: MilestoneData;
}

const MILESTONE_CONFIG: Record<
  MilestoneData["type"],
  { icon: string; colorClass: string; bgClass: string }
> = {
  "first-commit": {
    icon: "🚀",
    colorClass: "text-green-300",
    bgClass: "bg-green-500/10 border-green-500/20",
  },
  release: {
    icon: "🏷️",
    colorClass: "text-yellow-300",
    bgClass: "bg-yellow-500/10 border-yellow-500/20",
  },
  "big-refactor": {
    icon: "♻️",
    colorClass: "text-purple-300",
    bgClass: "bg-purple-500/10 border-purple-500/20",
  },
  "contributor-joined": {
    icon: "👋",
    colorClass: "text-cyan-300",
    bgClass: "bg-cyan-500/10 border-cyan-500/20",
  },
  "100-commits": {
    icon: "💯",
    colorClass: "text-orange-300",
    bgClass: "bg-orange-500/10 border-orange-500/20",
  },
  "1000-stars": {
    icon: "⭐",
    colorClass: "text-yellow-300",
    bgClass: "bg-yellow-500/10 border-yellow-500/20",
  },
};

export default function MilestoneCard({ milestone }: MilestoneCardProps) {
  const config = MILESTONE_CONFIG[milestone.type];
  const date = new Date(milestone.date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      className={`border rounded-xl p-4 ${config.bgClass}`}
      aria-label={`Kilometre taşı: ${milestone.title}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none shrink-0" aria-hidden="true">
          {config.icon}
        </span>
        <div className="min-w-0">
          <h3 className={`text-sm font-semibold ${config.colorClass}`}>{milestone.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{milestone.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <time
              dateTime={milestone.date}
              className="text-xs text-gray-500 font-mono"
            >
              {date}
            </time>
            {milestone.sha && (
              <code className="text-xs text-gray-600 bg-gray-800/60 px-1.5 py-0.5 rounded">
                {milestone.sha.slice(0, 7)}
              </code>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
