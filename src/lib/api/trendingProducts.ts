export async function getTrendingProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch trending products");
    return res.json();
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return []; // fallback
  }
}
