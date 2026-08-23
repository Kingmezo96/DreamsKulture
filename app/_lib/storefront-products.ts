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
  { id: 2, name: "Always Doing Wonders Shirt", category: "Shirts", collection: "Shirts", price: 10000, message: "ALWAYS DOING WONDERS", scripture: "Psalm 77:14", tone: "ink", image: "/campaign/always-doing-wonders-shirt.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 3, name: "King Priest Shirt", category: "Shirts", collection: "Shirts", price: 10000, message: "KING PRIEST", scripture: "Revelation 1:6", tone: "clay", image: "/campaign/king-priest-shirt.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 4, name: "Not Forsaken Hoodie", category: "Hoodies", collection: "Hoodies", price: 25000, message: "NOT FORSAKEN", scripture: "Deuteronomy 31:8", tone: "chalk", image: "/campaign/not-forsaken-hoodie.png", badge: "top", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 5, name: "God Is Good Hoodie", category: "Hoodies", collection: "Hoodies", price: 25000, message: "GOD IS GOOD", scripture: "Psalm 34:8", tone: "ink", image: "/campaign/god-is-good-hoodie.png", badge: "new", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 6, name: "God’s Masterpiece Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "GOD’S MASTERPIECE", scripture: "Ephesians 2:10", tone: "paper", image: "/dream-kulture-shopping.jpg", badge: "new", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 7, name: "Be the Light Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE THE LIGHT", scripture: "Matthew 5:14", tone: "mist", image: "/campaign/be-the-light-white-sweatshirt.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black"] },
  { id: 8, name: "Walk by Faith Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "WALK BY FAITH", scripture: "2 Corinthians 5:7", tone: "clay", image: "/campaign/walk-by-faith-african-model.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 9, name: "Be Salty Stay Lit Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE SALTY STAY LIT", scripture: "Matthew 5:13–14", tone: "stone", image: "/campaign/men-the-way.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 10, name: "Let God Carry It Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "LET GOD CARRY IT", scripture: "Psalm 55:22", tone: "linen", image: "/campaign/couple-connection.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 11, name: "Cross Equals Love Cap", category: "Caps", collection: "Caps", price: 500, message: "CROSS EQUALS LOVE", scripture: "John 3:16", tone: "ink", image: "/campaign/cross-love-cap.png", badge: "new", sizes: ["Adjustable"], colors: ["Black"] },
  { id: 12, name: "Cord of Three Couples Tee", category: "Couples", collection: "Couples", price: 18000, message: "CORD OF THREE", scripture: "Ecclesiastes 4:12", tone: "paper", image: "/campaign/couple-connection.png", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 13, name: "Grace for Today Mug", category: "Gift & Homes", collection: "Gift & Homes", price: 10000, message: "GRACE FOR TODAY", scripture: "Lamentations 3:23", tone: "stone", image: "/campaign/faith-accessories.png", sizes: ["12 oz"], colors: ["White", "Cream"] },
  { id: 14, name: "Peace Be Still Throw Pillow", category: "Gift & Homes", collection: "Gift & Homes", price: 25000, message: "PEACE, BE STILL", scripture: "Mark 4:39", tone: "gift", image: "/campaign/faith-at-home.png", sizes: ["18 × 18 in"], colors: ["Cream", "Sage"] },
];

export const currency = "NGN";

export const deliveryFee = (subtotal: number) => subtotal >= 75000 ? 0 : 8000;

export const money = (value: number) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);
