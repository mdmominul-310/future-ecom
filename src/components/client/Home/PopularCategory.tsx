"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

type Category = {
  id: string;
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
};

type CategoryListProps = {
  categories: Category[];
};

export default function PopularCategories({ categories }: CategoryListProps) {
  return (
    <section className="w-full px-2 mb-2 pt-2">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">categories</h2>
          <Link
            href="/category/all"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            view all
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <Swiper
          slidesPerView={"auto"}
          spaceBetween={12}
          freeMode={true}
          modules={[FreeMode]}
          className="!pl-4 !-mx-4 pb-2"
        >
          {categories.map((category: Category) => (
            <SwiperSlide
              key={category._id}
              style={{ width: "auto" }} // allows dynamic width based on content
            >
              <Link
                href={`/category/${category.slug}`}
                className="flex border items-center px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={category.image.url || "/placeholder.svg"}
                  alt=""
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="font-medium text-gray-800">
                  {category.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
