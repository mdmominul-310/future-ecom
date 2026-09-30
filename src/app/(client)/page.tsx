// /src/app/(client)/page.tsx

import { Suspense } from "react";
import HeroSection from "@/components/client/HeroSection";
import CollectionList from "@/components/client/CollectionList";
import CampaignLargeBanner from "@/components/client/CampaignLargeBanner";
import BlogSection from "@/components/client/BlogSection";
import { ProductListSkeleton } from "@/components/skeletons/ProductListSkeleton";
import { FeaturedProductsList } from "@/components/server/ProductLists";
import CategoryWiseProduct from "@/components/client/CategoryWiseProduct";
import FeaturesSection from "@/components/client/FeaturesSection";
import ReviewsSection from "@/components/client/ReviewsSection";
import { getCategories } from "@/lib/api/categories";
// import CategoryWiseProduct from "@/components/server/CategoryWiseProduct";

// You can uncomment and use metadata if needed
/*
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maven Zone | Shop Fashion, Electronics & More Online",
  description:
    "Discover the latest trends in fashion, cutting-edge electronics, and more at Maven Zone. Shop now for high-quality products, great deals, and a seamless online experience in Bangladesh.",
};
*/

export default async function HomePage() {
  const [categories, slides, campaignBanner] = await Promise.all([
    getCategories(),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-slides`, {
      cache: "no-store",
    })
      .then(async (res) => (res.ok ? (await res.json()) || [] : []))
      .catch(() => []),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/campaign-banner?active=true`,
      { cache: "no-store" }
    )
      .then(async (res) =>
        res.ok ? await res.json().catch(() => null) : null
      )
      .catch(() => null),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Future com",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
          caption: "Future com",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+880 1974-003819",
          contactType: "customer service",
          availableLanguage: ["English", "Bengali"],
        },
        sameAs: [
          "https://facebook.com",
          "https://instagram.com",
          "https://futgensoft.com",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Future com",
        description:
          "Shop top-tier electronics, modern lifestyle, daily essentials, and fashion at Future com - quality guaranteed with fast delivery nationwide.",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/categories/all?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#F7F5EF]">
        {/* Main heading for SEO and screen readers */}
        <h1 className="sr-only">
          Future com: Premier Online General Store & Everyday Lifestyle Essentials in Bangladesh
        </h1>
        {/* Hero Slider Section */}
        <section>
          <HeroSection slides={slides} />
        </section>
        {/* Collections/Categories List Section */}
        <section
          aria-labelledby="collections-heading"
          className="mx-auto bg-[#F7F5EF]"
        >
          <h2 id="collections-heading" className="sr-only">
            Product Collections
          </h2>
          <CollectionList collections={categories} />
        </section>
        {/* Campaign Banner Section (displays only if an active banner exists) */}
        {campaignBanner && (
          <section
            aria-label="Special Campaign"
            className="bg-white py-5 lg:py-8"
          >
            <CampaignLargeBanner banner={campaignBanner} />
          </section>
        )}
        {/* Featured Products Section */}
        <section
          aria-labelledby="featured-products-heading"
          className="mx-auto bg-[#F7F5EF]"
        >
          <h2 id="featured-products-heading" className="sr-only">
            Featured Products
          </h2>
          <Suspense fallback={<ProductListSkeleton />}>
            <FeaturedProductsList />
          </Suspense>
        </section>
        {/* Category-wise Product Sections */}
        {categories.map((category) => (
          <section
            key={category._id}
            aria-labelledby={`${category.slug}-products-heading`}
            className="bg-[#F7F5EF]" // Using a white background to separate sections
          >
            <h2 id={`${category.slug}-products-heading`} className="sr-only">
              Products from {category.name}
            </h2>
            {/* Suspense boundary for each category allows them to load independently */}
            <Suspense fallback={<ProductListSkeleton />}>
              <CategoryWiseProduct category={category} />
            </Suspense>
          </section>
        ))}
        {/* Feature Section  */}
        <FeaturesSection />
        {/* Blog Section */}
        <section aria-labelledby="blog-heading">
          <h2 id="blog-heading" className="sr-only">
            From Our Blog
          </h2>
          <BlogSection />
        </section>
        {/* Customer Reviews Section */}
        <ReviewsSection /> {/* <-- 2. ADD THE COMPONENT HERE */}
      </main>
    </>
  );
}
