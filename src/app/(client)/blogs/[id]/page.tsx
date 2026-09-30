// src/app/(client)/blogs/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getSiteSettings } from "@/lib/api/settings";

// --- Type Definitions ---
interface BlogPost {
  _id: string;
  imageUrl: {
    url: string;
    public_id: string;
  };
  date: string;
  title: string;
  author?: string;
  content: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

interface Product {
  _id: string;
  name: string;
  images: { url: string; public_id: string }[];
  price: number;
  slug: string;
  shortDescription?: string;
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (blog) return JSON.parse(JSON.stringify(blog));
  } catch (dbErr) {
    console.error("Direct DB fetch error:", dbErr);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=4`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [blogPost, settings] = await Promise.all([
    getBlogPost(id),
    getSiteSettings().catch(() => ({ siteTitle: "Future com" })),
  ]);

  if (!blogPost) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";
  const brandName = settings.siteTitle || "Future com";
  const title = blogPost.metaTitle || `${blogPost.title} | ${brandName} Blog`;
  const cleanExcerpt = blogPost.content
    ? blogPost.content.replace(/<[^>]+>/g, "").substring(0, 160)
    : "";
  const description =
    blogPost.metaDescription || cleanExcerpt || `Read ${blogPost.title} on ${brandName}.`;
  const canonical = blogPost.canonicalUrl || `${siteUrl}/blogs/${blogPost._id}`;

  const keywords = blogPost.metaKeywords
    ? blogPost.metaKeywords.split(",").map((k) => k.trim())
    : [blogPost.title, "blog", brandName, "bangladesh"];

  return {
    title,
    description,
    keywords,
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
      type: "article",
      publishedTime: blogPost.date,
      authors: [blogPost.author || brandName],
      images: [
        {
          url: blogPost.imageUrl?.url || "/placeholder.svg",
          width: 1200,
          height: 630,
          alt: blogPost.title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [blogPost.imageUrl?.url || "/placeholder.svg"],
    },
  };
}

const ProductListItem: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
      <Link href={`/products/${product._id}`} className="shrink-0">
        <div className="relative w-16 h-16 bg-white rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <Image
            height={200}
            width={200}
            src={product.images?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs font-bold text-orange-600 mt-1">
          ৳{product.price.toFixed(0)}
        </p>
      </div>
      <Link
        href={`/products/${product._id}`}
        className="shrink-0 bg-slate-900 hover:bg-black dark:bg-slate-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
      >
        View
      </Link>
    </div>
  );
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [blogPost, featuredProducts, settings] = await Promise.all([
    getBlogPost(id),
    getFeaturedProducts(),
    getSiteSettings().catch(() => ({ siteTitle: "Future com" })),
  ]);

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Blog Post Not Found
          </h1>
          <Link href="/blogs" className="text-orange-600 hover:underline text-sm font-semibold">
            &larr; Back to all stories
          </Link>
        </div>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";
  const brandName = settings.siteTitle || "Future com";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.title,
    image: [blogPost.imageUrl?.url],
    datePublished: blogPost.date,
    dateModified: blogPost.date,
    author: {
      "@type": "Person",
      name: blogPost.author || brandName,
    },
    publisher: {
      "@type": "Organization",
      name: brandName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    description: blogPost.metaDescription || blogPost.content.replace(/<[^>]+>/g, "").substring(0, 160),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blogs/${blogPost._id}`,
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blogs` },
      { "@type": "ListItem", position: 3, name: blogPost.title, item: `${siteUrl}/blogs/${blogPost._id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-orange-600">Blog</Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs">{blogPost.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Blog Content Area */}
            <article className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <div className="relative w-full h-72 sm:h-96 bg-slate-100 dark:bg-slate-800">
                <Image
                  fill
                  priority
                  src={blogPost.imageUrl?.url || "/placeholder.svg"}
                  alt={blogPost.title}
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-10">
                <div className="flex items-center text-slate-500 text-xs gap-3 mb-4 font-medium">
                  <time dateTime={blogPost.date}>
                    {new Date(blogPost.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span>By <strong className="text-slate-700 dark:text-slate-300">{blogPost.author || brandName}</strong></span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                  {blogPost.title}
                </h1>

                <div
                  className="prose prose-slate dark:prose-invert max-w-none leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700"
                  >
                    &larr; Back to all stories
                  </Link>
                </div>
              </div>
            </article>

            {/* Sidebar for Product Listings */}
            <aside className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sticky top-24">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>Recommended Products</span>
                  <Link href="/categories/all" className="text-xs font-normal text-orange-600 hover:underline">
                    View all
                  </Link>
                </h2>
                <div className="space-y-2">
                  {featuredProducts.length > 0 ? (
                    featuredProducts.map((product) => (
                      <ProductListItem key={product._id} product={product} />
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4">No products to display.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
