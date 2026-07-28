export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  scripture: string | null;
  product_type: string;
  price: number;
  image_urls: string[];
  size_options: string[];
  color_options: string[];
  frame_size_options: string[];
  featured: boolean;
  categories: { name: string; slug: string } | null;
};

const fallbackProducts: StoreProduct[] = [
  ["1", "Walk by Faith Shirt", "walk-by-faith-shirt", "A premium faith shirt for everyday wear.", "2 Corinthians 5:7", "shirt", 20, "/campaign/faith-tees-rack.png", ["XS", "S", "M", "L", "XL", "2XL", "3XL"], ["Black", "Cream", "Army Green", "Maroon"], "faith-tees", "Faith Tees"],
  ["2", "Pray Boldly Tee", "pray-boldly-tee", "Soft strength and bold prayer.", "1 Thessalonians 5:17", "t-shirt", 25, "/campaign/women-pray-boldly.png", ["XS", "S", "M", "L", "XL", "2XL"], ["Army Green", "Cream", "Black"], "women", "Women"],
  ["3", "The Way Hoodie", "the-way-hoodie", "A heavyweight statement layer.", "John 14:6", "hoodie", 25, "/campaign/men-the-way.png", ["S", "M", "L", "XL", "2XL", "3XL"], ["Maroon", "Black", "Ash"], "men", "Men"],
  ["4", "Cord of Three Tee", "cord-of-three-tee", "Faith at the centre of love.", "Ecclesiastes 4:12", "t-shirt", 25, "/campaign/couple-connection.png", ["XS", "S", "M", "L", "XL", "2XL", "3XL"], ["Cream", "Cocoa"], "couples-collection", "Couples Collection"],
  ["5", "Better Together Tee", "better-together-tee", "Designed for faith and love together.", "Ecclesiastes 4:12", "t-shirt", 25, "/campaign/couple-connection.png", ["XS", "S", "M", "L", "XL", "2XL", "3XL"], ["Cocoa", "Cream"], "couples-collection", "Couples Collection"],
  ["6", "Grace for Today Mug", "grace-for-today-mug", "A daily reminder with every cup.", "Lamentations 3:23", "mug", 10, "/campaign/faith-accessories.png", ["12 oz"], ["Cream", "White"], "gifts-home", "Gifts & Home"],
  ["7", "Let God Lead Tote", "let-god-lead-tote", "Carry the reminder everywhere.", "Proverbs 3:6", "tote-bag", 12, "/campaign/faith-accessories.png", ["One Size"], ["Black", "Natural"], "gifts-home", "Gifts & Home"],
  ["8", "Faith Everyday Cap", "faith-everyday-cap", "A simple embroidered declaration.", "Hebrews 11:1", "cap", 9, "/campaign/faith-accessories.png", ["Adjustable"], ["Army Green", "Black"], "gifts-home", "Gifts & Home"],
  ["9", "Coffee & Grace Set", "coffee-grace-set", "A thoughtful coffee-time gift set.", "Psalm 90:14", "gift-set", 30, "/campaign/faith-accessories.png", ["Gift Set"], ["Ivory & Sage"], "gifts-home", "Gifts & Home"],
  ["10", "Peace, Be Still Cushion", "peace-be-still-cushion", "A gentle reminder for restful spaces.", "Mark 4:39", "cushion", 20, "/campaign/faith-at-home.png", ["18 × 18 in"], ["Cream", "Sage"], "gifts-home", "Gifts & Home"],
  ["11", "Write the Vision Journal", "write-the-vision-journal", "A place for prayer, plans and reflection.", "Habakkuk 2:2", "journal", 12, "/campaign/faith-at-home.png", ["A5"], ["Maroon", "Cream"], "gifts-home", "Gifts & Home"],
  ["12", "Grace Lives Here Frame", "grace-lives-here-frame", "Faith-centred wall art for modern homes.", null, "frame", 30, "/campaign/faith-at-home.png", [], ["Ivory", "Black"], "gifts-home", "Gifts & Home"],
].map(([id, name, slug, short_description, scripture, product_type, price, image, sizes, colors, categorySlug, categoryName]) => ({
  id: String(id),
  name: String(name),
  slug: String(slug),
  short_description: String(short_description),
  scripture: scripture ? String(scripture) : null,
  product_type: String(product_type),
  price: Number(price),
  image_urls: [String(image)],
  size_options: sizes as string[],
  color_options: colors as string[],
  frame_size_options: product_type === "frame" ? ["8×10 in", "11×14 in", "12×16 in", "16×20 in", "18×24 in", "24×36 in", "A4", "A3", "A2"] : [],
  featured: true,
  categories: { slug: String(categorySlug), name: String(categoryName) },
}));

export async function getProducts(categorySlug: string): Promise<StoreProduct[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const fallback = fallbackProducts.filter((product) => product.categories?.slug === categorySlug);
  if (!url || !key) return fallback;

  try {
    const select = "id,name,slug,short_description,scripture,product_type,price,image_urls,size_options,color_options,frame_size_options,featured,categories!inner(name,slug)";
    const endpoint = `${url}/rest/v1/products?select=${encodeURIComponent(select)}&status=eq.active&categories.slug=eq.${encodeURIComponent(categorySlug)}&order=featured.desc,created_at.asc`;
    const response = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    });
    if (!response.ok) return fallback;
    const products = (await response.json()) as StoreProduct[];
    return products.length ? products : fallback;
  } catch {
    return fallback;
  }
}
