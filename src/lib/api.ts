// lib/api.ts

type FilterParams = {
  slug?: string;
  categoryId?: number;
  title?: string;
  price_min?: number;
  price_max?: number;
  limit?: number;
  offset?: number;
};

export async function getFilteredProducts(filters: FilterParams = {}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.escuelajs.co/api/v1";
  const url = new URL(`${baseUrl}/products`);

  if (filters.slug && filters.slug !== "all") {
    url.searchParams.append("categorySlug", filters.slug);
  }

  if (filters.categoryId) {
    url.searchParams.append("categoryId", filters.categoryId.toString());
  }

  if (filters.title) {
    url.searchParams.append("title", filters.title);
  }

  if (filters.price_min !== undefined) {
    url.searchParams.append("price_min", filters.price_min.toString());
  }

  if (filters.price_max !== undefined) {
    url.searchParams.append("price_max", filters.price_max.toString());
  }

  if (filters.limit !== undefined) {
    url.searchParams.append("limit", filters.limit.toString());
  }

  if (filters.offset !== undefined) {
    url.searchParams.append("offset", filters.offset.toString());
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

  if (!res.ok) return [];

  return res.json();
}
