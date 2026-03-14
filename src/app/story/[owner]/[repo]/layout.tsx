import type { Metadata } from "next";

interface LayoutParams {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { owner, repo } = await params;
  const title = `${owner}/${repo} — CommitStory`;
  const description = `Explore the full commit history and contributor stats for ${owner}/${repo}.`;
  const ogImage = `/api/og/${owner}/${repo}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
