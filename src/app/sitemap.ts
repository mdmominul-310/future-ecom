import { MetadataRoute } from "next";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";

  try {
    await connectDB();

    // 1. Fetch data directly from the database
    const products = await Product.find({ status: "published" }, "_id updatedAt").lean();
    const categories = await Category.find({}, "slug updatedAt").lean();
    const blogs = await Blog.find({ status: "published" }, "_id updatedAt").lean();

    // 2. Create URL objects for dynamic routes
    const productUrls: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${SITE_URL}/products/${product._id}`,
      lastModified: new Date(product.updatedAt || Date.now()).toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categories.map((category: any) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt || Date.now()).toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const blogUrls: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
      url: `${SITE_URL}/blogs/${blog._id}`,
      lastModified: new Date(blog.updatedAt || Date.now()).toISOString(),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    // 3. Define all static page URLs
    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/categories/all`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/blogs`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ];

    return [...staticUrls, ...productUrls, ...categoryUrls, ...blogUrls];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return [
      {
        url: SITE_URL,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/categories/all`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/blogs`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];
  }
}
