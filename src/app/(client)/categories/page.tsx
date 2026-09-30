import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getCategories } from "@/lib/api/categories";

export const revalidate = 60;

// SEO metadata for the page
export const metadata: Metadata = {
  title: "All Categories | Maven Zone",
  description:
    "Browse all product categories available at Maven Zone. Find everything from fashion and electronics to home goods and more.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            All Categories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our diverse range of collections to find exactly what
            you&apos;re looking for.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group block"
              >
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800">
                    <Image
                      src={category.image?.url || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Category Name */}
                  <div className="p-4 text-center bg-white dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">
              No categories found at the moment.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
