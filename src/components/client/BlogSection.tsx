"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion"; // 1. Import motion

// --- Type Definition ---
interface BlogPost {
  _id: string;
  imageUrl: {
    url: string;
    public_id: string;
  };
  date: string;
  title: string;
  slug: string;
  category?: string;
}

// --- START: UPGRADED BLOG CARD ---
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Link
      href={`/blogs/${post._id}`}
      className="group block rounded-xl overflow-hidden h-80"
    >
      <div className="relative w-full h-full">
        <Image
          src={post.imageUrl.url}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          {post.category && (
            <span className="mb-2 inline-block rounded-full bg-orange-600/20 px-3 py-1 text-xs font-semibold text-orange-300">
              {post.category}
            </span>
          )}
          <p className="text-sm uppercase tracking-wide opacity-80">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h3 className="font-bold text-xl leading-tight line-clamp-2 mt-1">
            {post.title}
          </h3>
          <div className="mt-4 flex items-center text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
// --- END: UPGRADED BLOG CARD ---

const BlogSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function getRecentBlogPosts() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/blogs?limit=5&sort=date&order=desc&status=published`
        );
        if (!res.ok) throw new Error("Failed to fetch blog posts");
        const data = await res.json();
        setBlogPosts(data.blogs || []);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    getRecentBlogPosts();
  }, []);

  return (
    // 2. Wrap the section in a motion component and add animation props
    <motion.section
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
          From Our Blog
        </h2>
        <Link href="/blogs">
          <span className="group inline-flex items-center text-orange-600 font-semibold transition-colors hover:text-orange-700">
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      <div className="relative">
        {loading ? (
          <div className="text-center p-10 text-gray-500">Loading posts...</div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            No recent blog posts found.
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation === "object"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            slidesPerView={1.2}
            spaceBetween={24}
            loop={blogPosts.length > 3}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post._id}>
                <BlogCard post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <button
          ref={prevRef}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-sm w-10 h-10 rounded-full items-center justify-center shadow-md hover:bg-white transition -translate-x-4"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          ref={nextRef}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-sm w-10 h-10 rounded-full items-center justify-center shadow-md hover:bg-white transition translate-x-4"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </motion.section>
  );
};

export default BlogSection;
