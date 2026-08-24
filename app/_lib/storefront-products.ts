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
  { id: 1, name: "Just a Girl Faith Shirt", category: "Shirts", collection: "Shirts", price: 12000, message: "JUST A GIRL WHO DECIDED TO LIVE BY FAITH", scripture: "2 Corinthians 5:7", tone: "ink", image: "/campaign/women-pray-boldly.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 2, name: "Always Doing Wonders Shirt", category: "Shirts", collection: "Shirts", price: 12000, message: "ALWAYS DOING WONDERS", scripture: "Psalm 77:14", tone: "ink", image: "/campaign/always-doing-wonders-shirt.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 3, name: "King Priest Shirt", category: "Shirts", collection: "Shirts", price: 12000, message: "KING PRIEST", scripture: "Revelation 1:6", tone: "clay", image: "/campaign/king-priest-shirt.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 15, name: "Walk by Faith Shirt", category: "Shirts", collection: "Shirts", price: 12000, message: "WALK BY FAITH", scripture: "2 Corinthians 5:7", tone: "stone", image: "/campaign/walk-by-faith-shirt-closeup.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 16, name: "Grace Upon Grace Shirt", category: "Shirts", collection: "Shirts", price: 12000, message: "GRACE UPON GRACE", scripture: "John 1:16", tone: "linen", image: "/campaign/grace-upon-grace-shirt-closeup.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 17, name: "Pray Big Shirt", category: "Shirts", collection: "Shirts", price: 12000, message: "PRAY BIG", scripture: "Ephesians 3:20", tone: "moss", image: "/campaign/pray-big-shirt-closeup.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 18, name: "Chosen Shirt", category: "Shirts", collection: "Shirts", price: 12000, message: "CHOSEN", scripture: "1 Peter 2:9", tone: "clay", image: "/campaign/chosen-shirt-closeup.png", badge: "new", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 4, name: "Not Forsaken Hoodie", category: "Hoodies", collection: "Hoodies", price: 25000, message: "NOT FORSAKEN", scripture: "Deuteronomy 31:8", tone: "chalk", image: "/campaign/not-forsaken-hoodie.png", badge: "top", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 5, name: "God Is Good Hoodie", category: "Hoodies", collection: "Hoodies", price: 25000, message: "GOD IS GOOD", scripture: "Psalm 34:8", tone: "ink", image: "/campaign/god-is-good-hoodie.png", badge: "new", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 6, name: "God’s Masterpiece Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "GOD’S MASTERPIECE", scripture: "Ephesians 2:10", tone: "paper", image: "/campaign/gods-masterpiece-sweatshirt.png", badge: "new", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 7, name: "Be the Light Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE THE LIGHT", scripture: "Matthew 5:14", tone: "mist", image: "/campaign/be-the-light-white-sweatshirt.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black"] },
  { id: 8, name: "Walk by Faith Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "WALK BY FAITH", scripture: "2 Corinthians 5:7", tone: "clay", image: "/campaign/walk-by-faith-black-african-model.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black"] },
  { id: 9, name: "Be Salty Stay Lit Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "BE SALTY STAY LIT", scripture: "Matthew 5:13–14", tone: "stone", image: "/campaign/men-the-way.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 10, name: "Let God Carry It Sweatshirt", category: "Sweatshirts", collection: "Sweatshirts", price: 20000, message: "LET GOD CARRY IT", scripture: "Psalm 55:22", tone: "linen", image: "/campaign/couple-connection.png", sizes: ["M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Army Green"] },
  { id: 11, name: "Cross Equals Love Cap", category: "Caps", collection: "Caps", price: 500, message: "CROSS EQUALS LOVE", scripture: "John 3:16", tone: "ink", image: "/campaign/cross-love-cap.png", badge: "new", sizes: ["Adjustable"], colors: ["White", "Black", "Red", "Maroon", "Navy Blue", "Green"] },
  { id: 12, name: "Cord of Three Couples Tee", category: "Couples", collection: "Couples", price: 18000, message: "CORD OF THREE", scripture: "Ecclesiastes 4:12", tone: "paper", image: "/campaign/couple-connection.png", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Green", "Blue", "Yellow", "Maroon", "Coffee Brown", "Chocolate Brown", "Red"] },
  { id: 13, name: "Grace for Today Mug", category: "Gift & Homes", collection: "Gift & Homes", price: 10000, message: "GRACE FOR TODAY", scripture: "Lamentations 3:23", tone: "stone", image: "/campaign/faith-accessories.png", sizes: ["12 oz"], colors: ["White", "Cream"] },
  { id: 14, name: "Peace Be Still Throw Pillow", category: "Gift & Homes", collection: "Gift & Homes", price: 25000, message: "PEACE, BE STILL", scripture: "Mark 4:39", tone: "gift", image: "/campaign/faith-at-home.png", sizes: ["18 × 18 in"], colors: ["Cream", "Sage"] },
  { id: 19, name: "Cross Equals Love Journal", category: "Journals", collection: "Journals", price: 10000, message: "CROSS EQUALS LOVE", scripture: "John 3:16", tone: "ink", image: "/campaign/cross-equals-love-journal.png", badge: "new", sizes: ["A5"], colors: ["Black"] },
  { id: 20, name: "But God Prayer Journal", category: "Journals", collection: "Journals", price: 10000, message: "BUT GOD", scripture: "God will make a way", tone: "ink", image: "/campaign/but-god-journal.jpg", badge: "new", sizes: ["A5"], colors: ["Black"] },
  { id: 21, name: "Be Still and Know Journal", category: "Journals", collection: "Journals", price: 10000, message: "BE STILL AND KNOW", scripture: "Psalm 46:10", tone: "gift", image: "/campaign/be-still-know-journal.jpg", badge: "new", sizes: ["A5"], colors: ["Blush"] },
];

export const currency = "NGN";

export const shippingOptions = [
  {
    id: "pickup-kubwa",
    title: "Pickup — Kubwa",
    price: 0,
    description: "Pickup at Arab Road, Kubwa, Abuja. No delivery fee.",
  },
  {
    id: "abuja-central",
    title: "Abuja Central Locations",
    price: 3500,
    description: "Central Area, Mabushi, Wuse, Garki, Jahi, Wuye, Jabi, Kado and Maitama.",
  },
  {
    id: "abuja-area-b",
    title: "Abuja Area B",
    price: 4000,
    description: "Lokogoma, Apo, Prince and Princess, Durumi, Games Village, AYA, Kabusa, Karmo, Suncity and Idu.",
  },
  {
    id: "abuja-area-c",
    title: "Abuja Area C",
    price: 4500,
    description: "Karmo, Damunde, Suncity, Idu, Gwarinpa and other Area C locations.",
  },
  {
    id: "abuja-non-central",
    title: "Abuja Non Central",
    price: 5000,
    description: "Kugbo, Wumba, Kubwa, Lugbe and Dawaki. Delivery is usually the next day after production.",
  },
  {
    id: "nyanya-maraba-karu",
    title: "Nyanya, Mararaba, Karu",
    price: 6000,
    description: "Nyanya, Mararaba, Karu and Airport axis. Delivery is usually the next day after production.",
  },
  {
    id: "outside-abuja",
    title: "All States Outside Abuja",
    price: 7000,
    description: "All states outside Abuja except Enugu, Edo, Bayelsa, Benin, Port Harcourt and Calabar. 0–2kg only; extra kg attracts ₦1,000.",
  },
  {
    id: "europe",
    title: "Europe",
    price: 78500,
    description: "For all countries in Europe, 0–2KG (equivalent of 5 shirts). Extra KG might attract an extra cost.",
  },
  {
    id: "united-kingdom",
    title: "United Kingdom",
    price: 65000,
    description: "For all cities in the UK, 0–2KG (equivalent of 5 shirts). Extra KG might attract an additional cost.",
  },
  {
    id: "usa-canada",
    title: "USA & Canada",
    price: 70000,
    description: "0–2KG (equivalent of 5 shirts). Extra KG might attract an additional cost.",
  },
  {
    id: "west-africa",
    title: "West Africa",
    price: 65000,
    description: "West African countries, 0–2KG (equivalent of 5 shirts). Extra KG might attract an additional cost.",
  },
] as const;

export type ShippingOptionId = typeof shippingOptions[number]["id"];

export const getShippingOption = (id?: string) => shippingOptions.find((option) => option.id === id) ?? shippingOptions[0];
export const deliveryFee = (_subtotal: number, shippingOptionId?: string) => getShippingOption(shippingOptionId).price;

export const money = (value: number) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);
