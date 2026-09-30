"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  X,
  Mail,
  Headphones,
  Sparkles,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setSettings(data.data);
      })
      .catch(() => {});

    // Show initial welcoming tooltip after 3 seconds, hide after 9 seconds
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const rawWhatsApp = settings?.whatsappNumber || "01974003819";
  const whatsAppNumber = rawWhatsApp.startsWith("88")
    ? rawWhatsApp
    : rawWhatsApp.startsWith("0")
    ? `88${rawWhatsApp}`
    : `880${rawWhatsApp}`;
  const phoneNumber = settings?.supportPhone || "+880 1974-003819";
  const supportEmail = settings?.supportEmail || "support@futgensoft.com";

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      
      {/* Welcoming Floating Prompt Bubble (when closed) */}
      {!isOpen && showTooltip && (
        <div className="hidden sm:flex items-center gap-2 mb-3 px-4 py-2.5 rounded-2xl bg-stone-900/95 text-white text-xs font-semibold shadow-2xl border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>👋 Need help? We are online!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-white ml-1 p-0.5"
            aria-label="Close message"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Expanded Support Modal Card */}
      {isOpen && (
        <div className="w-[330px] sm:w-[360px] mb-3 bg-stone-950/95 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-stone-100">
          
          {/* Card Header */}
          <div className="relative p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-inner">
                <Headphones className="w-6 h-6" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-black text-sm tracking-wide">
                  <span>Customer Support</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </div>
                <p className="text-[11px] text-amber-100 font-medium">
                  Future com Helpline • Online Now
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
              aria-label="Close support dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice */}
          <div className="px-5 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center gap-2 text-[11px] text-stone-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Average response time: &lt; 2 minutes</span>
          </div>

          {/* Contact Channels List */}
          <div className="p-4 space-y-2.5">
            
            {/* Channel 1: WhatsApp */}
            <Link
              href={`https://wa.me/${whatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-stone-900/80 border border-emerald-500/30 hover:border-emerald-500/60 hover:from-emerald-900/60 hover:to-stone-900 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Chat on WhatsApp</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">FAST</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                    {rawWhatsApp}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Channel 2: Phone Call */}
            <Link
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/50 to-stone-900/80 border border-orange-500/30 hover:border-orange-500/60 hover:from-orange-900/50 hover:to-stone-900 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Direct Phone Call</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30">24/7</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                    {phoneNumber}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Channel 3: Email Support */}
            <Link
              href={`mailto:${supportEmail}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-stone-900/80 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-900/40 hover:to-stone-900 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Send Email Inquiry
                  </div>
                  <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                    {supportEmail}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>

          </div>

          {/* Footer Card */}
          <div className="px-5 py-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
            <span>Official Support Desk</span>
            <span className="font-semibold text-orange-400">Powered by Futgensoft</span>
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className={`group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? "bg-stone-800 text-white hover:bg-stone-700 rotate-0 ring-2 ring-white/20"
            : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-orange-500/35 hover:scale-105"
        }`}
        aria-label={isOpen ? "Close customer support" : "Open customer support"}
      >
        {/* Animated Ripple Pulse Rings when closed */}
        {!isOpen && (
          <>
            <span className="absolute -inset-1 rounded-full bg-orange-500/30 animate-ping opacity-60 pointer-events-none" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-stone-900"></span>
            </span>
          </>
        )}

        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-white animate-bounce" />
            </div>
            <span className="font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline">
              Need Help?
            </span>
          </div>
        )}
      </button>

    </div>
  );
}
