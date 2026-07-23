import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/shared/data/blog-posts";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  TagIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Blog - LuxHorizon | Actualités immobilières",
  description:
    "Conseils, guides et actualités sur l'immobilier en Afrique francophone.",
};

export default function BlogPage() {
  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const otherPosts = blogPosts.filter((p) => p.slug !== featuredPost.slug);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-ink py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6">
            Le Blog
            <span className="block text-accent">LuxHorizon</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Conseils, guides et actualités pour réussir vos projets immobiliers
            en Afrique.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-8 mb-12">
        <Link href={`/blog/${featuredPost.slug}`} className="group block">
          <div className="bg-surface rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition-all flex flex-col lg:flex-row">
            <div className="lg:w-1/2 aspect-[16/9] lg:aspect-auto">
              <img
                src={
                  featuredPost.coverImage ||
                  `https://picsum.photos/seed/${featuredPost.slug}/800/600`
                }
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <span className="bg-accent text-ink text-xs px-2 py-1 rounded-full self-start mb-3">
                {featuredPost.category}
              </span>
              <div className="flex items-center gap-3 text-sm text-primary-500 mb-3">
                <CalendarIcon className="h-4 w-4" />
                {new Date(featuredPost.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                <ClockIcon className="h-4 w-4" />
                {featuredPost.readTime}
              </div>
              <h2 className="text-2xl md:text-3xl font-heading mb-3 group-hover:text-accent transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-primary-600 mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      featuredPost.author.avatar ||
                      "/images/avatar-placeholder.png"
                    }
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{featuredPost.author.name}</span>
                </div>
                <span className="text-accent font-medium flex items-center gap-1">
                  Lire <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Grille articles */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-heading mb-8">
          Tous les articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="bg-surface rounded-xl shadow-card overflow-hidden hover:shadow-soft transition-all h-full flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={
                      post.coverImage ||
                      `https://picsum.photos/seed/${post.slug}/400/300`
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full self-start mb-2">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-primary-400 mb-2">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                    })}
                    <ClockIcon className="h-3 w-3" />
                    {post.readTime}
                  </div>
                  <h3 className="font-heading text-lg mb-2 group-hover:text-accent transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          post.author.avatar || "/images/avatar-placeholder.png"
                        }
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-primary-500">
                        {post.author.name}
                      </span>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Article vedette */}
      {/*  <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <Link href={`/blog/${featuredPost.slug}`} className="group block">
          <Card className="overflow-hidden hover:shadow-soft transition-all duration-500 transform hover:-translate-y-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-accent text-ink px-3 py-1 rounded-full text-sm font-medium">
                  {featuredPost.category}
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-primary-500 mb-4">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(featuredPost.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="text-3xl font-heading mb-4 group-hover:text-accent transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-primary-600 mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">
                      {featuredPost.author.name}
                    </span>
                  </div>
                  <span className="text-accent font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lire l'article <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </section>
 */}
      {/* Liste des articles */}

      {/* Newsletter */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading mb-4">Restez informé</h2>
          <p className="text-primary-600 mb-8">
            Recevez nos derniers articles et conseils directement dans votre
            boîte mail.
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button variant="primary" size="md">
              S'abonner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
