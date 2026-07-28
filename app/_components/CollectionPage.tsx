import Link from "next/link";
import { getProducts } from "../_lib/catalog";

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
        <Link className="collection-header__logo" href="/" aria-label="Dreams Kulture home">
          <img src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />
        </Link>
        <nav aria-label="Collection navigation">
          {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link className="collection-back" href="/">← Home</Link>
      </header>

      <section className="collection-hero">
        <div className="collection-hero__image">
          <img src={config.image} alt={`${config.title} by Dreams Kulture`} style={{ objectPosition: config.imagePosition ?? "center" }} />
        </div>
        <div className="collection-hero__copy">
          <span>{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
          <a href="#collection-products">Explore the collection ↓</a>
        </div>
      </section>

      <section className="collection-products page-wrap" id="collection-products">
        <header>
          <span>Designed with faith + intention</span>
          <h2>{products.length} meaningful pieces</h2>
        </header>
        <div className="collection-products__grid">
          {products.map((product) => (
            <article className="collection-product" key={product.id}>
              <div className="collection-product__image">
                <img src={product.image_urls[0]} alt={product.name} />
              </div>
              <div className="collection-product__info">
                <div>
                  <small>{product.product_type.replace("-", " ")}</small>
                  <h3>{product.name}</h3>
                  <p>{product.short_description}</p>
                </div>
                <strong>${Number(product.price).toFixed(2)}</strong>
              </div>
              <div className="collection-product__options">
                <span>{(product.frame_size_options.length ? product.frame_size_options : product.size_options).join(" · ")}</span>
                <span>{product.color_options.join(" · ")}</span>
              </div>
              <a href={`https://wa.me/2348104268019?text=${encodeURIComponent(`Hello Dreams Kulture, I would like to order the ${product.name}.`)}`} target="_blank" rel="noreferrer">Order on WhatsApp →</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="collection-page__footer">
        <img src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />
        <p>Faith-inspired apparel, prints and gifts—designed in Nigeria.</p>
        <div><a href="https://wa.me/2348104268019">WhatsApp</a><a href="https://www.instagram.com/dreamskulture_/">Instagram</a></div>
      </footer>
    </main>
  );
}
