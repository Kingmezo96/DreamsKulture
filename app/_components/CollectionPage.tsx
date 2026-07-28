import Link from "next/link";
import { getProducts } from "../_lib/catalog";
import ShopCollectionClient from "./ShopCollectionClient";

export type CollectionConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imagePosition?: string;
};

const navigation = [
  ["Men", "/men"],
  ["Women", "/women"],
  ["Couples", "/couples"],
  ["Gifts & Home", "/gifts-home"],
];

export default async function CollectionPage({ config }: { config: CollectionConfig }) {
  const products = await getProducts(config.slug);

  return (
    <main className="collection-page">
      <header className="collection-header">
        <button className="collection-menu" aria-label="Open menu"><span /><span /><span /></button>
        <Link className="collection-header__logo" href="/" aria-label="Dreams Kulture home">
          <img src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />
        </Link>
        <nav aria-label="Collection navigation">
          <Link href="/">Home</Link>
          {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="collection-actions"><Link href="/#shop" aria-label="Search">⌕</Link><span aria-hidden="true">♙</span><span aria-hidden="true">♡ <b>0</b></span><span aria-hidden="true">▢ <b>0</b></span></div>
      </header>

      <ShopCollectionClient config={config} products={products} />

      <footer className="collection-page__footer">
        <img src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />
        <p>Faith-inspired apparel, prints and gifts—designed in Nigeria.</p>
        <div><a href="https://wa.me/2348104268019">WhatsApp</a><a href="https://www.instagram.com/dreamskulture_/">Instagram</a></div>
      </footer>
    </main>
  );
}
