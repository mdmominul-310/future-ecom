// /src/app/(client)/layout.tsx
import BottomNavigation from "@/components/client/BottomNavigation";
import ContactFAB from "@/components/client/ContactFAB";
import Footer from "@/components/client/Footer";
import { Navbar } from "@/components/client/Navbar";
import SalesToastNotifier from "@/components/client/SaleToastNotifier";
import { Toaster } from "sonner";

// --- Structured Data for Organization and Website ---
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

// **This schema is now updated with your correct search URL**
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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className=" bg-[#F7F5EF]">
      {/* Injecting site-wide structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <Toaster richColors closeButton />
      <SalesToastNotifier />

      <Navbar />
      <div className="pb-16">{children}</div>
      <Footer />
      <BottomNavigation />
      {/* Floating Action Button */}
      <ContactFAB />
    </section>
  );
}
