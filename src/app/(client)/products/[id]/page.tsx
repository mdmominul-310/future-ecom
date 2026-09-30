import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClient from "@/components/client/products/ProductClient";
import { getProductData, getAllProductIds } from "@/lib/product-data";
import { getSiteSettings } from "@/lib/api/settings";

// ISR Caching: Regenerate this page in the background every hour (3600s).
export const revalidate = 3600;

// Pre-builds pages for known product IDs at build time for performance.
export async function generateStaticParams() {
  const products = await getAllProductIds();

  return products.map((product) => ({
    id: product._id,
  }));
}

// Generates metadata for SEO.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [{ product }, settings] = await Promise.all([
    getProductData(id),
    getSiteSettings().catch(() => ({ siteTitle: "Future com" })),
  ]);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";
  const brandName = settings.siteTitle || "Future com";
  const imageUrls = (product.images || []).map((img: any) => img?.url || img);

  const title =
    product.metaTitle ||
    `${product.name} | ${brandName}`;

  const description =
    product.metaDescription ||
    product.shortDescription ||
    `Buy authentic ${product.name} at the best price from ${brandName}. Nationwide express shipping & verified warranty.`;

  const canonical = product.canonicalUrl || `${siteUrl}/products/${product._id}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category?.name,
      product.brand?.name || brandName,
      "buy online",
      brandName,
      "bangladesh",
    ].concat(product.tags || []),
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
      images: imageUrls.map((url: any) => ({
        url: url,
        width: 800,
        height: 600,
        alt: `${product.name} - ${brandName}`,
      })),
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls,
    },
  };
}

// The main page component that fetches data and renders the client component.
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ product, reviews }, settings] = await Promise.all([
    getProductData(id),
    getSiteSettings().catch(() => ({ siteTitle: "Future com" })),
  ]);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";
  const brandName = settings.siteTitle || "Future com";
  const imageUrls = (product.images || []).map((img: any) => img?.url || img);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: imageUrls,
    description: product.description || product.shortDescription,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || brandName,
    },
    review: (reviews || []).map((review: any) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating.toString(),
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: review.name,
      },
      reviewBody: review.comment,
    })),
    aggregateRating:
      product.reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating.toString(),
            reviewCount: product.reviewsCount.toString(),
          }
        : undefined,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product._id}`,
      priceCurrency: product.currency || "BDT",
      price: (product.salePrice || product.price).toString(),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: product?.category?.name || "Categories",
        item: product?.category?.slug
          ? `${siteUrl}/categories/${product.category.slug}`
          : `${siteUrl}/categories/all`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${product?._id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductClient product={product} />
    </>
  );
}
