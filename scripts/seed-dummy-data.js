const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mdmominulislam310_db_user:AyAkXX6zXNysxqYy@cluster0.n9zqo1n.mongodb.net/ecom?retryWrites=true&w=majority';

// Schema definitions
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }]
}, { timestamps: true });

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, lowercase: true, unique: true },
  description: { type: String },
  image: { public_id: String, url: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const SizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, default: "New Product" },
  description: { type: String, default: "" },
  shortDescription: { type: String, default: "" },
  keyFeatures: { type: [String], default: [] },
  price: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  buyPrice: { type: Number, default: 0 },
  costPerProduct: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  stock: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
  brand: { type: String, default: "" },
  weight: { type: String, default: "" },
  dimensions: { width: String, height: String, depth: String },
  warranty: { type: String, default: "" },
  returnPolicy: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  tags: [String],
  images: [{ public_id: String, url: String }],
  additionalImages: [{ public_id: String, url: String }],
  specifications: [{ name: String, value: String }],
  colors: [{ _id: String, name: String, value: String, description: String }],
  sizes: [{ _id: String, name: String, value: String, description: String }],
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 12 },
  soldCount: { type: Number, default: 45 },
  clickCount: { type: Number, default: 120 },
  revenueGenerated: { type: Number, default: 2500 },
  wishlistCount: { type: Number, default: 18 },
  featured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  slug: { type: String, unique: true, sparse: true },
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  currency: { type: String, default: "USD" },
  status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
  variants: [{
    name: String,
    salePrice: Number,
    price: Number,
    discount: Number,
    sku: String,
    stock: Number
  }]
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { public_id: String, url: String },
  date: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ["draft", "published"], default: "published" }
}, { timestamps: true });

const HeroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String },
  image: { public_id: String, url: String },
  url: { type: String, required: true },
  linkType: { type: String, enum: ["category", "product"], required: true },
  linkedId: { type: String, required: true }
}, { timestamps: true });

const CampaignBannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { public_id: String, url: String },
  targetDate: { type: Date, required: true },
  linkedProductId: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Models
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
const Color = mongoose.models.Color || mongoose.model('Color', ColorSchema);
const Size = mongoose.models.Size || mongoose.model('Size', SizeSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
const CampaignBanner = mongoose.models.CampaignBanner || mongoose.model('CampaignBanner', CampaignBannerSchema);

// Helper function to build products
const rawProducts = [
  // --- ELECTRONICS (12 products) ---
  {
    name: 'Wireless Noise Canceling Headphones Pro',
    cat: 'Electronics', sub: 'Headphones', brand: 'AcousticAudio', price: 299, salePrice: 249,
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    desc: 'Studio-quality audio with advanced active noise cancellation and 30-hour battery life.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Ultra Slim Smartwatch Ultra 2',
    cat: 'Electronics', sub: 'Smartwatches', brand: 'TechPulse', price: 199, salePrice: 159,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    desc: 'Track health, workouts, heart rate, and sleep with high-precision sensors and AMOLED display.',
    feat: true, best: true, newArr: true
  },
  {
    name: 'Pro Minimalist Mechanical Keyboard',
    cat: 'Electronics', sub: 'Laptops', brand: 'KeyCraft', price: 149, salePrice: 119,
    img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    desc: 'Engineered for precision and tactile satisfaction with hot-swappable switches and RGB backlight.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Mirrorless 4K Digital Camera',
    cat: 'Electronics', sub: 'Cameras', brand: 'OpticX', price: 899, salePrice: 799,
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    desc: 'Capture stunning 4K video and 24.2 MP high-resolution photos with ultra-fast autofocus.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Portable Bluetooth Boombox Speaker',
    cat: 'Electronics', sub: 'Audio', brand: 'SoundWave', price: 129, salePrice: 99,
    img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    desc: 'Heavy bass, IPX7 waterproof rating, and 20-hour playback for indoor and outdoor parties.',
    feat: false, best: true, newArr: true
  },
  {
    name: 'Ergonomic Wireless Gaming Mouse',
    cat: 'Electronics', sub: 'Gadgets', brand: 'VortexGaming', price: 79, salePrice: 59,
    img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    desc: 'Ultra-lightweight design with 26K DPI optical sensor and customizable RGB zones.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Curved 34-Inch UltraWide Monitor',
    cat: 'Electronics', sub: 'Laptops', brand: 'VisionPro', price: 549, salePrice: 479,
    img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    desc: '144Hz refresh rate, 1ms response time, and HDR400 for immersive gaming and productivity.',
    feat: true, best: false, newArr: false
  },
  {
    name: 'True Wireless Noise Isolating Earbuds',
    cat: 'Electronics', sub: 'Headphones', brand: 'AcousticAudio', price: 119, salePrice: 89,
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    desc: 'Compact wireless earbuds with deep bass, wireless charging case, and IPX5 resistance.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Ultra-Fast Magnetic Power Bank 10000mAh',
    cat: 'Electronics', sub: 'Gadgets', brand: 'VoltMax', price: 49, salePrice: 39,
    img: 'https://images.unsplash.com/photo-1609592424074-8b65287f4c0a?auto=format&fit=crop&w=800&q=80',
    desc: 'Snap-on magnetic wireless charging with fast Type-C PD power delivery.',
    feat: false, best: false, newArr: true
  },
  {
    name: '4K Foldable Drone with HD Camera',
    cat: 'Electronics', sub: 'Cameras', brand: 'SkyVista', price: 449, salePrice: 389,
    img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    desc: '3-axis gimbal stabilization, obstacle avoidance, and 30-minute flight time per battery.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Smart Home Voice Assistant Hub',
    cat: 'Electronics', sub: 'Gadgets', brand: 'HomeIntel', price: 99, salePrice: 79,
    img: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80',
    desc: 'Control lights, music, thermostat, and security with intelligent voice recognition.',
    feat: false, best: false, newArr: false
  },
  {
    name: 'Portable USB-C HD Monitor 15.6"',
    cat: 'Electronics', sub: 'Laptops', brand: 'VisionPro', price: 189, salePrice: 149,
    img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
    desc: 'Plug-and-play second screen for laptops, smartphones, and consoles on the go.',
    feat: false, best: false, newArr: true
  },

  // --- FASHION & APPAREL (12 products) ---
  {
    name: 'Vintage Leather Moto Jacket',
    cat: 'Fashion & Apparel', sub: 'Men Fashion', brand: 'UrbanCraft', price: 349, salePrice: 289,
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    desc: '100% genuine full-grain leather with quilted interior lining and classic asymmetrical zip.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Classic White Designer Sneakers',
    cat: 'Fashion & Apparel', sub: 'Footwear', brand: 'Stride', price: 129, salePrice: 99,
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    desc: 'Clean, modern silhouette built with calfskin leather and ergonomic memory foam insoles.',
    feat: false, best: true, newArr: true
  },
  {
    name: 'Premium Cotton Oversized Hoodie',
    cat: 'Fashion & Apparel', sub: 'Men Fashion', brand: 'StreetWear Co', price: 89, salePrice: 69,
    img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    desc: 'Heavyweight 450GSM organic cotton fleece hoodie for comfort and street-style aesthetic.',
    feat: false, best: true, newArr: true
  },
  {
    name: 'Slim Fit Dark Wash Denim Jeans',
    cat: 'Fashion & Apparel', sub: 'Men Fashion', brand: 'DenimCo', price: 79, salePrice: 59,
    img: 'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=800&q=80',
    desc: 'Durable stretch denim engineered for flexibility, comfort, and timeless everyday wear.',
    feat: false, best: false, newArr: false
  },
  {
    name: 'Elegant Floral Summer Wrap Dress',
    cat: 'Fashion & Apparel', sub: 'Women Wear', brand: 'BloomFashion', price: 109, salePrice: 85,
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    desc: 'Lightweight breathable chiffon wrap dress with adjustable waist ribbon.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Tailored Italian Wool Blazer',
    cat: 'Fashion & Apparel', sub: 'Men Fashion', brand: 'MilanoSuit', price: 289, salePrice: 229,
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    desc: 'Sharp, modern Italian wool jacket perfect for formal meetings and evening galas.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Retro Polarized Aviator Sunglasses',
    cat: 'Fashion & Apparel', sub: 'Accessories', brand: 'ShadePro', price: 69, salePrice: 49,
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    desc: 'UV400 protection with lightweight titanium metal frame and scratch-resistant lenses.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Water-Resistant Canvas Travel Backpack',
    cat: 'Fashion & Apparel', sub: 'Accessories', brand: 'NomadGear', price: 95, salePrice: 75,
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    desc: 'Dedicated 15.6" laptop compartment, anti-theft back pocket, and genuine leather trim.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Luxury Chronograph Stainless Steel Watch',
    cat: 'Fashion & Apparel', sub: 'Accessories', brand: 'ChronoTime', price: 219, salePrice: 179,
    img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    desc: 'Sapphire crystal glass, Japanese quartz movement, and 50m water resistance.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Women High-Waisted Athletic Leggings',
    cat: 'Fashion & Apparel', sub: 'Women Wear', brand: 'FitAura', price: 59, salePrice: 45,
    img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
    desc: 'Squat-proof seamless fabric with tummy control waistband and side phone pockets.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Handmade Leather Chelsea Boots',
    cat: 'Fashion & Apparel', sub: 'Footwear', brand: 'CraftLeather', price: 179, salePrice: 145,
    img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    desc: 'Sleek ankle boot with elastic side panels, Goodyear welted construction, and rubber sole.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Casual Linen Button-Down Shirt',
    cat: 'Fashion & Apparel', sub: 'Men Fashion', brand: 'BreezeFit', price: 65, salePrice: 49,
    img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    desc: '100% natural pure linen shirt designed for cool comfort in warm weather.',
    feat: false, best: false, newArr: true
  },

  // --- HOME & LIVING (12 products) ---
  {
    name: 'Minimalist Scandinavian Armchair',
    cat: 'Home & Living', sub: 'Furniture', brand: 'NordicHome', price: 499, salePrice: 399,
    img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    desc: 'Solid oak wood frame with stain-resistant woven linen upholstery.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Luxury Velvet Scented Candle Set',
    cat: 'Home & Living', sub: 'Decor', brand: 'Lumiere', price: 39, salePrice: 29,
    img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    desc: 'Hand-poured natural soy wax candles infused with French lavender and amber essential oils.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Solid Walnut Wood Coffee Table',
    cat: 'Home & Living', sub: 'Furniture', brand: 'CraftWood', price: 329, salePrice: 269,
    img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    desc: 'Mid-century modern coffee table crafted with sustainably sourced American walnut.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Adjustable LED Architect Desk Lamp',
    cat: 'Home & Living', sub: 'Lighting', brand: 'Lumina', price: 79, salePrice: 59,
    img: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80',
    desc: 'Touch-sensitive dimming with 5 color temperatures and USB charging port.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Handcrafted Ceramic Flower Vase Set',
    cat: 'Home & Living', sub: 'Decor', brand: 'ArtisanClay', price: 55, salePrice: 42,
    img: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    desc: 'Textured matte ceramic vases ideal for dried flowers, pampas grass, or fresh stems.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Ultra Soft Knit Throw Blanket',
    cat: 'Home & Living', sub: 'Decor', brand: 'CozyNook', price: 49, salePrice: 35,
    img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    desc: 'Chunky breathable knit throw for living room sofas and bedroom layering.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Non-Stick Ceramic Cookware Set 10-Piece',
    cat: 'Home & Living', sub: 'Kitchenware', brand: 'ChefMaster', price: 199, salePrice: 159,
    img: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    desc: 'PTFE/PFOA-free non-stick pots and pans suitable for induction and oven use.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Electric Standing Desk 55" x 28"',
    cat: 'Home & Living', sub: 'Furniture', brand: 'ErgoWork', price: 399, salePrice: 329,
    img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
    desc: 'Dual-motor smooth height adjustment with 4 memory presets and cable management.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Boho Geometry Area Rug 5x7 Ft',
    cat: 'Home & Living', sub: 'Decor', brand: 'HomeVibe', price: 149, salePrice: 119,
    img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    desc: 'Stain-resistant low-pile woven rug with non-slip backing.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'True HEPA Air Purifier for Large Rooms',
    cat: 'Home & Living', sub: 'Decor', brand: 'PureAir', price: 169, salePrice: 129,
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    desc: 'Captures 99.97% of dust, pollen, smoke, and pet dander with silent night mode.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Stainless Steel Espresso Coffee Maker',
    cat: 'Home & Living', sub: 'Kitchenware', brand: 'BaristaPro', price: 249, salePrice: 199,
    img: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?auto=format&fit=crop&w=800&q=80',
    desc: '15-bar Italian pump with milk frother wand for rich lattes and cappuccinos.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Modern Pendant Ceiling Light Fixture',
    cat: 'Home & Living', sub: 'Lighting', brand: 'Lumina', price: 89, salePrice: 69,
    img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    desc: 'Matte black metal mesh chandelier light for kitchen islands and dining rooms.',
    feat: false, best: false, newArr: true
  },

  // --- BEAUTY & WELLNESS (10 products) ---
  {
    name: 'Organic Hydrating Serum with Hyaluronic Acid',
    cat: 'Beauty & Wellness', sub: 'Skincare', brand: 'GlowBotanica', price: 45, salePrice: 35,
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    desc: 'Pure hyaluronic acid and vitamin B5 serum for deep, lasting hydration.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Gentle Foaming Facial Cleanser',
    cat: 'Beauty & Wellness', sub: 'Skincare', brand: 'PureSkin', price: 29, salePrice: 22,
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    desc: 'pH-balanced gentle cleanser infused with green tea extract and chamomile.',
    feat: false, best: true, newArr: true
  },
  {
    name: 'French Lavender Luxury Eau de Parfum 100ml',
    cat: 'Beauty & Wellness', sub: 'Perfumes', brand: 'MaisonParfum', price: 125, salePrice: 99,
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    desc: 'Long-lasting floral fragrance with notes of bergamot, lavender, and white musk.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Velvet Matte Long-Wear Lipstick',
    cat: 'Beauty & Wellness', sub: 'Makeup', brand: 'GlamourCosmetics', price: 25, salePrice: 19,
    img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    desc: 'Non-drying smudge-proof formula enriched with vitamin E and jojoba oil.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Nourishing Argan Oil Hair Treatment',
    cat: 'Beauty & Wellness', sub: 'Hair Care', brand: 'SilkHair', price: 34, salePrice: 26,
    img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    desc: 'Restores shine, tames frizz, and repairs heat-damaged split ends.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Rose Quartz Facial Roller & Gua Sha Set',
    cat: 'Beauty & Wellness', sub: 'Skincare', brand: 'GlowBotanica', price: 38, salePrice: 28,
    img: 'https://images.unsplash.com/photo-1608248597262-421c97a55c27?auto=format&fit=crop&w=800&q=80',
    desc: '100% natural rose quartz stone tools to promote lymphatic drainage and facial contouring.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Broad Spectrum SPF 50 Mineral Sunscreen',
    cat: 'Beauty & Wellness', sub: 'Skincare', brand: 'SunShield', price: 32, salePrice: 24,
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    desc: 'Non-greasy reef-safe zinc oxide sunscreen with invisible matte finish.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Vitamin C Brightening Eye Cream',
    cat: 'Beauty & Wellness', sub: 'Skincare', brand: 'PureSkin', price: 42, salePrice: 32,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    desc: 'Target dark circles, puffiness, and fine lines with concentrated vitamin C and caffeine.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Organic Coconut Body Polish Scrub',
    cat: 'Beauty & Wellness', sub: 'Skincare', brand: 'GlowBotanica', price: 28, salePrice: 21,
    img: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=800&q=80',
    desc: 'Exfoliating sea salt scrub with virgin coconut oil for smooth, silky skin.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Aromatherapy Essential Oil Diffuser',
    cat: 'Beauty & Wellness', sub: 'Skincare', brand: 'ZenSpace', price: 45, salePrice: 34,
    img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    desc: 'Ultrasonic cool mist diffuser with 7 ambient LED lights and automatic shut-off.',
    feat: true, best: false, newArr: false
  },

  // --- SPORTS & FITNESS (10 products) ---
  {
    name: 'Eco-Friendly Non-Slip Yoga Mat 6mm',
    cat: 'Sports & Outdoors', sub: 'Fitness', brand: 'ZenFlex', price: 49, salePrice: 38,
    img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    desc: 'Biodegradable TPE material with dual-sided non-slip texture and carrying strap.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Adjustable Dumbbell Set 5-52.5 lbs',
    cat: 'Sports & Outdoors', sub: 'Gym Gear', brand: 'IronCore', price: 349, salePrice: 289,
    img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    desc: 'Quick dial adjustment mechanism replaces 15 sets of weights in one compact design.',
    feat: true, best: true, newArr: true
  },
  {
    name: 'Insulated Stainless Steel Gym Bottle 32oz',
    cat: 'Sports & Outdoors', sub: 'Fitness', brand: 'HydroPeak', price: 35, salePrice: 26,
    img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    desc: 'Double-wall vacuum insulation keeps drinks ice cold for 24 hours.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Lightweight Trail Running Shoes',
    cat: 'Sports & Outdoors', sub: 'Footwear', brand: 'TrailPacer', price: 139, salePrice: 109,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    desc: 'Aggressive lugged outsole for traction on rocky trails with responsive cushioning.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Waterproof 4-Person Camping Tent',
    cat: 'Sports & Outdoors', sub: 'Outdoor Gear', brand: 'WildPeak', price: 179, salePrice: 145,
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    desc: 'Quick setup pop-up system with PU 3000mm rainfly and mesh ventilation windows.',
    feat: false, best: true, newArr: false
  },
  {
    name: '21-Speed All-Terrain Mountain Bike',
    cat: 'Sports & Outdoors', sub: 'Outdoor Gear', brand: 'ApexCycle', price: 499, salePrice: 429,
    img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    desc: 'Lightweight aluminum alloy frame, front suspension fork, and Shimano disc brakes.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Heavy Duty Resistance Loop Bands 5-Set',
    cat: 'Sports & Outdoors', sub: 'Gym Gear', brand: 'FitAura', price: 25, salePrice: 18,
    img: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
    desc: '100% natural latex bands in 5 color-coded resistance levels with carrying pouch.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Pro Speed Jump Rope with Ball Bearings',
    cat: 'Sports & Outdoors', sub: 'Fitness', brand: 'SpeedBurn', price: 22, salePrice: 16,
    img: 'https://images.unsplash.com/photo-1591940742878-13aba4b7a34e?auto=format&fit=crop&w=800&q=80',
    desc: '360-degree swivel bearing system for fast double-unders and cardio workouts.',
    feat: false, best: false, newArr: false
  },
  {
    name: 'Padded Weightlifting Gloves with Wrist Wrap',
    cat: 'Sports & Outdoors', sub: 'Gym Gear', brand: 'IronCore', price: 28, salePrice: 20,
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    desc: 'Silicone palm grip padding and integrated 18-inch wrist support wraps.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Smart Heart Rate Chest Strap Monitor',
    cat: 'Sports & Outdoors', sub: 'Fitness', brand: 'PulseFit', price: 69, salePrice: 52,
    img: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
    desc: 'ANT+ and Bluetooth dual-mode connection compatible with major fitness apps.',
    feat: false, best: true, newArr: false
  },

  // --- FOOTWEAR & KICKS (6 products) ---
  {
    name: 'Air Cushion Lightweight Running Sneakers',
    cat: 'Footwear & Kicks', sub: 'Sneakers', brand: 'StridePulse', price: 149, salePrice: 119,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    desc: 'Ultra-lightweight mesh upper with responsive nitrogen-infused cushioning.',
    feat: true, best: true, newArr: true
  },
  {
    name: 'Handcrafted Italian Leather Oxford Shoes',
    cat: 'Footwear & Kicks', sub: 'Formal Shoes', brand: 'MilanoFootwear', price: 229, salePrice: 189,
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    desc: 'Polished calfskin oxford shoes with Goodyear welt construction and leather sole.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Waterproof Leather Chelsea Ankle Boots',
    cat: 'Footwear & Kicks', sub: 'Boots', brand: 'UrbanCraft', price: 189, salePrice: 149,
    img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    desc: 'Rugged yet refined leather Chelsea boots engineered for all-weather urban durability.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Retro Canvas High-Top Skateboard Sneakers',
    cat: 'Footwear & Kicks', sub: 'Sneakers', brand: 'UrbanCraft', price: 89, salePrice: 69,
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    desc: 'Classic high-top canvas upper with reinforced vulcanized rubber sole.',
    feat: false, best: true, newArr: true
  },
  {
    name: 'Performance Carbon Plate Marathon Running Shoes',
    cat: 'Footwear & Kicks', sub: 'Running Shoes', brand: 'StridePulse', price: 249, salePrice: 199,
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    desc: 'Full-length carbon fiber propulsion plate with max cushioning foam for competitive racers.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Ergonomic Memory Foam Sport Slides',
    cat: 'Footwear & Kicks', sub: 'Sneakers', brand: 'ComfortStep', price: 45, salePrice: 32,
    img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
    desc: 'Water-resistant contoured footbed for post-workout recovery and lounge comfort.',
    feat: false, best: false, newArr: true
  },

  // --- WATCHES & ACCESSORIES (6 products) ---
  {
    name: 'Automatic Mechanical Skeleton Watch',
    cat: 'Watches & Accessories', sub: 'Chronographs', brand: 'ChronoTime', price: 399, salePrice: 329,
    img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    desc: 'Exposed self-winding mechanical movement encased in scratch-resistant sapphire crystal.',
    feat: true, best: true, newArr: false
  },
  {
    name: 'Polarized Titanium Frame Sunglasses',
    cat: 'Watches & Accessories', sub: 'Eyewear', brand: 'ShadePro', price: 119, salePrice: 89,
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    desc: 'Ultra-lightweight titanium frame with 100% UV400 anti-glare polarized lenses.',
    feat: false, best: true, newArr: true
  },
  {
    name: 'Full-Grain Italian Leather Bifold Wallet',
    cat: 'Watches & Accessories', sub: 'Leather Goods', brand: 'CraftLeather', price: 65, salePrice: 48,
    img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    desc: 'Slim RFID-blocking leather wallet with 8 card slots and dual cash compartment.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Luxury Minimalist Rose Gold Quartz Watch',
    cat: 'Watches & Accessories', sub: 'Chronographs', brand: 'ChronoTime', price: 179, salePrice: 139,
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    desc: 'Ultra-thin 7mm case with mesh stainless steel strap and Japanese quartz precision.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'AMOLED Smart Fitness Tracker Band 7',
    cat: 'Watches & Accessories', sub: 'Smartbands', brand: 'TechPulse', price: 89, salePrice: 69,
    img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    desc: 'Continuous SpO2 oxygen monitoring, 120 workout modes, and 14-day battery life.',
    feat: false, best: true, newArr: true
  },
  {
    name: 'Reversible Italian Calfskin Dress Belt',
    cat: 'Watches & Accessories', sub: 'Leather Goods', brand: 'MilanoStyle', price: 59, salePrice: 42,
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    desc: 'Dual-sided black and brown leather with twistable stainless steel pin buckle.',
    feat: false, best: false, newArr: false
  },

  // --- GOURMET & COFFEE (6 products) ---
  {
    name: 'Single Origin Organic Arabica Coffee Beans 1kg',
    cat: 'Gourmet & Coffee', sub: 'Coffee Beans', brand: 'ArtisanRoast', price: 34, salePrice: 26,
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    desc: 'Freshly micro-roasted Ethiopian Yirgacheffe beans with notes of jasmine, citrus, and honey.',
    feat: true, best: true, newArr: true
  },
  {
    name: 'Japanese Organic Ceremonial Grade Matcha Powder',
    cat: 'Gourmet & Coffee', sub: 'Exotic Teas', brand: 'KyotoMatcha', price: 42, salePrice: 32,
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    desc: 'First-harvest shade-grown green tea leaves stone-ground into vibrant emerald powder.',
    feat: false, best: true, newArr: false
  },
  {
    name: '85% Single-Origin Swiss Dark Chocolate Bar 100g',
    cat: 'Gourmet & Coffee', sub: 'Artisan Chocolate', brand: 'ChocolatierSwiss', price: 18, salePrice: 14,
    img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    desc: 'Rich, smooth artisanal dark chocolate crafted with Ecuadorian cocoa beans.',
    feat: true, best: false, newArr: true
  },
  {
    name: 'Loose Leaf English Breakfast Tea Sampler Box',
    cat: 'Gourmet & Coffee', sub: 'Exotic Teas', brand: 'RoyalTea', price: 28, salePrice: 22,
    img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    desc: 'Selection of 6 premium black, green, and herbal teas in airtight reusable tins.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Organic Raw Wildflower Honey 500g Jar',
    cat: 'Gourmet & Coffee', sub: 'Organic Snacks', brand: 'BeePure', price: 24, salePrice: 19,
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    desc: 'Unfiltered 100% pure raw honey harvested from pristine alpine meadows.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Espresso Roast Dark Coffee Capsules 50-Pack',
    cat: 'Gourmet & Coffee', sub: 'Coffee Beans', brand: 'BaristaCaps', price: 39, salePrice: 29,
    img: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?auto=format&fit=crop&w=800&q=80',
    desc: 'Aluminum pods compatible with Nespresso Original machines for dense crema espresso.',
    feat: true, best: true, newArr: false
  },

  // --- AUTOMOTIVE & TOOLS (6 products) ---
  {
    name: 'Ultra HD 4K Dual Dash Cam System',
    cat: 'Automotive & Tools', sub: 'Dash Cams', brand: 'DriveGuard', price: 159, salePrice: 129,
    img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    desc: 'Front and rear 4K night vision cameras with G-sensor loop recording and Wi-Fi app.',
    feat: true, best: false, newArr: true
  },
  {
    name: '20V Max Brushless Cordless Drill Kit',
    cat: 'Automotive & Tools', sub: 'Power Tools', brand: 'VoltTool', price: 139, salePrice: 109,
    img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    desc: 'High-torque brushless motor with 2 lithium-ion batteries and 30-piece accessory set.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Professional Automotive Microfiber Car Detailing Kit',
    cat: 'Automotive & Tools', sub: 'Car Accessories', brand: 'AutoGloss', price: 49, salePrice: 38,
    img: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    desc: 'Includes foam cannon, plush microfiber towels, wheel brush, and ceramic wash coat.',
    feat: true, best: true, newArr: true
  },
  {
    name: 'Digital Tire Inflator Portable Air Compressor',
    cat: 'Automotive & Tools', sub: 'Garage Care', brand: 'VoltTool', price: 59, salePrice: 45,
    img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    desc: '150 PSI cordless electric pump with auto-shutoff presets and emergency LED light.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Heavy Duty 108-Piece Socket & Ratchet Wrench Set',
    cat: 'Automotive & Tools', sub: 'Power Tools', brand: 'MechanicPro', price: 99, salePrice: 79,
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    desc: 'Chrome vanadium steel sockets with quick-release 72-tooth ratchet handle in sturdy case.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Universal Car Phone Mount Wireless Charger 15W',
    cat: 'Automotive & Tools', sub: 'Car Accessories', brand: 'DriveGuard', price: 39, salePrice: 29,
    img: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    desc: 'Auto-clamping air vent phone holder with fast wireless charging and touch release.',
    feat: false, best: false, newArr: false
  },

  // --- BOOKS & STATIONERY (6 products) ---
  {
    name: 'Handcrafted Genuine Leather Journal & Brass Pen',
    cat: 'Books & Stationery', sub: 'Notebooks', brand: 'ArtisanPaper', price: 45, salePrice: 35,
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    desc: 'Refillable 240-page deckle edge cotton paper wrapped in rustic full-grain leather.',
    feat: true, best: true, newArr: true
  },
  {
    name: 'Classic Fine Nib Executive Fountain Pen',
    cat: 'Books & Stationery', sub: 'Pens & Ink', brand: 'MontInk', price: 79, salePrice: 59,
    img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    desc: 'Precision stainless steel nib with gold plating, ink converter, and velvet presentation case.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'Hardcover Bestselling Productivity Planner 2026',
    cat: 'Books & Stationery', sub: 'Notebooks', brand: 'FocusPaper', price: 32, salePrice: 24,
    img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    desc: 'Undated daily goal setter, weekly layout, habit tracker, and ribbon bookmarks.',
    feat: true, best: true, newArr: true
  },
  {
    name: 'Minimalist Walnut Wood Desk Organizer Tray',
    cat: 'Books & Stationery', sub: 'Desk Decor', brand: 'NordicDesk', price: 49, salePrice: 38,
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    desc: 'Carved natural solid walnut wood tray for pens, paperclips, phone, and sticky notes.',
    feat: false, best: false, newArr: true
  },
  {
    name: 'Professional Artist 72-Color Watercolor Pencil Set',
    cat: 'Books & Stationery', sub: 'Pens & Ink', brand: 'ColorCraft', price: 55, salePrice: 42,
    img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    desc: 'Soft-core water-soluble pigments in protective metal tin for sketching and watercolor art.',
    feat: false, best: true, newArr: false
  },
  {
    name: 'The Modern Design Mindset Collector Edition Hardcover',
    cat: 'Books & Stationery', sub: 'Bestsellers', brand: 'DesignPress', price: 65, salePrice: 49,
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    desc: 'Inspiring coffee table book exploring world-changing architecture, typography, and UI design.',
    feat: true, best: false, newArr: true
  }
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clear existing collections
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Color.deleteMany({});
    await Size.deleteMany({});
    await Product.deleteMany({});
    await Blog.deleteMany({});
    await HeroSlide.deleteMany({});
    await CampaignBanner.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Colors
    const colorsData = [
      { name: 'Black', value: '#000000', description: 'Classic Black' },
      { name: 'White', value: '#FFFFFF', description: 'Pure White' },
      { name: 'Navy Blue', value: '#000080', description: 'Deep Navy' },
      { name: 'Ruby Red', value: '#9B111E', description: 'Vibrant Red' },
      { name: 'Emerald Green', value: '#50C878', description: 'Lush Green' }
    ];
    const createdColors = await Color.insertMany(colorsData);
    console.log(`Created ${createdColors.length} colors.`);

    // 2. Create Sizes
    const sizesData = [
      { name: 'Small', value: 'S', description: 'Chest 34-36"' },
      { name: 'Medium', value: 'M', description: 'Chest 38-40"' },
      { name: 'Large', value: 'L', description: 'Chest 42-44"' },
      { name: 'X-Large', value: 'XL', description: 'Chest 46-48"' }
    ];
    const createdSizes = await Size.insertMany(sizesData);
    console.log(`Created ${createdSizes.length} sizes.`);

    // 3. Create Categories & Subcategories
    const categoriesSeed = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets, smart devices, audio equipment and accessories.',
        image: { public_id: 'cat_electronics', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Headphones', 'Smartwatches', 'Laptops', 'Cameras', 'Audio', 'Gadgets']
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        description: 'Trendy clothing, shoes, premium jackets, and designer wear.',
        image: { public_id: 'cat_fashion', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Men Fashion', 'Women Wear', 'Footwear', 'Accessories']
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Modern furniture, decor, lighting, and kitchen appliances.',
        image: { public_id: 'cat_home', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Furniture', 'Decor', 'Kitchenware', 'Lighting']
      },
      {
        name: 'Beauty & Wellness',
        slug: 'beauty-wellness',
        description: 'Skincare products, perfumes, hair care, and wellness essentials.',
        image: { public_id: 'cat_beauty', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Skincare', 'Perfumes', 'Makeup', 'Hair Care']
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Fitness gear, outdoor equipment, athletic shoes, and gym accessories.',
        image: { public_id: 'cat_sports', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Fitness', 'Gym Gear', 'Footwear', 'Outdoor Gear']
      },
      {
        name: 'Footwear & Kicks',
        slug: 'footwear-kicks',
        description: 'Designer sneakers, athletic running shoes, leather boots, and classic slides.',
        image: { public_id: 'cat_shoes', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Sneakers', 'Boots', 'Running Shoes', 'Formal Shoes']
      },
      {
        name: 'Watches & Accessories',
        slug: 'watches-accessories',
        description: 'Luxury chronographs, smart fitness trackers, polarized eyewear, and leather belts.',
        image: { public_id: 'cat_watches', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Chronographs', 'Smartbands', 'Eyewear', 'Leather Goods']
      },
      {
        name: 'Gourmet & Coffee',
        slug: 'gourmet-coffee',
        description: 'Artisanal coffee beans, organic matcha, craft teas, and luxury dark chocolate.',
        image: { public_id: 'cat_gourmet', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Coffee Beans', 'Exotic Teas', 'Artisan Chocolate', 'Organic Snacks']
      },
      {
        name: 'Automotive & Tools',
        slug: 'automotive-tools',
        description: 'Car care detailing kits, 4K dash cameras, cordless power tools, and garage gear.',
        image: { public_id: 'cat_auto', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Car Accessories', 'Power Tools', 'Dash Cams', 'Garage Care']
      },
      {
        name: 'Books & Stationery',
        slug: 'books-stationery',
        description: 'Hardcover bestsellers, leather notebooks, fountain pens, and desk organizers.',
        image: { public_id: 'cat_books', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
        subcategories: ['Bestsellers', 'Notebooks', 'Pens & Ink', 'Desk Decor']
      }
    ];

    const categoryDocsMap = {};
    const subcategoryMap = {};

    for (const cat of categoriesSeed) {
      const createdCat = await Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        subcategories: []
      });
      categoryDocsMap[cat.name] = createdCat;

      const subcatIds = [];
      for (const subName of cat.subcategories) {
        const subSlug = (cat.name + '-' + subName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const createdSub = await Subcategory.create({
          name: subName,
          slug: subSlug,
          description: `Best of ${subName}`,
          category: createdCat._id
        });
        subcatIds.push(createdSub._id);
        subcategoryMap[`${cat.name}_${subName}`] = createdSub._id;
      }

      createdCat.subcategories = subcatIds;
      await createdCat.save();
    }
    console.log(`Created ${Object.keys(categoryDocsMap).length} categories.`);

    // 4. Create 50+ Products
    const createdProducts = [];
    let count = 0;

    for (const p of rawProducts) {
      count++;
      const catObj = categoryDocsMap[p.cat];
      const subId = subcategoryMap[`${p.cat}_${p.sub}`];

      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + (1000 + count);
      const discountPercent = Math.round(((p.price - p.salePrice) / p.price) * 100);

      const prod = await Product.create({
        name: p.name,
        description: p.desc,
        shortDescription: p.desc,
        keyFeatures: ['Premium Build Quality', 'Manufacturer Warranty', 'Authentic Product', 'Fast Express Shipping'],
        price: p.price,
        salePrice: p.salePrice,
        discount: discountPercent > 0 ? discountPercent : 0,
        buyPrice: Math.round(p.salePrice * 0.6),
        costPerProduct: Math.round(p.salePrice * 0.6),
        sku: `SKU-${100000 + count}`,
        stock: Math.floor(Math.random() * 80) + 15,
        category: catObj ? catObj._id : null,
        subcategory: subId || null,
        brand: p.brand,
        weight: '0.8 kg',
        dimensions: { width: '15cm', height: '10cm', depth: '5cm' },
        warranty: '1 Year Brand Warranty',
        returnPolicy: '7 Days Return Policy',
        videoUrl: '',
        tags: [p.cat, p.sub, p.brand, 'trending', 'popular'],
        images: [{ public_id: `img_${count}`, url: p.img }],
        additionalImages: [{ public_id: `img_add_${count}`, url: p.img }],
        specifications: [
          { name: 'Brand', value: p.brand },
          { name: 'Condition', value: 'Brand New' }
        ],
        colors: createdColors.slice(0, 3).map(c => ({ _id: c._id.toString(), name: c.name, value: c.value, description: c.description })),
        sizes: createdSizes.map(s => ({ _id: s._id.toString(), name: s.name, value: s.value, description: s.description })),
        rating: +(4 + Math.random() * 0.9).toFixed(1),
        reviewsCount: Math.floor(Math.random() * 90) + 10,
        soldCount: Math.floor(Math.random() * 200) + 20,
        clickCount: Math.floor(Math.random() * 500) + 100,
        revenueGenerated: Math.floor(Math.random() * 5000) + 500,
        wishlistCount: Math.floor(Math.random() * 50) + 5,
        featured: p.feat,
        isBestSeller: p.best,
        isNewArrival: p.newArr,
        slug: slug,
        currency: 'USD',
        status: 'published'
      });
      createdProducts.push(prod);
    }

    console.log(`Created ${createdProducts.length} published products!`);

    // 5. Create Hero Slides
    const heroSlidesData = [
      {
        title: 'Summer Fashion Sale 2026',
        subtitle: 'Up to 50% Off on New Arrivals',
        description: 'Explore premium leather jacket collections, designer footwear, and modern summer streetwear.',
        image: { public_id: 'hero_1', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80' },
        url: `/products`,
        linkType: 'category',
        linkedId: categoryDocsMap['Fashion & Apparel']._id.toString()
      },
      {
        title: 'Next-Gen Audio Experience',
        subtitle: 'Immerse Yourself in Pure Sound',
        description: 'Discover studio-quality active noise-canceling headphones with 30-hour battery life.',
        image: { public_id: 'hero_2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80' },
        url: `/products/${createdProducts[0]._id}`,
        linkType: 'product',
        linkedId: createdProducts[0]._id.toString()
      }
    ];
    await HeroSlide.insertMany(heroSlidesData);
    console.log(`Created ${heroSlidesData.length} Hero Slides.`);

    // 6. Create Campaign Banner
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    await CampaignBanner.create({
      title: 'Mega Flash Sale Event',
      description: 'Exclusive discounts on smartwatches, audio gear, and athletic footwear before stock runs out!',
      image: { public_id: 'banner_1', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80' },
      targetDate: targetDate,
      linkedProductId: createdProducts[1]._id.toString(),
      isActive: true
    });
    console.log('Created active Campaign Banner.');

    // 7. Create Blogs
    const blogsData = [
      {
        title: 'Top 10 Essential Tech Gadgets for Modern Workspaces in 2026',
        content: `<p>Upgrading your workspace with ergonomic gadgets can dramatically improve productivity and comfort. From noise-canceling headphones to mechanical keyboards, here are our top recommendations.</p><h3>1. Active Noise Canceling Headphones</h3><p>Blocking out ambient noise allows deep focus during coding or designing sessions.</p><h3>2. Ergonomic Mechanical Keyboards</h3><p>Custom tactile switches reduce wrist strain and provide satisfying feedback.</p>`,
        imageUrl: { public_id: 'blog_1', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80' },
        slug: 'top-10-essential-tech-gadgets-2026',
        status: 'published'
      },
      {
        title: 'The Ultimate Guide to Skincare: Hyaluronic Acid Explained',
        content: `<p>Hyaluronic acid is a miracle ingredient capable of holding up to 1000 times its weight in water. Learn how to incorporate serums into your daily routine for radiant, hydrated skin.</p>`,
        imageUrl: { public_id: 'blog_2', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
        slug: 'ultimate-guide-to-skincare-hyaluronic-acid',
        status: 'published'
      },
      {
        title: 'Designing a Cozy Scandinavian Home: Tips & Trends',
        content: `<p>Scandinavian interior design focuses on minimalism, clean lines, and natural wood elements. Discover how simple oak furniture and warm lighting can transform your living space.</p>`,
        imageUrl: { public_id: 'blog_3', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80' },
        slug: 'designing-a-cozy-scandinavian-home',
        status: 'published'
      }
    ];
    await Blog.insertMany(blogsData);
    console.log(`Created ${blogsData.length} Blog posts.`);

    console.log(`
==================================================
🎉 SUCCESS: 54 PRODUCTS & DUMMY DATA SEEDED!
Categories: ${Object.keys(categoryDocsMap).length}
Products Created: ${createdProducts.length}
Hero Slides: ${heroSlidesData.length}
Blogs: ${blogsData.length}
==================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding dummy data:', error);
    process.exit(1);
  }
}

seedData();
