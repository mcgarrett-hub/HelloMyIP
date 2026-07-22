import Link from "next/link";
import { PageShell } from "@/components/layout/site-chrome";
import { Card } from "@/components/ui/primitives";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides about IP addresses, DNS, VPN, and networking.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <PageShell
      activeHref="/blog"
      title="Blog"
      description="SEO-friendly articles about IP, DNS, VPN, and privacy."
    >
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Card>
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-semibold text-brand-700 hover:underline dark:text-brand-300">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{post.date}</p>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
