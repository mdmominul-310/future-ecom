// import ProductClient from "@/components/products/ProductClient"

import LandingPage from "@/components/client/LandingPage";
// import ProductClient from "@/components/client/products/ProductClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return <div>Product not found</div>;
    }
    if (res.status === 500) {
      return <div>Server error</div>;
    }
    if (res.status === 400) {
      return <div>Bad request</div>;
    }
    if (res.status === 401) {
      return <div>Unauthorized</div>;
    }
    throw new Error("Failed to fetch product");
  }
  const product = await res.json();

  console.log(product);

  return <LandingPage product={product} />;
}
