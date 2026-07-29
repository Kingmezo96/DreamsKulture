"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StoreProduct } from "../_lib/catalog";
import { money } from "../_lib/storefront-products";
import type { CollectionConfig } from "./CollectionPage";

const collectionLinks = [
  ["All products", "/#shop"],
  ["Men", "/men"],
  ["Women", "/women"],
  ["Couples Collection", "/couples"],
  ["Gifts & Home", "/gifts-home"],
];

export default function ShopCollectionClient({ config, products }: { config: CollectionConfig; products: StoreProduct[] }) {
  const ceiling = Math.max(40000, ...products.map((product) => Number(product.price)));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(ceiling);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const colors = useMemo(() => Array.from(new Set(products.flatMap((product) => product.color_options))).slice(0, 8), [products]);
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !normalizedQuery || `${product.name} ${product.short_description} ${product.product_type}`.toLowerCase().includes(normalizedQuery);
      const matchesPrice = Number(product.price) <= maxPrice;
      const matchesColor = selectedColors.length === 0 || product.color_options.some((color) => selectedColors.includes(color));
      return matchesQuery && matchesPrice && matchesColor;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(b.featured) - Number(a.featured);
    });
  }, [products, query, maxPrice, selectedColors, sort]);

  const toggleColor = (color: string) => setSelectedColors((current) => current.includes(color) ? current.filter((item) => item !== color) : [...current, color]);

  return (
    <>
      <section className="shop-masthead">
        <div className="shop-masthead__copy">
          <span>{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <div className="shop-breadcrumb"><Link href="/">Home</Link><i /> <span>{config.title}</span></div>
        </div>
        <div className="shop-masthead__image">
          <img src={config.image} alt={`${config.title} by Dreams Kulture`} style={{ objectPosition: config.imagePosition ?? "center" }} />
        </div>
      </section>

      <section className="shop-layout page-wrap">
        <aside className="shop-sidebar">
          <label className="shop-search">
            <span>Search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" />
            <b aria-hidden="true">⌕</b>
          </label>

          <div className="shop-filter">
            <h2>Categories</h2>
            <nav aria-label="Product categories">
              {collectionLinks.map(([label, href]) => <Link key={href} className={label === config.title ? "active" : ""} href={href}>{label}</Link>)}
            </nav>
          </div>

          <div className="shop-filter">
            <h2>Price</h2>
            <input className="price-range" type="range" min="0" max={ceiling} value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
            <p>{money(0)} — {money(maxPrice)}</p>
          </div>

          <div className="shop-filter">
            <h2>Colours</h2>
            <div className="colour-list">
              {colors.map((color) => <label key={color}><input type="checkbox" checked={selectedColors.includes(color)} onChange={() => toggleColor(color)} /><span>{color}</span></label>)}
            </div>
          </div>

          <button className="shop-filter__clear" onClick={() => { setQuery(""); setMaxPrice(ceiling); setSelectedColors([]); setSort("featured"); }}>Clear filters</button>

          {products.length > 0 && <div className="reviewed-products">
            <h2>Reviewed by you</h2>
            {products.slice(0, 3).map((product) => <article key={product.id}><img src={product.image_urls[0]} alt="" /><div><h3>{product.name}</h3><strong>{money(Number(product.price))}</strong></div></article>)}
          </div>}
        </aside>

        <div className="shop-catalogue">
          <div className="shop-toolbar">
            <p>There {visibleProducts.length === 1 ? "is" : "are"} <strong>{visibleProducts.length}</strong> {visibleProducts.length === 1 ? "product" : "products"} in this category</p>
            <label>Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Relevance</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          {visibleProducts.length > 0 ? <div className="shop-product-grid">
            {visibleProducts.map((product, index) => (
              <article className="shop-product-card" key={product.id}>
                <div className="shop-product-card__image">
                  {product.featured && <span>{index % 2 === 0 ? "New" : "Top"}</span>}
                  <button aria-label={`Save ${product.name}`}>♡</button>
                  <img src={product.image_urls[0]} alt={product.name} />
                  <a href={`https://wa.me/2348104268019?text=${encodeURIComponent(`Hello Dreams Kulture, I would like to order the ${product.name}.`)}`} target="_blank" rel="noreferrer">Quick order →</a>
                </div>
                <small>{product.product_type.replace("-", " ")}</small>
                <h3>{product.name}</h3>
                <div className="shop-product-card__bottom">
                  <strong>{money(Number(product.price))}</strong>
                  <span>{(product.frame_size_options.length ? product.frame_size_options : product.size_options).slice(0, 4).join(" · ")}</span>
                </div>
              </article>
            ))}
          </div> : <div className="shop-empty"><h2>No pieces match those filters.</h2><button onClick={() => { setQuery(""); setMaxPrice(ceiling); setSelectedColors([]); }}>Reset filters</button></div>}

          <nav className="shop-pagination" aria-label="Product pages"><button className="active">1</button><button>2</button><button>3</button><button aria-label="Next page">→</button></nav>
        </div>
      </section>
    </>
  );
}
