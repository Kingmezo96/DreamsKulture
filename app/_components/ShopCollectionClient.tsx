"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { shopCategories, type StoreProduct } from "../_lib/catalog";
import { deliveryFee, getShippingOption, money, shippingOptions, type ShippingOptionId } from "../_lib/storefront-products";
import type { CollectionConfig } from "./CollectionPage";

type CartItem = StoreProduct & {
  size: string;
  color: string;
  quantity: number;
};

const cartStorageKey = "dreams-kulture-cart";

function getProductSizes(product: StoreProduct) {
  return product.frame_size_options.length ? product.frame_size_options : product.size_options;
}

function readStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed as CartItem[] : [];
  } catch {
    return [];
  }
}

export default function ShopCollectionClient({ config, products }: { config: CollectionConfig; products: StoreProduct[] }) {
  const ceiling = Math.max(40000, ...products.map((product) => Number(product.price)));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(ceiling);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selected, setSelected] = useState<StoreProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [shippingOptionId, setShippingOptionId] = useState<ShippingOptionId>(shippingOptions[0].id);

  useEffect(() => {
    setCart(readStoredCart());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart]);

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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const selectedShipping = getShippingOption(shippingOptionId);
  const delivery = deliveryFee(subtotal, shippingOptionId);

  const toggleColor = (color: string) => setSelectedColors((current) => current.includes(color) ? current.filter((item) => item !== color) : [...current, color]);

  const openProduct = (product: StoreProduct) => {
    const sizes = getProductSizes(product);
    setSelected(product);
    setSelectedSize(sizes[0] ?? "Default");
    setSelectedColor(product.color_options[0] ?? "Default");
    setSelectedQuantity(1);
  };

  const addToCart = () => {
    if (!selected) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === selected.id && item.size === selectedSize && item.color === selectedColor);
      if (existing) {
        return current.map((item) => item.id === selected.id && item.size === selectedSize && item.color === selectedColor ? { ...item, quantity: item.quantity + selectedQuantity } : item);
      }
      return [...current, { ...selected, size: selectedSize, color: selectedColor, quantity: selectedQuantity }];
    });
    setSelected(null);
    setCartOpen(true);
  };

  const changeQuantity = (index: number, delta: number) => setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutError("");
    setCheckoutLoading(true);

    const formData = new FormData(event.currentTarget);
    const customer = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      country: String(formData.get("country") ?? ""),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
    };

    try {
      const response = await fetch("/api/checkout/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart.map((item) => ({
            id: Number(item.id),
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          shippingOptionId,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.authorizationUrl) throw new Error(result.message || "Unable to start Paystack checkout.");

      window.localStorage.setItem("dreams-kulture-last-paystack-reference", result.reference);
      window.localStorage.setItem(cartStorageKey, "[]");
      window.location.href = result.authorizationUrl;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start Paystack checkout.");
      setCheckoutLoading(false);
    }
  };

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
              {shopCategories.map(([label, href, slug]) => <Link key={href} className={slug === config.slug ? "active" : ""} href={href}>{label}</Link>)}
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
        </aside>

        <div className="shop-catalogue">
          <div className="shop-toolbar">
            <p>There {visibleProducts.length === 1 ? "is" : "are"} <strong>{visibleProducts.length}</strong> {visibleProducts.length === 1 ? "product" : "products"} in this category</p>
            <button className="shop-bag-button" onClick={() => setCartOpen(true)}>Bag <b>{cartCount}</b></button>
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
                <button className="shop-product-card__image" onClick={() => openProduct(product)} aria-label={`Buy ${product.name}`}>
                  {product.featured && <span>{index % 2 === 0 ? "New" : "Top"}</span>}
                  <i aria-hidden="true">♡</i>
                  <img src={product.image_urls[0]} alt={product.name} />
                  <em>Buy now →</em>
                </button>
                <small>{product.product_type.replace("-", " ")}</small>
                <h3>{product.name}</h3>
                <div className="shop-product-card__bottom">
                  <strong>{money(Number(product.price))}</strong>
                  <span>{getProductSizes(product).slice(0, 4).join(" · ")}</span>
                </div>
              </article>
            ))}
          </div> : <div className="shop-empty"><h2>No pieces match those filters.</h2><button onClick={() => { setQuery(""); setMaxPrice(ceiling); setSelectedColors([]); }}>Reset filters</button></div>}

          <nav className="shop-pagination" aria-label="Product pages"><button className="active">1</button><button>2</button><button>3</button><button aria-label="Next page">→</button></nav>
        </div>
      </section>

      {selected && <div className="overlay" role="dialog" aria-modal="true" aria-label={selected.name}>
        <button className="overlay__backdrop" onClick={() => setSelected(null)} aria-label="Close product details" />
        <div className="product-modal">
          <button className="close-button" onClick={() => setSelected(null)} aria-label="Close">×</button>
          <div className="product-modal__art"><div className="product-art product-art--photo"><img src={selected.image_urls[0]} alt={selected.name} /></div></div>
          <div className="product-modal__content">
            <span className="category-subtitle"><b>{selected.categories?.name ?? selected.product_type}</b></span>
            <h2>{selected.name}</h2>
            <strong className="product-price">{money(Number(selected.price))}</strong>
            <p>{selected.short_description}</p>
            {selected.scripture && <blockquote>Inspired by {selected.scripture}</blockquote>}
            <fieldset><legend>Choose size</legend><div className="option-row">{getProductSizes(selected).map((size) => <button type="button" key={size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></fieldset>
            <fieldset><legend>Choose colour</legend><div className="option-row">{selected.color_options.map((color) => <button type="button" key={color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)}>{color}</button>)}</div></fieldset>
            <div className="add-row"><div className="quantity"><button onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}>−</button><span>{selectedQuantity}</span><button onClick={() => setSelectedQuantity(selectedQuantity + 1)}>＋</button></div><button className="mol-button" onClick={addToCart}><span>Add to bag · {money(Number(selected.price) * selectedQuantity)}</span></button></div>
            <div className="product-facts"><span>Secure Paystack checkout</span><span>Pickup or delivery</span><span>WhatsApp support</span></div>
          </div>
        </div>
      </div>}

      {cartOpen && <div className="overlay overlay--cart" role="dialog" aria-modal="true" aria-label="Shopping bag">
        <button className="overlay__backdrop" onClick={() => setCartOpen(false)} aria-label="Close shopping bag" />
        <aside className="cart-panel">
          <header><div><span className="category-subtitle"><b>your</b> selection</span><h2>Shopping bag <small>({cartCount})</small></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close">×</button></header>
          {cart.length === 0 ? <div className="cart-empty"><p>Your bag is waiting for something meaningful.</p><button className="mol-button" onClick={() => setCartOpen(false)}><span>Explore the shop</span></button></div> : <>
            <div className="cart-items">{cart.map((item, index) => <article className="cart-item" key={`${item.id}-${item.size}-${item.color}`}><div className="cart-item__image"><img src={item.image_urls[0]} alt="" /></div><div><h3>{item.name}</h3><p>{item.color} · {item.size}</p><strong>{money(Number(item.price))}</strong><div className="cart-item__actions"><div className="quantity quantity--small"><button onClick={() => changeQuantity(index, -1)}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(index, 1)}>＋</button></div><button onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div></div></article>)}</div>
            <div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Estimated delivery</span><strong>{delivery === 0 ? "Free" : money(delivery)}</strong></div><div className="cart-total"><span>Total</span><strong>{money(subtotal + delivery)}</strong></div><button className="mol-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}><span>Proceed to checkout</span></button></div>
          </>}
        </aside>
      </div>}

      {checkoutOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="Checkout">
        <button className="overlay__backdrop" onClick={() => !checkoutLoading && setCheckoutOpen(false)} aria-label="Close checkout" />
        <div className="checkout-modal">
          <button className="close-button" onClick={() => setCheckoutOpen(false)} disabled={checkoutLoading}>×</button>
          <div className="checkout-head"><span className="category-subtitle"><b>paystack</b> checkout</span><h2>Delivery details</h2><p>Enter your name and phone number so Paystack and the Dreams Kulture team can identify your order.</p></div>
          <form className="checkout-form" onSubmit={submitCheckout}>
            <div className="field-grid"><label>First name<input name="firstName" required autoComplete="given-name" /></label><label>Last name<input name="lastName" required autoComplete="family-name" /></label></div>
            <label>Email<input name="email" required type="email" autoComplete="email" /></label>
            <label>Phone number<input name="phone" required type="tel" placeholder="+234" autoComplete="tel" /></label>
            <div className="shipping-choice"><div className="shipping-choice__head"><h3>Select shipping</h3><span>{selectedShipping.price === 0 ? "Free" : money(selectedShipping.price)}</span></div>{shippingOptions.map((option) => <label className={`shipping-option ${shippingOptionId === option.id ? "active" : ""}`} key={option.id}><input type="radio" name="shippingOptionId" value={option.id} checked={shippingOptionId === option.id} onChange={() => setShippingOptionId(option.id)} /><span><b>{option.title}</b><small>{option.description}</small></span><strong>{option.price === 0 ? "Free" : money(option.price)}</strong></label>)}</div>
            <label>Country<select name="country" required defaultValue="Nigeria"><option>Nigeria</option><option>Ghana</option><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Other international</option></select></label>
            <label>Delivery address / pickup note<input name="address" required={shippingOptionId !== "pickup-kubwa"} placeholder={shippingOptionId === "pickup-kubwa" ? "Pickup at Arab Road, Kubwa, Abuja" : "Street address"} /></label>
            <div className="field-grid"><label>City<input name="city" required={shippingOptionId !== "pickup-kubwa"} placeholder={shippingOptionId === "pickup-kubwa" ? "Kubwa" : ""} /></label><label>State / region<input name="state" required={shippingOptionId !== "pickup-kubwa"} placeholder={shippingOptionId === "pickup-kubwa" ? "Abuja" : ""} /></label></div>
            <div className="checkout-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="checkout-total"><span>{selectedShipping.title}</span><strong>{delivery === 0 ? "Free" : money(delivery)}</strong></div><div className="checkout-total checkout-total--grand"><span>Order total</span><strong>{money(subtotal + delivery)}</strong></div>
            <label className="terms"><input type="checkbox" required /> I agree to the store terms, shipping and return policy.</label>
            {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
            <button className="mol-button" type="submit" disabled={checkoutLoading || cart.length === 0}><span>{checkoutLoading ? "Connecting to Paystack…" : "Pay securely with Paystack"}</span></button>
            <small>Your order is only confirmed after Paystack verifies the payment.</small>
          </form>
        </div>
      </div>}
    </>
  );
}
