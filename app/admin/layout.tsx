import type { Metadata } from "next";

// Keeps every /admin/* route out of search results — robots.txt already
// disallows crawling it, this additionally stops it from being indexed if a
// link to it ever surfaces some other way (e.g. a stray external link).
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
