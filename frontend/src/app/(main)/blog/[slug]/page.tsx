// app/(main)/blog/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/shared/data/blog-posts";
import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { use } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxhorizon.com";

// Les articles étant des données statiques connues au build, on les
// pré-rend intégralement : zéro coût, indexation immédiate.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Article introuvable — LuxHorizon" };

  return {
    title: `${post.title} | Blog LuxHorizon`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

function buildArticleJsonLd(post: (typeof blogPosts)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: "LuxHorizon" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  // Trouver l'article correspondant au slug dans l'URL
  const post = blogPosts.find((p) => p.slug === slug);

  // Si aucun article ne correspond, renvoyer une page 404
  if (!post) {
    notFound();
  }

  // Articles similaires (même catégorie, excluant l'article actuel)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(post)) }}
      />
      {/* Hero image de l'article */}
      <div className="relative h-[50vh] min-h-[300px] bg-ink">
        <img
          src={
            post.coverImage ||
            `https://picsum.photos/seed/${post.slug}/1200/600`
          }
          alt={post.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Lien retour */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Retour au blog
            </Link>
            {/* Catégorie */}
            <span className="bg-accent text-ink text-xs px-2 py-1 rounded-full mb-3 inline-block">
              {post.category}
            </span>
            {/* Titre */}
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
              {post.title}
            </h1>
            {/* Date et temps de lecture */}
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <CalendarIcon className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              <ClockIcon className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de l'article */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Colonne principale */}
          <div className="flex-1">
            {/* Contenu HTML */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags et partage */}
            <div className="mt-8 pt-8 border-t border-primary-100">
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-primary-500">Partager :</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + `https://luxhorizon.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://luxhorizon.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-surface rounded-xl shadow-card p-6 sticky top-24">
              {/* Auteur */}
              <h4 className="font-heading text-lg mb-4">Auteur</h4>
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={post.author.avatar || "/images/avatar-placeholder.png"}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{post.author.name}</span>
              </div>

              {/* Articles similaires */}
              {relatedPosts.length > 0 && (
                <>
                  <h4 className="font-heading text-lg mb-4">
                    Articles similaires
                  </h4>
                  <div className="space-y-3">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="flex gap-3 group"
                      >
                        <img
                          src={
                            related.coverImage ||
                            `https://picsum.photos/seed/${related.slug}/80/80`
                          }
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="text-sm font-medium group-hover:text-accent line-clamp-2">
                            {related.title}
                          </h5>
                          <span className="text-xs text-primary-400">
                            {related.readTime}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
