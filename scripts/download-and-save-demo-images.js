const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://mdmominulislam310_db_user:AyAkXX6zXNysxqYy@cluster0.n9zqo1n.mongodb.net/ecom?retryWrites=true&w=majority";

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const publicDir = path.join(process.cwd(), "public");
  const uploadsProductsDir = path.join(publicDir, "uploads", "products");
  const uploadsCategoriesDir = path.join(publicDir, "uploads", "categories");
  const uploadsBlogsDir = path.join(publicDir, "uploads", "blogs");
  const uploadsBannersDir = path.join(publicDir, "uploads", "banners");

  [uploadsProductsDir, uploadsCategoriesDir, uploadsBlogsDir, uploadsBannersDir].forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });

  // 1. Process Categories
  console.log("\n--- Processing Categories ---");
  const categories = await mongoose.connection.collection("categories").find({}).toArray();
  for (const cat of categories) {
    const rawUrl = cat.image?.url;
    if (rawUrl && rawUrl.startsWith("http")) {
      const filename = `${cat.slug || cat._id}.jpg`;
      const destPath = path.join(uploadsCategoriesDir, filename);
      console.log(`Downloading category image for ${cat.name}...`);
      const ok = await downloadImage(rawUrl, destPath);
      if (ok) {
        const localUrl = `/uploads/categories/${filename}`;
        await mongoose.connection.collection("categories").updateOne(
          { _id: cat._id },
          { $set: { "image.url": localUrl, "image.public_id": filename } }
        );
        console.log(`Updated category ${cat.name} -> ${localUrl}`);
      }
    }
  }

  // 2. Process Hero Slides
  console.log("\n--- Processing Hero Slides ---");
  const slides = await mongoose.connection.collection("heroslides").find({}).toArray();
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const rawUrl = slide.image?.url;
    if (rawUrl && rawUrl.startsWith("http")) {
      const filename = `hero-slide-${i + 1}.jpg`;
      const destPath = path.join(uploadsBannersDir, filename);
      console.log(`Downloading hero banner image for ${slide.title}...`);
      const ok = await downloadImage(rawUrl, destPath);
      if (ok) {
        const localUrl = `/uploads/banners/${filename}`;
        await mongoose.connection.collection("heroslides").updateOne(
          { _id: slide._id },
          { $set: { "image.url": localUrl, "image.public_id": filename } }
        );
        console.log(`Updated hero slide ${slide.title} -> ${localUrl}`);
      }
    }
  }

  // 3. Process Blogs
  console.log("\n--- Processing Blogs ---");
  const blogs = await mongoose.connection.collection("blogs").find({}).toArray();
  for (const blog of blogs) {
    const rawUrl = blog.imageUrl?.url;
    if (rawUrl && rawUrl.startsWith("http")) {
      const filename = `${blog.slug || blog._id}.jpg`;
      const destPath = path.join(uploadsBlogsDir, filename);
      console.log(`Downloading blog image for ${blog.title}...`);
      const ok = await downloadImage(rawUrl, destPath);
      if (ok) {
        const localUrl = `/uploads/blogs/${filename}`;
        await mongoose.connection.collection("blogs").updateOne(
          { _id: blog._id },
          { $set: { "imageUrl.url": localUrl, "imageUrl.public_id": filename } }
        );
        console.log(`Updated blog ${blog.title} -> ${localUrl}`);
      }
    }
  }

  // 4. Process All Products
  console.log("\n--- Processing All Products ---");
  const products = await mongoose.connection.collection("products").find({}).toArray();
  console.log(`Found ${products.length} products to process.`);

  let updatedCount = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const slug = p.slug || `product-${i + 1}`;
    const filename = `${slug}.jpg`;
    const destPath = path.join(uploadsProductsDir, filename);

    const firstImage = p.images?.[0];
    const rawUrl =
      typeof firstImage === "string"
        ? firstImage
        : firstImage?.url || p.image || null;

    if (rawUrl && rawUrl.startsWith("http")) {
      process.stdout.write(`[${i + 1}/${products.length}] Downloading ${p.name.slice(0, 30)}... `);
      const ok = await downloadImage(rawUrl, destPath);
      if (ok) {
        const localUrl = `/uploads/products/${filename}`;
        const newImages = [{ public_id: filename, url: localUrl }];
        const newAdditionalImages = [{ public_id: filename, url: localUrl }];

        await mongoose.connection.collection("products").updateOne(
          { _id: p._id },
          {
            $set: {
              images: newImages,
              additionalImages: newAdditionalImages,
            },
          }
        );
        console.log(`DONE -> ${localUrl}`);
        updatedCount++;
      } else {
        console.log("FAILED");
      }
    } else {
      console.log(`[${i + 1}/${products.length}] ${p.name.slice(0, 30)} already has local or no image.`);
    }
  }

  console.log(`\nAll done! Successfully updated ${updatedCount} products with local demo images in public/uploads/products/`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
