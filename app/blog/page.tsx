import Link from "next/link";
import { getContent, getPosts } from "@/lib/i18n";
import { Newsletter } from "@/components/sections/Newsletter";

export const dynamic = "force-dynamic";

async function fetchPosts() {
  if (process.env.NOTION_TOKEN && process.env.NOTION_DB_ID) {
    try {
      const { getNotionPosts } = await import("@/lib/notion");
      return await getNotionPosts();
    } catch (err) {
      console.error("[Blog] Notion fetch failed, falling back to JSON:", err);
    }
  }
  return getPosts();
}

export default async function BlogListPage() {
  const c = getContent();
  const t = c.blog;
  const posts = await fetchPosts();

  const today = new Date().toISOString().split("T")[0];
  const visible = posts.filter((p) => p.publishedAt <= today);
  const featured = visible.filter((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);

  return (
    <div className="pt-28 pb-24">
      <div className="section-container">
        <div className="max-w-2xl mb-16">
          <div className="badge-accent mb-6">{t.badge}</div>
          <h1 className="section-headline mb-4">
            {t.headline[0]}
            <br />
            <em className="not-italic gradient-text-teal">{t.headline[1]}</em>
          </h1>
          <p className="section-subheadline">{t.subheadline}</p>
        </div>

        {visible.length === 0 ? (
          <p className="text-text-secondary text-sm">{t.noPostsLabel}</p>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {featured.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover group block p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="badge-accent text-xs">{post.category}</span>
                      <span className="text-xs text-text-tertiary">{post.readTime} {t.readTimeLabel}</span>
                    </div>
                    <h2 className="font-body font-semibold text-xl text-text-primary mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">{post.excerpt}</p>
                    <span className="text-sm text-accent font-medium">{t.readMoreLabel}</span>
                  </Link>
                ))}
              </div>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover group block p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge text-xs">{post.category}</span>
                      <span className="text-xs text-text-tertiary">{post.readTime} {t.readTimeLabel}</span>
                    </div>
                    <h2 className="font-body font-semibold text-base text-text-primary mb-2 group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <span className="text-xs text-accent font-medium">{t.readMoreLabel}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        <Newsletter content={c.newsletter} />
      </div>
    </div>
  );
}
