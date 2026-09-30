"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe, Sparkles, CheckCircle2, AlertCircle, Link as LinkIcon } from "lucide-react";

interface SEOEditorCardProps {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  slug?: string;
  canonicalUrl?: string;
  author?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  baseUrlPath?: string; // e.g. "products" or "blogs"
  showSlug?: boolean;
  showAuthor?: boolean;
  onChange: (field: string, value: string) => void;
}

export function SEOEditorCard({
  metaTitle = "",
  metaDescription = "",
  metaKeywords = "",
  slug = "",
  canonicalUrl = "",
  author = "",
  defaultTitle = "",
  defaultDescription = "",
  baseUrlPath = "products",
  showSlug = true,
  showAuthor = false,
  onChange,
}: SEOEditorCardProps) {
  const displayTitle = metaTitle || defaultTitle || "Preview Title - Future com";
  const displaySnippet =
    metaDescription ||
    defaultDescription?.replace(/<[^>]+>/g, "").substring(0, 160) ||
    "Provide a meta description to see how your page will appear to searchers on Google...";
  const displaySlug = slug || "your-item-slug";

  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;

  const isTitleOptimal = titleLength >= 35 && titleLength <= 65;
  const isDescOptimal = descLength >= 100 && descLength <= 165;

  const handleAutoSlug = () => {
    const source = metaTitle || defaultTitle || "";
    const generatedSlug = source
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (generatedSlug) {
      onChange("slug", generatedSlug);
    }
  };

  const handleUseDefaultTitle = () => {
    if (defaultTitle) {
      onChange("metaTitle", defaultTitle);
    }
  };

  const handleUseDefaultDesc = () => {
    if (defaultDescription) {
      const clean = defaultDescription.replace(/<[^>]+>/g, "").trim().substring(0, 155);
      onChange("metaDescription", clean);
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Search Engine Optimization (SEO)
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Google Ready
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Optimize meta tags, URLs, and search snippet visibility
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* GOOGLE SEARCH RESULT PREVIEW CARD */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Google Search Result Preview
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Desktop & Mobile snippet</span>
          </div>

          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold">
                F
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 truncate">
                <span>Future com</span>
                <span>›</span>
                <span>{baseUrlPath}</span>
                <span>›</span>
                <span className="text-slate-500 truncate">{displaySlug}</span>
              </div>
            </div>

            <div className="text-[#1a0dab] dark:text-[#8ab4f8] font-medium text-base hover:underline cursor-pointer line-clamp-1 leading-snug">
              {displayTitle}
            </div>

            <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed">
              {displaySnippet}
            </p>
          </div>
        </div>

        {/* INPUT FIELDS */}
        <div className="grid grid-cols-1 gap-5">
          {/* META TITLE */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaTitle" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                SEO Meta Title
              </Label>
              <div className="flex items-center gap-2">
                {defaultTitle && !metaTitle && (
                  <button
                    type="button"
                    onClick={handleUseDefaultTitle}
                    className="text-[11px] text-orange-600 hover:underline"
                  >
                    Copy item title
                  </button>
                )}
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isTitleOptimal
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : titleLength > 65
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {titleLength}/60 chars {isTitleOptimal ? "✓ Optimal" : ""}
                </span>
              </div>
            </div>
            <Input
              id="metaTitle"
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => onChange("metaTitle", e.target.value)}
              placeholder={defaultTitle || "e.g., Wireless Noise Canceling Headphones - Future com"}
              className="text-xs rounded-xl border-slate-300 dark:border-slate-700"
            />
            <p className="text-[11px] text-slate-500">
              Target 40-60 characters for best Google display without truncation.
            </p>
          </div>

          {/* META DESCRIPTION */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaDescription" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                SEO Meta Description
              </Label>
              <div className="flex items-center gap-2">
                {defaultDescription && !metaDescription && (
                  <button
                    type="button"
                    onClick={handleUseDefaultDesc}
                    className="text-[11px] text-orange-600 hover:underline"
                  >
                    Copy item description
                  </button>
                )}
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isDescOptimal
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : descLength > 165
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {descLength}/160 chars {isDescOptimal ? "✓ Optimal" : ""}
                </span>
              </div>
            </div>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              rows={3}
              value={metaDescription}
              onChange={(e) => onChange("metaDescription", e.target.value)}
              placeholder="A concise, high-converting summary with keywords to attract organic clicks..."
              className="text-xs rounded-xl border-slate-300 dark:border-slate-700"
            />
            <p className="text-[11px] text-slate-500">
              Recommended between 120 and 160 characters.
            </p>
          </div>

          {/* SLUG & KEYWORDS IN 2 COLUMNS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {showSlug && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    URL Slug
                  </Label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="text-[11px] text-orange-600 hover:underline"
                  >
                    Auto-generate
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => onChange("slug", e.target.value)}
                    placeholder="clean-item-slug"
                    className="text-xs rounded-xl border-slate-300 dark:border-slate-700 pl-3"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="metaKeywords" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                SEO Keywords (Comma Separated)
              </Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                value={metaKeywords}
                onChange={(e) => onChange("metaKeywords", e.target.value)}
                placeholder="gadgets, audio, wireless, bangladesh"
                className="text-xs rounded-xl border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          {/* OPTIONAL: CANONICAL URL & AUTHOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="canonicalUrl" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-slate-400" />
                Custom Canonical URL (Optional)
              </Label>
              <Input
                id="canonicalUrl"
                name="canonicalUrl"
                value={canonicalUrl}
                onChange={(e) => onChange("canonicalUrl", e.target.value)}
                placeholder="https://futurecom.com/products/item"
                className="text-xs rounded-xl border-slate-300 dark:border-slate-700"
              />
            </div>

            {showAuthor && (
              <div className="space-y-1.5">
                <Label htmlFor="author" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Article Author
                </Label>
                <Input
                  id="author"
                  name="author"
                  value={author}
                  onChange={(e) => onChange("author", e.target.value)}
                  placeholder="Future com Editorial Team"
                  className="text-xs rounded-xl border-slate-300 dark:border-slate-700"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
