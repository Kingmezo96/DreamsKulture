export type Product = {
  id: number;
  name: string;
  category: string;
  collection: string;
  price: number;
  oldPrice?: number;
  message: string;
  scripture: string;
  tone: string;
  image: string;
  badge?: string;
  sizes: string[];
  colors: string[];
};

export const products: Product[] = [
  { id: 1, name: "Walk by Faith Shirt", category: "Shirts", collection: "Faith Tees", price: 20000, message: "WALK BY FAITH", scripture: "2 Corinthians 5:7", tone: "chalk", image: "/campaign/faith-tees-rack.png", badge: "new", sizes: ["S", "M", "L", "XL"], colors: ["White", "Black", "Red", "Blue", "Yellow"] },
  { id: 2, name: "Pray Boldly Tee", category: "T-Shirts", collection: "Women", price: 25000, message: "PRAY BOLDLY", scripture: "1 Thessalonians 5:17", tone: "ink", image: "/campaign/women-pray-boldly.png", badge: "top", sizes: ["S", "M", "L", "XL"], colors: ["White", "Black", "Red", "Blue", "Yellow"] },
  { id: 3, name: "The Way Sweatshirts", category: "Hoodies", collection: "Men", price: 20000, message: "THE WAY", scripture: "John 14:6", tone: "clay", image: "/campaign/men-the-way.png", badge: "new", sizes: ["S", "M", "L", "XL"], colors: ["Maroon", "Black", "Ash"] },
  { id: 4, name: "Cord of Three Tee", category: "T-Shirts", collection: "Couples Collection", price: 18000, message: "CORD OF THREE", scripture: "Ecclesiastes 4:12", tone: "paper", image: "/campaign/couple-connection.png", sizes: ["S", "M", "L", "XL"], colors: ["Cream", "Cocoa"] },
  { id: 5, name: "Better Together Tee", category: "T-Shirts", collection: "Couples Collection", price: 18000, message: "BETTER TOGETHER", scripture: "Ecclesiastes 4:12", tone: "mist", image: "/campaign/couple-connection.png", sizes: ["S", "M", "L", "XL"], colors: ["Cocoa", "Cream"] },
  { id: 6, name: "Grace for Today Mug", category: "Mugs", collection: "Gifts & Home", price: 10000, message: "GRACE FOR TODAY", scripture: "Lamentations 3:23", tone: "stone", image: "/campaign/faith-accessories.png", sizes: ["12 oz"], colors: ["Cream", "White"] },
  { id: 7, name: "Let God Lead Tote", category: "Tote Bags", collection: "Gifts & Home", price: 12000, message: "LET GOD LEAD", scripture: "Proverbs 3:6", tone: "gift", image: "/campaign/faith-accessories.png", badge: "top", sizes: ["One size"], colors: ["Black", "Natural"] },
  { id: 8, name: "Faith Everyday Cap", category: "Caps", collection: "Gifts & Home", price: 6000, message: "FAITH", scripture: "Hebrews 11:1", tone: "linen", image: "/campaign/faith-accessories.png", sizes: ["Adjustable"], colors: ["Army Green", "Black"] },
  { id: 9, name: "Throw pillow, Mug, Notepad", category: "Gift Sets", collection: "Gifts & Home", price: 15000, message: "COFFEE & GRACE", scripture: "Psalm 90:14", tone: "stone", image: "/campaign/faith-accessories.png", badge: "sale", sizes: ["Gift set"], colors: ["Ivory & Sage"] },
  { id: 10, name: "Throw Pillow", category: "Home", collection: "Gifts & Home", price: 25000, message: "PEACE, BE STILL", scripture: "Mark 4:39", tone: "paper", image: "/campaign/faith-at-home.png", sizes: ["18 × 18 in"], colors: ["Cream", "Sage"] },
  { id: 11, name: "Notepad(A5)", category: "Journals", collection: "Gifts & Home", price: 12000, message: "WRITE THE VISION", scripture: "Habakkuk 2:2", tone: "clay", image: "/campaign/faith-at-home.png", sizes: ["A5"], colors: ["Maroon", "Cream"] },
  { id: 12, name: "Picture Frame", category: "Frames", collection: "Gifts & Home", price: 30000, message: "GRACE LIVES HERE", scripture: "Joshua 24:15", tone: "paper", image: "/campaign/faith-at-home.png", sizes: ["8×10 in", "11×14 in", "16×20 in"], colors: ["Ivory", "Black"] },
];

export const currency = "NGN";

export const deliveryFee = (subtotal: number) => subtotal >= 75000 ? 0 : 8000;

export const money = (value: number) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);
