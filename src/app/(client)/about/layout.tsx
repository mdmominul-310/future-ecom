import type { Metadata } from "next";

// --- SEO Structured Data ---
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Future com",
  url: "https://futgensoft.com",
  logo: "https://futgensoft.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+880 1974-003819",
    contactType: "customer service",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Future com",
  url: "https://futgensoft.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://futgensoft.com/categories/all?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  title: "About Us | Future com",
  description:
    "Learn about Future com - a premier next-generation general store offering quality lifestyle, electronics, fashion, and everyday essentials nationwide.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Future com",
    description:
      "Future com is your modern, trusted general store delivering top-tier everyday products, electronics, and lifestyle goods at unbeatable prices.",
    url: "https://futgensoft.com/about",
    siteName: "Future com",
    images: [
      {
        url: "https://futgensoft.com/logo.png",
        width: 1200,
        height: 630,
        alt: "About Future com",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Future com",
    description: "Learn about Future com - your premier online general store.",
    images: ["https://futgensoft.com/logo.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {children}
    </>
  );
}
