"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setSettings(data.data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // --- Form validation (unchanged) ---
    if (!data.name) {
      toast.warning("দয়া করে আপনার নাম দিন");
      return;
    }
    if (!data.email) {
      toast.warning("দয়া করে আপনার ইমেইল দিন");
      return;
    }
    if (!data.subject) {
      toast.warning("দয়া করে বিষয় দিন");
      return;
    }
    if (!data.message) {
      toast.warning("দয়া করে বার্তা দিন");
      return;
    }

    if (data.name && data.email && data.subject && data.message) {
      try {
        setIsLoading(true);
        const res = await fetch("/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Something went wrong");
        }
        toast.success(
          "ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।"
        );
        form.reset();
      } catch (error: any) {
        toast.error("দুঃখিত, বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।");
        console.error("Form submission error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- START: DESIGN UPGRADE ---
  const inputClasses =
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow shadow-sm";
  // --- END: DESIGN UPGRADE ---

  return (
    // --- START: DESIGN UPGRADE ---
    // Using the warm, off-white background for brand consistency.
    <div className="bg-[#FFFBF5]">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            যোগাযোগ করুন
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            আপনার যেকোনো প্রশ্ন, মতামত অথবা পরামর্শ থাকলে আমাদের জানান। আমরা
            আপনার বার্তা শোনার জন্য প্রস্তুত।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200/80">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              আমাদের মেসেজ পাঠান
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  আপনার নাম<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="আপনার সম্পূর্ণ নাম"
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  আপনার ইমেইল<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@gmail.com"
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  বিষয়<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="আপনার বার্তার বিষয়"
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  আপনার বার্তা<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="আপনার বার্তাটি এখানে লিখুন..."
                  required
                  className={inputClasses}
                ></textarea>
              </div>
              {/* Upgraded button with brand's accent color */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full shadow-lg bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 disabled:bg-orange-400"
              >
                {isLoading ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200/80">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                আমাদের ঠিকানা ও তথ্য
              </h2>
              <div className="space-y-5">
                {/* Updated with info from your footer */}
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-orange-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      আমাদের ঠিকানা
                    </h3>
                    <p className="text-gray-600">
                      {settings?.address || "ঢাকা, বাংলাদেশ"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-orange-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      ফোন নাম্বার
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href={`tel:${settings?.supportPhone || "01969276771"}`}
                        className="hover:text-orange-600"
                      >
                        {settings?.supportPhone || "01969-276771"}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-orange-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      ইমেইল এড্রেস
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href={`mailto:${settings?.supportEmail || "support@futgensoft.com"}`}
                        className="hover:text-orange-600"
                      >
                        {settings?.supportEmail || "support@futgensoft.com"}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgraded Map Section */}
            <div className="w-full h-64 rounded-xl shadow-lg overflow-hidden border border-gray-200/80">
              <Image
                src="/cmap.png"
                alt="কক্সবাজারের মানচিত্র"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    // --- END: DESIGN UPGRADE ---
  );
};

export default ContactPage;
