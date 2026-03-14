import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Commit Story", template: "%s | Commit Story" },
  description: "Turn any GitHub repository's commit history into an interactive visual story.",
  metadataBase: new URL("https://commitstory.dev"),
  openGraph: {
    type: "website",
    siteName: "Commit Story",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased" style={{ backgroundColor: "#0a0e1a" }}>
        {children}
      </body>
    </html>
  );
}
