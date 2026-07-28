import { getProducts } from "../_lib/catalog";
import InnerHeader from "./InnerHeader";
import ShopCollectionClient from "./ShopCollectionClient";

export type CollectionConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imagePosition?: string;
};

export default async function CollectionPage({ config }: { config: CollectionConfig }) {
  const products = await getProducts(config.slug);

  return (
    <main className="collection-page">
      <InnerHeader />

      <ShopCollectionClient config={config} products={products} />

      <footer className="collection-page__footer">
        <img src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />
        <p>Faith-inspired apparel, prints and gifts—designed in Nigeria.</p>
        <div><a href="https://wa.me/2348104268019">WhatsApp</a><a href="https://www.instagram.com/dreamskulture_/">Instagram</a></div>
      </footer>
    </main>
  );
}
