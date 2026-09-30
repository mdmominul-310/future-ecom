import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define the expected props for the component
interface PromotionalCardProps {
  category: any;
  index: number;
}

export default function PromotinalCard({
  category,
  index,
}: PromotionalCardProps) {
  // This logic is preserved to alternate the layout
  const isOdd = index % 2 !== 0;

  return (
    <div
      className={`
        w-full overflow-hidden rounded-2xl bg-white 
        text-center shadow-2xl flex flex-col
        ${isOdd ? "flex-col-reverse" : ""}
      `}
    >
      {/* Product Image Section */}
      {/* The container is made relative and given a specific height */}
      <div className="relative h-64 w-full ">
        <Image
          src={category.image.url}
          alt={`Promotional image for ${category.name}`}
          fill // Makes the image fill the parent container
          // 'contain' ensures the full image is visible without cropping
          className="object-contain"
        />
      </div>

      {/* Text Content Section (This part remains unchanged) */}
      <div className="flex flex-col items-center p-8">
        <h2 className="mb-2 text-4xl font-bold text-gray-900">
          {category.name}
        </h2>
        <p className="mb-8 text-base text-gray-600">
          {category.description.slice(0, 100)}...
        </p>

        {/* Shop Now Button */}
        <Link href={`/category/${category.slug}`} passHref>
          <button className="group flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-gray-700">
            <span>Shop Now</span>
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}
