import React from "react";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Send,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";
import { getCategories } from "@/lib/api/categories";
import { getSiteSettings } from "@/lib/api/settings";

const Footer = async () => {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  const siteName = settings.siteTitle || "Future com";
  const footerDesc =
    settings.footerDescription ||
    settings.siteDescription ||
    "Future com is a next-generation general store offering a curated selection of electronics, daily essentials, apparel, and lifestyle products. We ensure authentic products, competitive pricing, and fast delivery.";

  const rawWhatsApp = settings.whatsappNumber || "01974003819";
  const formattedWhatsApp = rawWhatsApp.startsWith("88")
    ? rawWhatsApp
    : rawWhatsApp.startsWith("0")
    ? `88${rawWhatsApp}`
    : `880${rawWhatsApp}`;

  return (
    <footer className="relative bg-gradient-to-b from-stone-900 via-stone-950 to-black text-stone-300 overflow-hidden border-t border-white/10">
      
      {/* Decorative ambient gradient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* --- TOP VALUE PROPOSITIONS BAR --- */}
      <div className="relative border-b border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Free Express Shipping</h4>
                <p className="text-xs text-stone-400 mt-0.5">On orders over ৳{(settings.freeShippingThreshold || 2000).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Genuine Items</h4>
                <p className="text-xs text-stone-400 mt-0.5">Verified manufacturer quality</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Safe & Secure Payment</h4>
                <p className="text-xs text-stone-400 mt-0.5">bKash, Nagad, Card & COD</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">24/7 Dedicated Support</h4>
                <p className="text-xs text-stone-400 mt-0.5">Instant WhatsApp & phone call</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- NEWSLETTER CALLOUT BAR --- */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-orange-950/20 via-stone-900/40 to-amber-950/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-400">
              <Sparkles className="w-3.5 h-3.5" /> Newsletter
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Get Exclusive Discounts & Flash Sale Deals
            </h3>
            <p className="text-xs md:text-sm text-stone-400">
              Subscribe to stay updated on new product arrivals, limited seasonal offers, and coupon codes.
            </p>
          </div>

          <form
            action="#"
            className="flex w-full md:w-auto items-center max-w-md gap-2"
          >
            <div className="relative flex-1 min-w-[240px] sm:min-w-[280px]">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex-shrink-0"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* --- MAIN 4-COLUMN FOOTER CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Column 1: Brand Info & Contacts (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <BrandLogo
                logoUrl={settings.logo}
                siteTitle={siteName}
                variant="dark"
                size="lg"
              />
            </Link>

            <p className="text-sm leading-relaxed text-stone-400 pr-2">
              {footerDesc}
            </p>

            {/* Direct Contact Links */}
            <div className="space-y-2.5 pt-2">
              {settings.supportPhone && (
                <a
                  href={`tel:${settings.supportPhone}`}
                  className="flex items-center gap-3 text-sm text-stone-300 hover:text-orange-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{settings.supportPhone}</span>
                </a>
              )}

              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${formattedWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-stone-300 hover:text-emerald-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all flex-shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span>WhatsApp: {settings.whatsappNumber}</span>
                </a>
              )}

              {settings.supportEmail && (
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="flex items-center gap-3 text-sm text-stone-300 hover:text-amber-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>{settings.supportEmail}</span>
                </a>
              )}

              {settings.address && (
                <div className="flex items-start gap-3 text-sm text-stone-400">
                  <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>{settings.address}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-xs uppercase font-extrabold tracking-wider text-stone-400 mb-2.5">
                Connect With Us
              </p>
              <div className="flex flex-wrap gap-2">
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 transition-all shadow-sm"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:scale-110 transition-all shadow-sm"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings.twitter && (
                  <a
                    href={settings.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-black hover:border-stone-700 hover:scale-110 transition-all shadow-sm"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {settings.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] hover:scale-110 transition-all shadow-sm"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
                {settings.linkedin && (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:scale-110 transition-all shadow-sm"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Categories (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="text-white text-base font-bold uppercase tracking-wider">
                Top Categories
              </h4>
              <div className="w-10 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2" />
            </div>

            <ul className="space-y-2.5">
              {categories.slice(0, 7).map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-orange-400 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/categories/all"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 tracking-wide transition-colors"
                >
                  <span>Explore All Categories</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links / Information (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-white text-base font-bold uppercase tracking-wider">
                Company
              </h4>
              <div className="w-10 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2" />
            </div>

            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Blogs & News", href: "/blogs" },
                { label: "Contact Us", href: "/contact" },
                { label: "My Account", href: "/profile" },
                { label: "My Cart", href: "/cart" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-orange-400 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Services & Policies (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="text-white text-base font-bold uppercase tracking-wider">
                Customer Care
              </h4>
              <div className="w-10 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2" />
            </div>

            <ul className="space-y-2.5">
              {[
                { label: "Shipping & Delivery", href: "/shipping" },
                { label: "Return & Refund Policy", href: "/return-and-refund" },
                { label: "Privacy Policy", href: "/privacypolicy" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-orange-400 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Helpline quick card */}
            <div className="pt-3">
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                  Emergency Support
                </span>
                <p className="text-xs text-stone-300">
                  Call us directly or send a WhatsApp message anytime:
                </p>
                <div className="pt-1 font-bold text-sm text-white">
                  {settings.supportPhone || "+880 1974-003819"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- BOTTOM BAR: PAYMENT METHODS & POWERED BY FUTGENSOFT --- */}
      <div className="relative border-t border-white/10 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright notice */}
          <div className="text-center md:text-left text-xs text-stone-400">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-semibold text-stone-200">
                {settings.copyrightText || `${siteName}. All Rights Reserved.`}
              </span>
            </p>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["bKash", "Nagad", "Rocket", "Visa", "Mastercard", "COD"].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-white/[0.06] text-stone-300 border border-white/10 shadow-sm"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Powered by Futgensoft Credit Highlight */}
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Powered by</span>
            <a
              href="https://futgensoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold transition-all border border-orange-500/30 hover:border-orange-500/60 shadow-sm group"
            >
              <span className="group-hover:text-orange-300 transition-colors">Futgensoft</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
