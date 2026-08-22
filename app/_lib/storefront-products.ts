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
  { id: 1, name: "Just a Girl Faith Shirt", category: "Shirts", collection: "Shirts", price: 10000, message: "JUST A GIRL WHO DECIDED TO LIVE BY FAITH", scripture: "2 Corinthians 5:7", tone: "ink", image: "/products/just-a-girl-faith-shirt.svg", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 2, name: "Not Forsaken Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "NOT FORSAKEN", scripture: "Deuteronomy 31:8", tone: "chalk", image: "/products/not-forsaken-sweatshirt.svg", badge: "top", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 3, name: "God’s Masterpiece Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "GOD’S MASTERPIECE", scripture: "Ephesians 2:10", tone: "paper", image: "/products/gods-masterpiece-sweatshirt.svg", badge: "new", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 4, name: "Be the Light Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE THE LIGHT", scripture: "Matthew 5:14", tone: "mist", image: "/products/be-the-light-sweatshirt.svg", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 5, name: "Walk by Faith Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "WALK BY FAITH", scripture: "2 Corinthians 5:7", tone: "clay", image: "/products/walk-by-faith-sweatshirt.svg", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 6, name: "Be Salty Stay Lit Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE SALTY STAY LIT", scripture: "Matthew 5:13–14", tone: "stone", image: "/products/be-salty-stay-lit-sweatshirt.svg", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 7, name: "Let God Carry It Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "LET GOD CARRY IT", scripture: "Psalm 55:22", tone: "linen", image: "/products/let-god-carry-it-sweatshirt.svg", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 8, name: "Faith Everyday Cap", category: "Caps", collection: "Caps", price: 9000, message: "FAITH", scripture: "Hebrews 11:1", tone: "linen", image: "/products/faith-everyday-cap.svg", sizes: ["Adjustable"], colors: ["Black", "Army Green"] },
  { id: 9, name: "Grace for Today Mug", category: "Mugs", collection: "Mugs", price: 10000, message: "GRACE FOR TODAY", scripture: "Lamentations 3:23", tone: "stone", image: "/products/grace-for-today-mug.svg", sizes: ["12 oz"], colors: ["White", "Cream"] },
  { id: 10, name: "Let God Lead Tote", category: "Tote Bags", collection: "Tote Bags", price: 12000, message: "LET GOD LEAD", scripture: "Proverbs 3:6", tone: "gift", image: "/products/let-god-lead-tote.svg", sizes: ["One size"], colors: ["Black", "Natural"] },
  { id: 11, name: "Write the Vision Journal", category: "Journals", collection: "Journals", price: 12000, message: "WRITE THE VISION", scripture: "Habakkuk 2:2", tone: "clay", image: "/products/write-the-vision-journal.svg", sizes: ["A5"], colors: ["Maroon", "Cream"] },
];

export const currency = "NGN";

export const deliveryFee = (subtotal: number) => subtotal >= 75000 ? 0 : 8000;

export const money = (value: number) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);
