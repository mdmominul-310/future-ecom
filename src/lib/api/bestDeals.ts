export async function getBestDealProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch best deal products");
    return res.json();
  } catch (error) {
    console.error("Error fetching best deals:", error);
    return []; // fallback
  }
}
