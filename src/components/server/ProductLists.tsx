import { FeaturedProducts } from "@/components/client/FeaturedProducts";
import { TrendingProducts } from "@/components/client/TrendingProduct";

// Helper function to fetch products
async function getProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=12`,
      {
        next: { revalidate: 60, tags: ["products"] },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch products:", res.statusText);
      return []; // Return empty array on error
    }

    const data = await res.json();
    return data?.products || []; // Ensure an array is always returned
  } catch (error) {
    console.error("Fetch Products failed:", error);
    return []; // Return empty array on exception
  }
}

// Async component for Featured Products
export async function FeaturedProductsList() {
  const products = await getProducts();

  if (products.length === 0) {
    return null; // Don't render the section if there are no products
  }

  return <FeaturedProducts products={products} />;
}

// Async component for Trending Products
export async function TrendingProductsList({
  categories,
}: {
  categories: any[];
}) {
  const products = await getProducts();

  if (products.length === 0) {
    return null; // Don't render the section if there are no products
  }

  return <TrendingProducts categories={categories} products={products} />;
}
