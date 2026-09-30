import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getSiteSettings } from "@/lib/api/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => ({ siteTitle: "Future com" }));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";
  const brandName = settings.siteTitle || "Future com";

  const title = `Latest Tech & Lifestyle Stories | ${brandName} Blog`;
  const description = `Read insightful articles, product guides, tech trends, and lifestyle tips curated by ${brandName}.`;
  const canonical = `${siteUrl}/blogs`;

  return {
    title,
    description,
    keywords: [
      "blog",
      "articles",
      "tech trends",
      "lifestyle guides",
      brandName,
      "bangladesh shopping",
    ],
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: brandName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

interface BlogPost {
  _id: string;
  imageUrl: {
    url: string;
    public_id: string;
  };
  date: string;
  title: string;
  author: string;
  content: string;
  slug: string;
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    await connectDB();
    const posts = await Blog.find({ status: "published" })
      .sort({ date: -1, createdAt: -1 })
      .lean();
    if (posts && posts.length > 0) {
      return JSON.parse(JSON.stringify(posts));
    }
  } catch (dbErr) {
    console.error("Direct DB fetch failed for blogs:", dbErr);
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.blogs || [];
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const excerpt =
    post.content.replace(/<[^>]+>/g, "").substring(0, 150) + "...";

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link href={`/blogs/${post._id}`} className="block">
        <div className="relative w-full h-56 bg-slate-100 dark:bg-slate-800">
          <Image
            height={500}
            width={500}
            src={post.imageUrl?.url || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-slate-500 text-xs mb-3 font-medium">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
        <Link href={`/blogs/${post._id}`}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">
          {excerpt}
        </p>
        <div className="mt-auto pt-2">
          <Link
            href={`/blogs/${post._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors"
          >
            Read Full Article &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};

export default async function BlogListPage() {
  const posts = await getAllBlogPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Future com Blog",
    description:
      "Latest stories, guides, and updates from Future com online general store.",
    url: `${siteUrl}/blogs`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      image: post.imageUrl?.url,
      datePublished: post.date,
      url: `${siteUrl}/blogs/${post._id}`,
    })),
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blogs` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Stories & Insights
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Stay ahead with curated product highlights, buying recommendations,
              maintenance guides, and modern lifestyle trends.
            </p>
          </header>

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-500">No blog posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
