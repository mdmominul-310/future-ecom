import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getSiteSettings } from "@/lib/api/settings";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";
  const settings = await getSiteSettings();
  const categorySlug = slug?.[0] || "all";
  const subcategorySlug = slug?.[1];

  let title = `All Products Collection | ${settings.siteTitle || "Future com"}`;
  let description = `Browse all products with guaranteed quality, fast nationwide delivery, and best prices at ${
    settings.siteTitle || "Future com"
  }.`;
  const keywords = [
    "all products",
    "online shopping",
    "bangladesh",
    "electronics",
    "fashion",
    "lifestyle",
    "future com",
  ];

  if (categorySlug !== "all") {
    try {
      await connectDB();
      const cat: any = await Category.findOne({ slug: categorySlug }).lean();
      if (cat) {
        if (subcategorySlug && (cat as any).subcategories) {
          const sub = (cat as any).subcategories.find(
            (s: any) => s.slug === subcategorySlug
          );
          if (sub) {
            title = `${sub.name} - ${cat.name} | ${
              settings.siteTitle || "Future com"
            }`;
            description = `Shop genuine ${sub.name} in ${cat.name} collection at ${
              settings.siteTitle || "Future com"
            }.`;
          } else {
            title = `${cat.name} | ${settings.siteTitle || "Future com"}`;
          }
        } else {
          title = `${cat.name} Collection | ${
            settings.siteTitle || "Future com"
          }`;
          if (cat.description) description = cat.description;
        }
        keywords.push(cat.name.toLowerCase());
      }
    } catch (e) {
      console.error("Error generating category metadata:", e);
    }
  }

  const canonicalPath = `/categories/${(slug || []).join("/")}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
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
      url: canonicalUrl,
      siteName: settings.siteTitle || "Future com",
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

export default async function CategoryLayout({ children, params }: Props) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";
  const categorySlug = slug?.[0] || "all";

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${siteUrl}/categories/all`,
      },
      ...(categorySlug !== "all"
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: categorySlug,
              item: `${siteUrl}/categories/${(slug || []).join("/")}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      {children}
    </>
  );
}
