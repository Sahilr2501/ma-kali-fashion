import mongoose from "mongoose";
import { Category } from "../models/Category";
import { Product } from "../models/Product";

const uri = process.env.MONGODB_URI ?? "";
if (!uri) {
  console.error("MONGODB_URI is missing. Copy .env.example to .env.local first.");
  process.exit(1);
}

const categories = [
  {
    name: "Women's Clothing",
    slug: "womens-clothing",
    description: "Fancy tops, kurtis, dress materials, and ready-made dresses.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Gold-coloured coated earrings in different designs.",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Gold-coloured coated necklaces and necklace sets.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Other Accessories",
    slug: "other-accessories",
    description: "Optional additional accessories added by the store.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
  },
];

async function run() {
  await mongoose.connect(uri);
  await Category.deleteMany({});
  await Product.deleteMany({});
  const created = await Category.insertMany(categories);
  const bySlug = Object.fromEntries(created.map((row) => [row.slug, row._id]));

  await Product.insertMany([
    {
      name: "Ivory Cotton Kurta Set",
      slug: "ivory-cotton-kurta-set",
      description:
        "A breathable cotton kurta with matching bottoms for everyday ethnic wear. Soft drape, relaxed fit, and easy care.",
      categoryId: bySlug["womens-clothing"],
      price: 1899,
      originalPrice: 2299,
      stock: 12,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Ivory", "Maroon"],
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Maroon Printed Kurti",
      slug: "maroon-printed-kurti",
      description: "A printed kurti with a straight cut and three-quarter sleeves, suited to workdays and family gatherings.",
      categoryId: bySlug["womens-clothing"],
      price: 1299,
      stock: 8,
      sizes: ["S", "M", "L"],
      colors: ["Maroon"],
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Ready Dress with Dupatta",
      slug: "ready-dress-with-dupatta",
      description: "A ready-made dress with a light dupatta. Comfortable cotton-feel fabric for festive evenings.",
      categoryId: bySlug["womens-clothing"],
      price: 2499,
      originalPrice: 2899,
      stock: 6,
      sizes: ["M", "L", "XL"],
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Temple Drop Earrings",
      slug: "temple-drop-earrings",
      description:
        "Gold-coloured coated drop earrings with a temple-inspired silhouette. Lightweight for all-day wear. Not solid gold.",
      categoryId: bySlug["earrings"],
      price: 699,
      originalPrice: 849,
      stock: 20,
      images: [
        "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Floral Stud Earrings",
      slug: "floral-stud-earrings",
      description: "Gold-coloured coated floral studs with a compact profile for daily outfits. Not solid gold.",
      categoryId: bySlug["earrings"],
      price: 449,
      stock: 18,
      images: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Chandbali Earrings",
      slug: "chandbali-earrings",
      description: "Gold-coloured coated chandbali earrings for festive dressing. Please store in a dry pouch after use. Not solid gold.",
      categoryId: bySlug["earrings"],
      price: 899,
      stock: 10,
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Layered Necklace Set",
      slug: "layered-necklace-set",
      description:
        "A gold-coloured coated necklace set with matching earrings. Designed as costume jewellery, not solid gold.",
      categoryId: bySlug["necklaces"],
      price: 1599,
      originalPrice: 1899,
      stock: 7,
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Short Collar Necklace",
      slug: "short-collar-necklace",
      description: "A close-fit gold-coloured coated collar necklace that sits neatly with round and V-neck kurtis. Not solid gold.",
      categoryId: bySlug["necklaces"],
      price: 1199,
      stock: 9,
      images: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Long Pendant Haar",
      slug: "long-pendant-haar",
      description: "A longer gold-coloured coated haar with a central pendant, suited to plain ethnic outfits. Not solid gold.",
      categoryId: bySlug["necklaces"],
      price: 1799,
      stock: 5,
      images: [
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
    {
      name: "Beaded Bracelet",
      slug: "beaded-bracelet",
      description: "An accessory bracelet that can be paired with the earring and necklace collections.",
      categoryId: bySlug["other-accessories"],
      price: 499,
      stock: 15,
      images: [
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
      ],
      isActive: true,
    },
  ]);

  console.log("Seeded categories and products.");
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
