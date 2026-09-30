import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "../ProductCard";
// import Image from "next/image";
// import { ProductCard } from "./ProductCard";
// import ProductCard from "./ProductCard";
// import { ProductCard } from "../ProductCard";

export default async function CategoryWiseProduct({ category }: any) {
  const categoryId = category._id;
  // const res = await fetch("http://localhost:3000/api/products/trending");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${categoryId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  const products = data.products;

  if (products.length === 0) return <></>;
  // console.log("products", products);
  // console.log("category", category);
  // console.log("categoryId", categoryId);
  return (
    <section className="  max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <Link
          href="#"
          className="text-gray-600 inline-flex items-center hover:text-gray-900"
        >
          View All Products <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

// const products = [
//   {
//     id: 1,
//     title: "Speaker",
//     slug: "speaker",
//     price: 580,
//     description:
//       "Compact and powerful, this speaker delivers clear sound and deep bass. Ideal for both indoor and outdoor use.",
//     category: {
//       id: 5,
//       name: "Speaker",
//       slug: "speaker",
//       image: "/products/speaker.jpg",
//       creationAt: "2025-04-11T21:49:37.000Z",
//       updatedAt: "2025-04-12T02:14:44.000Z",
//     },
//     images: ["/products/speaker.jpg"],
//     creationAt: "2025-04-11T21:49:37.000Z",
//     updatedAt: "2025-04-11T21:49:37.000Z",
//   },
//   {
//     id: 2,
//     title: "Speaker Webp",
//     slug: "speaker-webp",
//     price: 1780,
//     originalPrice: 1980,
//     description:
//       "A modern speaker with enhanced connectivity and audio clarity, perfect for music lovers.",
//     category: {
//       id: 5,
//       name: "Speaker",
//       slug: "speaker",
//       image: "/products/speaker.jpg",
//       creationAt: "2025-04-11T21:49:37.000Z",
//       updatedAt: "2025-04-12T02:14:44.000Z",
//     },
//     images: ["/products/speaker.webp"],
//     creationAt: "2025-04-11T21:49:37.000Z",
//     updatedAt: "2025-04-11T21:49:37.000Z",
//   },
//   {
//     id: 3,
//     title: "White Apple Watch",
//     slug: "white-apple-watch",
//     price: 2780,
//     description:
//       "Stylish and functional, this smartwatch keeps you connected while monitoring your health in real-time.",
//     category: {
//       id: 2,
//       name: "Watch",
//       slug: "watch",
//       image: "/products/watch.jpg",
//       creationAt: "2025-04-11T21:49:37.000Z",
//       updatedAt: "2025-04-12T02:14:44.000Z",
//     },
//     images: ["/products/white-apple-watch.png"],
//     creationAt: "2025-04-11T21:49:37.000Z",
//     updatedAt: "2025-04-11T21:49:37.000Z",
//   },
//   {
//     id: 4,
//     title: "Mobile",
//     slug: "mobile",
//     price: 110,
//     description:
//       "Affordable mobile phone with all essential features and smooth performance.",
//     category: {
//       id: 1,
//       name: "Mobile",
//       slug: "mobile",
//       image: "/products/mobile.jpg",
//       creationAt: "2025-04-11T21:49:37.000Z",
//       updatedAt: "2025-04-12T02:14:44.000Z",
//     },
//     images: ["/products/mobile.jpg"],
//     creationAt: "2025-04-11T21:49:37.000Z",
//     updatedAt: "2025-04-11T21:49:37.000Z",
//   },
//   {
//     id: 5,
//     title: "Smart Buds",
//     slug: "smart-buds",
//     price: 780,
//     description:
//       "Wireless earbuds with noise cancellation and long battery life—ideal for travel and workouts.",
//     category: {
//       id: 4,
//       name: "Accessories",
//       slug: "accessories",
//       image: "/products/accesories.jpg",
//       creationAt: "2025-04-11T21:49:37.000Z",
//       updatedAt: "2025-04-12T02:14:44.000Z",
//     },
//     images: ["/category/smart-buds.png"],
//     creationAt: "2025-04-11T21:49:37.000Z",
//     updatedAt: "2025-04-11T21:49:37.000Z",
//   },
// ];
