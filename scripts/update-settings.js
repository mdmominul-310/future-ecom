const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mdmominulislam310_db_user:AyAkXX6zXNysxqYy@cluster0.n9zqo1n.mongodb.net/ecom?retryWrites=true&w=majority';

const SiteSettingsSchema = new mongoose.Schema({
  siteTitle: String,
  siteDescription: String,
  metaTitle: String,
  metaDescription: String,
  keywords: String,
  favicon: String,
  logo: String,
  lightLogo: String,
  supportPhone: String,
  supportEmail: String,
  whatsappNumber: String,
  address: String,
  workingHours: String,
  facebook: String,
  twitter: String,
  instagram: String,
  youtube: String,
  linkedin: String,
  pinterest: String,
  footerDescription: String,
  copyrightText: String,
  announcementBarText: String,
  showAnnouncementBar: Boolean,
  freeShippingThreshold: Number,
}, { timestamps: true });

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function updateSettings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const newSettings = {
      siteTitle: "Future com",
      siteDescription: "Your premier modern general store delivering everyday lifestyle essentials, electronics, fashion, home goods, and quality products at the best prices.",
      metaTitle: "Future com | Premier Online General Store",
      metaDescription: "Shop top-tier electronics, modern lifestyle, daily essentials, and fashion at Future com - quality guaranteed with fast delivery nationwide.",
      keywords: "Future com, online general store, shopping bangladesh, electronics, fashion, home essentials, daily goods, futgensoft",
      favicon: "/favicon.ico",
      logo: "/logo.png",
      lightLogo: "",
      supportPhone: "+880 1974-003819",
      supportEmail: "support@futgensoft.com",
      whatsappNumber: "01974003819",
      address: "Dhaka, Bangladesh",
      workingHours: "24/7 Helpline & Customer Support",
      facebook: "https://facebook.com/futgensoft",
      twitter: "https://twitter.com/futgensoft",
      instagram: "https://instagram.com/futgensoft",
      youtube: "https://youtube.com/@futgensoft",
      linkedin: "https://linkedin.com/company/futgensoft",
      pinterest: "https://pinterest.com",
      footerDescription: "Future com is a next-generation general store offering a curated selection of electronics, daily essentials, apparel, and lifestyle products. We ensure authentic products, competitive pricing, and fast delivery.",
      copyrightText: "Future com. All Rights Reserved.",
      announcementBarText: "Free Express Shipping on orders over ৳2,000! | Welcome to Future com",
      showAnnouncementBar: true,
      freeShippingThreshold: 2000,
    };

    let doc = await SiteSettings.findOne();
    if (doc) {
      Object.assign(doc, newSettings);
      await doc.save();
      console.log('SiteSettings updated in DB successfully.');
    } else {
      await SiteSettings.create(newSettings);
      console.log('SiteSettings created in DB successfully.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating site settings:', error);
    process.exit(1);
  }
}

updateSettings();
