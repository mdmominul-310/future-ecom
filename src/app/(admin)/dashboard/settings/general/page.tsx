"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Globe,
  Upload,
  Phone,
  Mail,
  Share2,
  FileText,
  Save,
  Loader2,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Building,
  Clock,
  ExternalLink,
  BookOpen,
  Activity,
  Code2,
  Tag,
} from "lucide-react";
import Image from "next/image";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingAboutImg, setUploadingAboutImg] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "seo" | "analytics" | "contact" | "social" | "footer" | "about"
  >("general");

  const [formData, setFormData] = useState({
    siteTitle: "Future com",
    siteDescription:
      "Your premier modern general store delivering everyday lifestyle essentials, electronics, fashion, home goods, and quality products at the best prices.",
    metaTitle: "Future com | Premier Online General Store",
    metaDescription:
      "Shop top-tier electronics, modern lifestyle, daily essentials, and fashion at Future com - quality guaranteed with fast delivery nationwide.",
    keywords:
      "Future com, online general store, shopping bangladesh, electronics, fashion, home essentials, daily goods, futgensoft",
    favicon: "/favicon.ico",
    logo: "/logo.png",
    supportPhone: "+880 1974-003819",
    supportEmail: "support@futgensoft.com",
    whatsappNumber: "01974003819",
    address: "Dhaka, Bangladesh",
    workingHours: "24/7 Helpline & Customer Support",
    facebook: "https://facebook.com/futgensoft",
    twitter: "https://twitter.com/futgensoft",
    instagram: "https://instagram.com/futgensoft",
    youtube: "https://youtube.com/@futgensoft",
    linkedin: "https://linkedin.com/company/futgensoft",
    pinterest: "https://pinterest.com",
    footerDescription:
      "Future com is a next-generation general store offering a curated selection of electronics, daily essentials, apparel, and lifestyle products. We ensure authentic products, competitive pricing, and fast delivery.",
    copyrightText: "Future com. All Rights Reserved.",
    announcementBarText:
      "Free Express Shipping on orders over ৳2,000! | Welcome to Future com",
    showAnnouncementBar: true,
    freeShippingThreshold: 2000,

    // About Section
    aboutTitle: "Welcome to Future com",
    aboutSubtitle:
      "Where cutting-edge technology meets everyday lifestyle essentials in one modern general store.",
    aboutStory:
      "Future com was founded with a forward-looking vision: to revolutionize the e-commerce and general retail landscape in Bangladesh. In partnership with Futgensoft's digital technology infrastructure, we deliver an extensive, carefully vetted catalog spanning modern electronics, gadgets, home goods, fashion, and daily essentials directly to your doorstep.\n\nWe eliminate the hassle of traditional shopping by offering authentic products, transparent pricing, secure payment methods, and speedy nationwide fulfillment. Every product is backed by rigorous quality assurance and dependable customer care.",
    aboutMission:
      "Our mission is to empower households and modern shoppers across Bangladesh with immediate access to authentic, high-quality general merchandise, seamless online ordering, and uncompromising post-sale support.",
    aboutImage: "/about-futurecom.png",
    aboutFeature1Title: "100% Authentic Guarantee",
    aboutFeature1Desc:
      "All products are sourced directly from verified manufacturers and distributors with strict quality control.",
    aboutFeature2Title: "Next-Gen General Store",
    aboutFeature2Desc:
      "From smart tech and home utilities to lifestyle and daily necessities, find everything you need in one destination.",
    aboutFeature3Title: "Fast Nationwide Delivery",
    aboutFeature3Desc:
      "Enjoy rapid delivery with real-time order tracking and flexible cash-on-delivery options across the country.",
    aboutFeature4Title: "24/7 Dedicated Support",
    aboutFeature4Desc:
      "Backed by Futgensoft's dedicated tech and support team, we are always ready to answer your questions and assist you.",

    // Analytics & Pixel Tracking
    gtmId: "",
    enableGtm: true,
    fbPixelId: "",
    enableFbPixel: true,
    googleAnalyticsId: "",
    enableGoogleAnalytics: true,
    customHeadScript: "",
    customBodyScript: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setFormData((prev) => ({
          ...prev,
          ...data.data,
        }));
      }
    } catch (error) {
      console.error("Failed to load site settings:", error);
      toast.error("Failed to load settings from server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Local File Upload Handler (No Cloudinary)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "favicon" | "aboutImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === "logo") setUploadingLogo(true);
    else if (field === "favicon") setUploadingFavicon(true);
    else setUploadingAboutImg(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, [field]: result.url }));
        toast.success(
          `${field === "logo" ? "Logo" : field === "favicon" ? "Favicon" : "About Image"} uploaded successfully!`
        );
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error: any) {
      console.error(`Error uploading ${field}:`, error);
      toast.error(`Failed to upload ${field}`);
    } finally {
      if (field === "logo") setUploadingLogo(false);
      else if (field === "favicon") setUploadingFavicon(false);
      else setUploadingAboutImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Site settings updated successfully!");
      } else {
        toast.error(data.error || "Failed to update settings");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-stone-500 font-medium">Loading Site Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm mb-1">
            <Globe className="w-4 h-4" /> Admin Configuration
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            General & Site Settings
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Manage your site branding, SEO metadata, contact details, social media links, About Us page, and footer information.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        {[
          { id: "general", label: "Branding & Identity", icon: Globe },
          { id: "about", label: "About Page & Story", icon: BookOpen },
          { id: "seo", label: "SEO & Metadata", icon: FileText },
          { id: "analytics", label: "Analytics & Pixels", icon: Activity },
          { id: "contact", label: "Support & Contact", icon: Phone },
          { id: "social", label: "Social Links", icon: Share2 },
          { id: "footer", label: "Header & Footer", icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* TAB 1: BRANDING & IDENTITY */}
        {activeTab === "general" && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-500" /> Branding & Site Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Site Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="siteTitle"
                  value={formData.siteTitle}
                  onChange={handleChange}
                  placeholder="e.g. Future com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Site Short Tagline
                </label>
                <input
                  type="text"
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleChange}
                  placeholder="e.g. Your Premier Next-Generation General Store"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Site Logo (Local Upload)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-36 h-20 bg-stone-100 dark:bg-stone-800 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center overflow-hidden p-2">
                    {formData.logo ? (
                      <Image
                        src={formData.logo}
                        alt="Site Logo"
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="text-xs text-stone-400">No Logo</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                      {uploadingLogo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "logo")}
                        disabled={uploadingLogo}
                      />
                    </label>
                    <p className="text-xs text-stone-500">PNG, SVG, WEBP or JPG</p>
                  </div>
                </div>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="Or enter logo path/URL"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                />
              </div>

              {/* Favicon Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Favicon Icon (Local Upload)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center overflow-hidden p-2">
                    {formData.favicon ? (
                      <Image
                        src={formData.favicon}
                        alt="Favicon"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs text-stone-400">No Favicon</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                      {uploadingFavicon ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload Favicon</span>
                      <input
                        type="file"
                        accept="image/*,.ico"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "favicon")}
                        disabled={uploadingFavicon}
                      />
                    </label>
                    <p className="text-xs text-stone-500">ICO, PNG or SVG (32x32px)</p>
                  </div>
                </div>
                <input
                  type="text"
                  name="favicon"
                  value={formData.favicon}
                  onChange={handleChange}
                  placeholder="Or enter favicon path/URL"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT US PAGE & STORY */}
        {activeTab === "about" && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" /> About Us Page & Brand Story
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Page Header Title
                </label>
                <input
                  type="text"
                  name="aboutTitle"
                  value={formData.aboutTitle}
                  onChange={handleChange}
                  placeholder="e.g. Welcome to Future com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Page Subtitle / Tagline
                </label>
                <input
                  type="text"
                  name="aboutSubtitle"
                  value={formData.aboutSubtitle}
                  onChange={handleChange}
                  placeholder="e.g. Where cutting-edge technology meets everyday lifestyle essentials..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Our Story & Company History
                </label>
                <textarea
                  name="aboutStory"
                  rows={5}
                  value={formData.aboutStory}
                  onChange={handleChange}
                  placeholder="Write the story of your store (separate paragraphs with an empty line)..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium leading-relaxed"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Our Mission & Core Promise
                </label>
                <textarea
                  name="aboutMission"
                  rows={3}
                  value={formData.aboutMission}
                  onChange={handleChange}
                  placeholder="Describe your company mission..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              {/* About Image Upload Section */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  About Page Feature Image (Local Upload)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative w-48 h-28 bg-stone-100 dark:bg-stone-800 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center overflow-hidden">
                    {formData.aboutImage ? (
                      <Image
                        src={formData.aboutImage}
                        alt="About Feature"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs text-stone-400">No Image</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                      {uploadingAboutImg ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload About Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "aboutImage")}
                        disabled={uploadingAboutImg}
                      />
                    </label>
                    <p className="text-xs text-stone-500">Suggested resolution: 1200x800px (JPG, PNG, WEBP)</p>
                    <input
                      type="text"
                      name="aboutImage"
                      value={formData.aboutImage}
                      onChange={handleChange}
                      placeholder="Or enter image URL"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Feature Pillars */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-100">
                  4 Core Pillars & Guarantees
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pillar 1 */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Pillar 1</label>
                    <input
                      type="text"
                      name="aboutFeature1Title"
                      value={formData.aboutFeature1Title}
                      onChange={handleChange}
                      placeholder="e.g. 100% Authentic Guarantee"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-bold"
                    />
                    <textarea
                      name="aboutFeature1Desc"
                      rows={2}
                      value={formData.aboutFeature1Desc}
                      onChange={handleChange}
                      placeholder="Pillar 1 description..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900"
                    />
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Pillar 2</label>
                    <input
                      type="text"
                      name="aboutFeature2Title"
                      value={formData.aboutFeature2Title}
                      onChange={handleChange}
                      placeholder="e.g. Next-Gen General Store"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-bold"
                    />
                    <textarea
                      name="aboutFeature2Desc"
                      rows={2}
                      value={formData.aboutFeature2Desc}
                      onChange={handleChange}
                      placeholder="Pillar 2 description..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900"
                    />
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Pillar 3</label>
                    <input
                      type="text"
                      name="aboutFeature3Title"
                      value={formData.aboutFeature3Title}
                      onChange={handleChange}
                      placeholder="e.g. Fast Nationwide Delivery"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-bold"
                    />
                    <textarea
                      name="aboutFeature3Desc"
                      rows={2}
                      value={formData.aboutFeature3Desc}
                      onChange={handleChange}
                      placeholder="Pillar 3 description..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900"
                    />
                  </div>

                  {/* Pillar 4 */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Pillar 4</label>
                    <input
                      type="text"
                      name="aboutFeature4Title"
                      value={formData.aboutFeature4Title}
                      onChange={handleChange}
                      placeholder="e.g. 24/7 Dedicated Support"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-bold"
                    />
                    <textarea
                      name="aboutFeature4Desc"
                      rows={2}
                      value={formData.aboutFeature4Desc}
                      onChange={handleChange}
                      placeholder="Pillar 4 description..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SEO & METADATA */}
        {activeTab === "seo" && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" /> Search Engine Optimization (SEO)
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="e.g. Future com - Premier Online General Store"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  SEO Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  rows={4}
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Detailed description of your store for Google search results..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Meta Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="e.g. Future com, general store, online shopping, electronics, lifestyle, futgensoft"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MARKETING ANALYTICS & PIXELS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" /> Marketing Analytics & Tracking Pixels
                  </h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                    Configure Google Tag Manager, Meta Pixel (Facebook), and Google Analytics (GA4) with automated ecommerce event tracking.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  E-Commerce Events Active
                </div>
              </div>

              {/* Grid for Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Google Tag Manager Card */}
                <div className="p-6 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                        GTM
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-white text-base">
                          Google Tag Manager
                        </h3>
                        <p className="text-xs text-stone-500">Injects GTM script in &lt;head&gt; and noscript in &lt;body&gt;</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="enableGtm"
                        checked={formData.enableGtm}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      GTM Container ID
                    </label>
                    <input
                      type="text"
                      name="gtmId"
                      value={formData.gtmId}
                      onChange={handleChange}
                      placeholder="e.g. GTM-XXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-wrap gap-2 pt-1">
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        dataLayer: Enhanced Ecommerce
                      </span>
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        pageview / view_item / add_to_cart / purchase
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Meta Pixel (Facebook) Card */}
                <div className="p-6 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                        META
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-white text-base">
                          Meta Pixel (Facebook)
                        </h3>
                        <p className="text-xs text-stone-500">Official fbq tracking script with Standard Events</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="enableFbPixel"
                        checked={formData.enableFbPixel}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Meta Pixel ID (Dataset ID)
                    </label>
                    <input
                      type="text"
                      name="fbPixelId"
                      value={formData.fbPixelId}
                      onChange={handleChange}
                      placeholder="e.g. 123456789012345"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-wrap gap-2 pt-1">
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        PageView
                      </span>
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        ViewContent
                      </span>
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        AddToCart
                      </span>
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        InitiateCheckout
                      </span>
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        Purchase (BDT)
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Google Analytics (GA4) Card */}
                <div className="p-6 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/80 space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm">
                        GA4
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-white text-base">
                          Google Analytics 4 (Google Pixel / gtag.js)
                        </h3>
                        <p className="text-xs text-stone-500">Direct gtag stream measurement alongside GTM</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="enableGoogleAnalytics"
                        checked={formData.enableGoogleAnalytics}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      GA4 Measurement ID
                    </label>
                    <input
                      type="text"
                      name="googleAnalyticsId"
                      value={formData.googleAnalyticsId}
                      onChange={handleChange}
                      placeholder="e.g. G-XXXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <p className="text-xs text-stone-500">
                      Found in Google Analytics &rarr; Admin &rarr; Data Streams &rarr; Measurement ID.
                    </p>
                  </div>
                </div>

                {/* 4. Custom Head Script */}
                <div className="p-6 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-orange-500" />
                      <h4 className="font-bold text-stone-900 dark:text-white text-sm">
                        Custom Head Code (&lt;head&gt;)
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-400">e.g. TikTok Pixel, Pinterest Tag</span>
                  </div>
                  <textarea
                    name="customHeadScript"
                    rows={4}
                    value={formData.customHeadScript}
                    onChange={handleChange}
                    placeholder="<!-- Enter custom JS tracking code to inject into <head> -->"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* 5. Custom Body Script */}
                <div className="p-6 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-orange-500" />
                      <h4 className="font-bold text-stone-900 dark:text-white text-sm">
                        Custom Body Code (&lt;body&gt;)
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-400">e.g. Live Chat scripts, Hotjar</span>
                  </div>
                  <textarea
                    name="customBodyScript"
                    rows={4}
                    value={formData.customBodyScript}
                    onChange={handleChange}
                    placeholder="<!-- Enter custom tracking code to inject into <body> -->"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPORT & CONTACT */}
        {activeTab === "contact" && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" /> Customer Support & Contact Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Support Helpline Number
                </label>
                <input
                  type="text"
                  name="supportPhone"
                  value={formData.supportPhone}
                  onChange={handleChange}
                  placeholder="e.g. +880 1974-003819"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  WhatsApp Support Number
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. 01974003819"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Support Email Address
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  placeholder="e.g. support@futgensoft.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Working Hours Info
                </label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  placeholder="e.g. 24/7 Helpline or Mon-Sat 9AM-9PM"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Physical Office / Store Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOCIAL LINKS */}
        {activeTab === "social" && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-orange-500" /> Social Media Page Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/futgensoft"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/futgensoft"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Twitter / X Profile URL
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/futgensoft"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@futgensoft"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  LinkedIn Page URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/futgensoft"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Pinterest Profile URL
                </label>
                <input
                  type="url"
                  name="pinterest"
                  value={formData.pinterest}
                  onChange={handleChange}
                  placeholder="https://pinterest.com/yourprofile"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HEADER & FOOTER */}
        {activeTab === "footer" && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-orange-500" /> Header Ticker & Footer Settings
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" /> Show Top Announcement Bar
                  </label>
                  <input
                    type="checkbox"
                    name="showAnnouncementBar"
                    checked={formData.showAnnouncementBar}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                      Top Announcement Bar Text
                    </label>
                    <input
                      type="text"
                      name="announcementBarText"
                      value={formData.announcementBarText}
                      onChange={handleChange}
                      placeholder="e.g. Free Express Shipping on orders over ৳2,000! | Welcome to Future com"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                      Free Shipping Threshold Amount (৳)
                    </label>
                    <input
                      type="number"
                      name="freeShippingThreshold"
                      value={formData.freeShippingThreshold}
                      onChange={handleChange}
                      placeholder="2000"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Footer About / Description Text
                </label>
                <textarea
                  name="footerDescription"
                  rows={3}
                  value={formData.footerDescription}
                  onChange={handleChange}
                  placeholder="Footer about company text..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                  Footer Copyright Notice Text
                </label>
                <input
                  type="text"
                  name="copyrightText"
                  value={formData.copyrightText}
                  onChange={handleChange}
                  placeholder="e.g. Future com. All Rights Reserved."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-base rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
