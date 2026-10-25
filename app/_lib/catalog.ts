import { products } from "./storefront-products";

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  scripture: string | null;
  product_type: string;
  price: number;
  image_urls: string[];
  design_text: string;
  variant_kind: string | null;
  default_color: string | null;
  variant_images: Record<string, string>;
  size_options: string[];
  color_options: string[];
  frame_size_options: string[];
  featured: boolean;
  categories: { name: string; slug: string } | null;
};

const shopCategorySlugs: Record<string, string> = {
  Shirts: "shirts",
  Hoodies: "hoodies",
  Sweatshirts: "sweatshirts",
  Couples: "couples",
  Caps: "caps",
  Mugs: "mugs",
  "Tote Bags": "tote-bags",
  Journals: "journals",
  "Gift & Homes": "gifts-home",
};

const productTypeSlugs: Record<string, string> = {
  Shirts: "shirt",
  Hoodies: "hoodie",
  Sweatshirts: "sweatshirt",
  Couples: "shirt",
  Caps: "cap",
  Mugs: "mug",
  "Tote Bags": "tote-bag",
  Journals: "journal",
  "Gift & Homes": "gift-home",
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function getVariantKind(product: (typeof products)[number]) {
  if (product.category === "Shirts") return "tshirt";
  if (product.category === "Hoodies") return "hoodie";
  if (product.category === "Sweatshirts") return "sweatshirt";
  if (product.category === "Caps") return "cap";
  if (product.category === "Couples") return "couples";
  if (product.name.toLowerCase().includes("mug")) return "mug";
  return null;
}

const variantImageConfig: Record<number, { prefix: string; originalColor?: string }> = {
  1: { prefix: "women-pray-boldly", originalColor: "Green" },
  2: { prefix: "always-doing-wonders-shirt", originalColor: "Black" },
  3: { prefix: "king-priest-shirt", originalColor: "Maroon" },
  4: { prefix: "not-forsaken-hoodie" },
  5: { prefix: "god-is-good-hoodie", originalColor: "Black" },
  6: { prefix: "gods-masterpiece-sweatshirt", originalColor: "Black" },
  7: { prefix: "be-the-light-sweatshirt", originalColor: "White" },
  8: { prefix: "walk-by-faith-sweatshirt", originalColor: "Black" },
  9: { prefix: "be-salty-stay-lit-sweatshirt" },
  10: { prefix: "let-god-carry-it-sweatshirt" },
  11: { prefix: "cross-love-cap", originalColor: "Black" },
  12: { prefix: "cord-of-three-couples-tee" },
  13: { prefix: "gods-masterpiece-mug", originalColor: "White" },
  15: { prefix: "walk-by-faith-shirt", originalColor: "Black" },
  16: { prefix: "grace-upon-grace-shirt", originalColor: "White" },
  17: { prefix: "pray-big-shirt", originalColor: "Green" },
  18: { prefix: "chosen-shirt", originalColor: "Maroon" },
};

function getVariantImages(product: (typeof products)[number], kind: string | null) {
  if (!kind) return {};

  const config = variantImageConfig[product.id];
  if (!config) return {};

  return Object.fromEntries(product.colors.map((color) => [
    color,
    color === config.originalColor
      ? product.image
      : `/campaign/variants/products/${config.prefix}-${slugify(color)}.webp`,
  ]));
}

export const shopCategories = [
  ["All products", "/shop", "all"],
  ["Shirts", "/shirts", "shirts"],
  ["Hoodies", "/hoodies", "hoodies"],
  ["Sweatshirts", "/sweatshirts", "sweatshirts"],
  ["Caps", "/caps", "caps"],
  ["Couples", "/couples", "couples"],
  ["Journals", "/journals", "journals"],
  ["Gift & Homes", "/gifts-home", "gifts-home"],
] as const;

const storeProducts: StoreProduct[] = products.map((product) => {
  const categorySlug = shopCategorySlugs[product.category] ?? slugify(product.category);
  const variantKind = getVariantKind(product);

  return {
    id: String(product.id),
    name: product.name,
    slug: slugify(product.name),
    short_description: `${product.message} — ${product.scripture}`,
    scripture: product.scripture,
    product_type: productTypeSlugs[product.category] ?? slugify(product.category),
    price: product.price,
    image_urls: [product.image],
    design_text: product.message,
    variant_kind: variantKind,
    default_color: variantImageConfig[product.id]?.originalColor ?? null,
    variant_images: getVariantImages(product, variantKind),
    size_options: product.sizes,
    color_options: product.colors,
    frame_size_options: [],
    featured: Boolean(product.badge),
    categories: { slug: categorySlug, name: product.category },
  };
});

export async function getProducts(categorySlug: string): Promise<StoreProduct[]> {
  if (categorySlug === "all" || categorySlug === "shop") return storeProducts;
  if (categorySlug === "mugs") return storeProducts.filter((product) => product.name.toLowerCase().includes("mug"));
  if (categorySlug === "tote-bags") return storeProducts.filter((product) => product.product_type === "tote-bag");
  return storeProducts.filter((product) => product.categories?.slug === categorySlug);
}
