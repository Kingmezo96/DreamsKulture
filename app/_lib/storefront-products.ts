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
  { id: 1, name: "Just a Girl Faith Shirt", category: "Shirts", collection: "Shirts", price: 10000, message: "JUST A GIRL WHO DECIDED TO LIVE BY FAITH", scripture: "2 Corinthians 5:7", tone: "ink", image: "/campaign/women-pray-boldly.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 2, name: "Not Forsaken Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "NOT FORSAKEN", scripture: "Deuteronomy 31:8", tone: "chalk", image: "/campaign/men-the-way.png", badge: "top", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 3, name: "God’s Masterpiece Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "GOD’S MASTERPIECE", scripture: "Ephesians 2:10", tone: "paper", image: "/dream-kulture-shopping.jpg", badge: "new", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 4, name: "Be the Light Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE THE LIGHT", scripture: "Matthew 5:14", tone: "mist", image: "/dream-kulture-brand-wall.jpg", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 5, name: "Walk by Faith Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "WALK BY FAITH", scripture: "2 Corinthians 5:7", tone: "clay", image: "/campaign/faith-tees-rack.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 6, name: "Be Salty Stay Lit Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE SALTY STAY LIT", scripture: "Matthew 5:13–14", tone: "stone", image: "/campaign/men-the-way.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 7, name: "Let God Carry It Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "LET GOD CARRY IT", scripture: "Psalm 55:22", tone: "linen", image: "/campaign/couple-connection.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 8, name: "Cord of Three Couples Tee", category: "Couples", collection: "Couples", price: 10000, message: "CORD OF THREE", scripture: "Ecclesiastes 4:12", tone: "paper", image: "/campaign/couple-connection.png", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 9, name: "Grace for Today Mug", category: "Gift & Homes", collection: "Gift & Homes", price: 10000, message: "GRACE FOR TODAY", scripture: "Lamentations 3:23", tone: "stone", image: "/campaign/faith-accessories.png", sizes: ["12 oz"], colors: ["White", "Cream"] },
  { id: 10, name: "Peace Be Still Throw Pillow", category: "Gift & Homes", collection: "Gift & Homes", price: 25000, message: "PEACE, BE STILL", scripture: "Mark 4:39", tone: "gift", image: "/campaign/faith-at-home.png", sizes: ["18 × 18 in"], colors: ["Cream", "Sage"] },
];

export const currency = "NGN";

export const deliveryFee = (subtotal: number) => subtotal >= 75000 ? 0 : 8000;

export const money = (value: number) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);
