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
  size_options: string[];
  color_options: string[];
  frame_size_options: string[];
  featured: boolean;
  categories: { name: string; slug: string } | null;
};

const shopCategorySlugs: Record<string, string> = {
  Shirts: "shirts",
  Sweatshirts: "sweatshirts",
  Caps: "caps",
  Mugs: "mugs",
  "Tote Bags": "tote-bags",
  Journals: "journals",
};

const productTypeSlugs: Record<string, string> = {
  Shirts: "shirt",
  Sweatshirts: "sweatshirt",
  Caps: "cap",
  Mugs: "mug",
  "Tote Bags": "tote-bag",
  Journals: "journal",
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const shopCategories = [
  ["All products", "/shop", "all"],
  ["Shirts", "/shirts", "shirts"],
  ["Sweatshirts", "/sweatshirts", "sweatshirts"],
  ["Caps", "/caps", "caps"],
  ["Mugs", "/mugs", "mugs"],
  ["Tote Bags", "/tote-bags", "tote-bags"],
  ["Journals", "/journals", "journals"],
] as const;

const storeProducts: StoreProduct[] = products.map((product) => {
  const categorySlug = shopCategorySlugs[product.category] ?? slugify(product.category);

  return {
    id: String(product.id),
    name: product.name,
    slug: slugify(product.name),
    short_description: `${product.message} — ${product.scripture}`,
    scripture: product.scripture,
    product_type: productTypeSlugs[product.category] ?? slugify(product.category),
    price: product.price,
    image_urls: [product.image],
    size_options: product.sizes,
    color_options: product.colors,
    frame_size_options: [],
    featured: Boolean(product.badge),
    categories: { slug: categorySlug, name: product.category },
  };
});

export async function getProducts(categorySlug: string): Promise<StoreProduct[]> {
  if (categorySlug === "all" || categorySlug === "shop") return storeProducts;
  return storeProducts.filter((product) => product.categories?.slug === categorySlug);
}
