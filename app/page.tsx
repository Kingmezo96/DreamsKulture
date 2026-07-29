"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { deliveryFee, money, products, type Product } from "@/app/_lib/storefront-products";

type CartItem = Product & { size: string; color: string; quantity: number };

const heroSlides = [
  { kicker: "faith tees", title: <>Wear the word.<br />Live the message.</>, image: "/campaign/faith-tees-rack.png", className: "hero-slide--shopping" },
  { kicker: "couples collection", title: <>Faith together.<br />Love connected.</>, image: "/campaign/couple-connection.png", className: "hero-slide--gifting" },
  { kicker: "gifts with meaning", title: <>Small reminders.<br />Lasting truth.</>, image: "/campaign/faith-accessories.png", className: "hero-slide--accessories" },
];

const categories = ["All", "Couples Collection", "Women", "Men", "Faith Tees", "Gifts & Home"];
const categoryStorageKey = "dreams-kulture-featured-category";

function BrandLogo({ light = false }: { light?: boolean }) {
  return <img className={`dk-logo ${light ? "dk-logo--light" : ""}`} src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />;
}

function ProductArtwork({ product }: { product: Product }) {
  return (
    <div className={`product-art product-art--${product.tone} product-art--photo`}>
      <img src={product.image} alt={`${product.name} product campaign`} />
    </div>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  return (
    <article className="catalog-card" data-reveal>
      <button className="catalog-card__visual" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        {product.badge && <span className={`item-tag item-tag--${product.badge}`}>{product.badge}</span>}
        <span className="catalog-card__heart" aria-hidden="true"><img src="/mollee/heart.svg" alt="" /></span>
        <ProductArtwork product={product} />
        <span className="catalog-card__quick">Quick view <b>→</b></span>
      </button>
      <div className="catalog-card__info">
        <div><p>{product.category}</p><h3>{product.name}</h3></div>
        <div className="catalog-card__price"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
      </div>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [category, setCategory] = useState(() => {
    if (typeof window === "undefined") return "All";
    const storedCategory = window.localStorage.getItem(categoryStorageKey);
    return storedCategory && categories.includes(storedCategory) ? storedCategory : "All";
  });
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(categoryStorageKey, category);
    tabsRef.current?.querySelector<HTMLButtonElement>(".active")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [category]);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [category]);

  const visibleProducts = useMemo(() => products.filter((product) => {
    if (category === "All") return true;
    return product.collection === category;
  }), [category]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = deliveryFee(subtotal);

  const changeHero = (direction: number) => setHeroIndex((index) => (index + direction + heroSlides.length) % heroSlides.length);
  const openProduct = (product: Product) => {
    setSelected(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setSelectedQuantity(1);
  };
  const addToCart = () => {
    if (!selected) return;
    const matches = (item: CartItem) => item.id === selected.id && item.size === selectedSize && item.color === selectedColor;
    setCart((current) => {
      const existing = current.find(matches);
      if (existing) return current.map((item) => matches(item) ? { ...item, quantity: item.quantity + selectedQuantity } : item);
      return [...current, { ...selected, size: selectedSize, color: selectedColor, quantity: selectedQuantity }];
    });
    setSelected(null);
    setCartOpen(true);
  };
  const changeQuantity = (index: number, delta: number) => setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const submitDemo = (event: FormEvent<HTMLFormElement>, message: string) => {
    event.preventDefault();
    setFormMessage(message);
    event.currentTarget.reset();
  };
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
            id: item.id,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.authorizationUrl) {
        throw new Error(result.message || "Unable to start Paystack checkout.");
      }

      window.localStorage.setItem("dreams-kulture-last-paystack-reference", result.reference);
      window.location.href = result.authorizationUrl;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start Paystack checkout.");
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="mollee-site">
      <header className={`mol-header ${scrolled ? "mol-header--scrolled" : ""}`}>
        <div className="mol-header__inner">
          <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><span /><span /><span /></button>
          <Link className="mol-header__logo" href="/"><BrandLogo /></Link>
          <nav className={`mol-nav ${menuOpen ? "mol-nav--open" : ""}`} aria-label="Main navigation">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <a href="/men" onClick={() => setMenuOpen(false)}>Men</a>
            <a href="/women" onClick={() => setMenuOpen(false)}>Women</a>
            <a href="/couples" onClick={() => setMenuOpen(false)}>Couples</a>
            <a href="/gifts-home" onClick={() => setMenuOpen(false)}>Gifts & Home</a>
            <a href="#custom" onClick={() => setMenuOpen(false)}>Custom print</a>
          </nav>
          <div className="mol-header__actions">
            <button aria-label="Search"><img src="/mollee/search.svg" alt="" /></button>
            <button aria-label="Customer account"><img src="/mollee/user.svg" alt="" /></button>
            <button className="header-bag" onClick={() => setCartOpen(true)} aria-label={`Shopping bag with ${cartCount} items`}><img src="/mollee/shopping-bag.svg" alt="" /><span>{cartCount}</span></button>
          </div>
        </div>
      </header>

      <section className="mol-hero" id="home">
        <aside className="mol-hero__left">
          <div className="hero-count"><strong>{heroIndex + 1}</strong>/{heroSlides.length}</div>
          <div className="side-socials"><a href="#">FB</a><a href="#">X</a><a href="https://www.instagram.com/dreamskulture_/" target="_blank" rel="noreferrer" aria-label="Dreams Kulture on Instagram">INS</a><a href="#">PIN</a></div>
        </aside>
        <div className="mol-hero__center">
          {heroSlides.map((slide, index) => (
            <article key={slide.kicker} className={`hero-slide ${slide.className} ${heroIndex === index ? "is-active" : ""}`} aria-hidden={heroIndex !== index}>
              <div className="hero-slide__image"><img src={slide.image} alt="" /></div>
              <img className="hero-slide__dots" src="/mollee/vector-first-screen.svg" alt="" />
              <div className="hero-slide__content">
                <span className="category-subtitle"><b>{slide.kicker.split(" ")[0]}</b> {slide.kicker.split(" ").slice(1).join(" ")}</span>
                <h1>{slide.title}</h1>
                <a className="mol-button" href={index === 2 ? "#custom" : "#shop"}><span>{index === 2 ? "Start a request" : "Shop now"}</span></a>
              </div>
            </article>
          ))}
        </div>
        <aside className="mol-hero__right">
          <div className="hero-dots">{heroSlides.map((slide, index) => <button key={slide.kicker} className={heroIndex === index ? "active" : ""} onClick={() => setHeroIndex(index)} aria-label={`Show slide ${index + 1}`}><span /></button>)}</div>
          <div className="hero-arrows"><button onClick={() => changeHero(-1)} aria-label="Previous slide">←</button><button onClick={() => changeHero(1)} aria-label="Next slide">→</button></div>
          <a className="scroll-down" href="#collections"><span>Scroll down</span><i /></a>
        </aside>
      </section>

      <section className="collection-section page-wrap" id="collections">
        <img className="collection-section__dots collection-section__dots--left" src="/mollee/vector-collections.svg" alt="" />
        <div className="collection-stats" data-reveal><strong>09<span>+</span></strong><small>Faith-filled collections<br />made for every season</small></div>
        <div className="collection-mosaic">
          <article className="collection-tile collection-tile--one" data-reveal>
            <div className="collection-tile__image"><img src="/campaign/couple-connection.png" alt="Dreams Kulture Couples Collection" /></div>
            <div className="collection-tile__content"><span className="category-subtitle"><b>couples</b> collection</span><h2>Bound in faith.<br />Better together.</h2><a className="read-more" href="/couples">Shop the pair</a></div>
          </article>
          <article className="sale-tile" data-reveal>
            <img src="/campaign/faith-tees-rack.png" alt="Four Dreams Kulture faith T-shirts" />
            <div className="sale-tile__copy"><h2>Four truths</h2><p>Black, cream, army green and maroon—made to carry the message.</p><a className="read-more" href="#shop">Shop faith tees</a></div>
          </article>
          <article className="collection-tile collection-tile--two" data-reveal>
            <div className="collection-tile__image"><img src="/campaign/women-pray-boldly.png" alt="Dreams Kulture women’s Pray Boldly T-shirt" /></div>
            <div className="collection-tile__content"><span className="category-subtitle"><b>her</b> faith</span><h2>Soft strength.<br />Bold prayer.</h2><a className="read-more" href="/women">Shop women</a></div>
          </article>
          <article className="collection-tile collection-tile--three" data-reveal>
            <div className="collection-tile__image"><img src="/campaign/faith-at-home.png" alt="Dreams Kulture faith-inspired home collection" /></div>
            <div className="collection-tile__content"><span className="category-subtitle"><b>faith</b> at home</span><h2>Peace in<br />every room.</h2><a className="read-more" href="/gifts-home">Explore home</a></div>
          </article>
        </div>
        <div className="collection-stats collection-stats--right" data-reveal><strong>36<span>+</span></strong><small>States delivered<br />across Nigeria</small></div>
        <a className="mol-button collection-cta" href="#shop"><span>View all collections</span></a>
      </section>

      <section className="catalog-section page-wrap" id="shop">
        <div className="section-title" data-reveal><span className="category-subtitle"><b>new</b> collections</span><h2>Featured products</h2></div>
        <div className="product-tabs" ref={tabsRef} role="tablist" aria-label="Product categories">{categories.map((item) => <button role="tab" aria-selected={category === item} aria-controls="featured-products-grid" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="catalog-grid" id="featured-products-grid" role="tabpanel" aria-label={`${category} products`}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}</div>
        <img className="catalog-dots" src="/mollee/vector-catalog.svg" alt="" />
        <button className="mol-button catalog-more" onClick={() => setCategory("All")}><span>Show all products</span></button>
      </section>

      <section className="deal-section" id="custom">
        <div className="deal-section__inner">
          <div className="deal-section__image" data-reveal><img src="/campaign/faith-accessories.png" alt="Dreams Kulture faith accessories" /></div>
          <img className="deal-section__dots" src="/mollee/vector-deal.svg" alt="" />
          <div className="deal-section__content" data-reveal>
            <span className="category-subtitle"><b>custom</b> made</span>
            <h2>Faith for<br />every moment.</h2>
            <div className="deal-countdown"><div><strong>01</strong><span>idea</span></div><i>:</i><div><strong>03</strong><span>steps</span></div><i>:</i><div><strong>24</strong><span>hour reply</span></div></div>
            <p>Personalised apparel, mugs, totes, caps, journals and gift sets for people, churches, couples and celebrations.</p>
            <button className="mol-button" onClick={() => document.getElementById("custom-form")?.scrollIntoView({ behavior: "smooth" })}><span>Start your request</span></button>
          </div>
        </div>
      </section>

      <section className="advantages page-wrap" aria-label="Store benefits">
        {[
          ["advantages-icon_1.svg", "Nationwide delivery", "Carefully packed orders across all 36 states, with international shipping available."],
          ["advantages-icon_2.svg", "Personal support", "Real help for product choices, custom requests and delivery updates via WhatsApp."],
          ["advantages-icon_3.svg", "Made with intention", "Premium materials, considered details and faith-filled messages built to last."],
        ].map(([icon, title, text]) => <article key={title} data-reveal><img className="advantage-icon" src={`/mollee/${icon}`} alt="" /><h3>{title}</h3><span className="advantage-line" /><p>{text}</p><img className="advantage-dots" src="/mollee/vector-advantages.svg" alt="" /></article>)}
      </section>

      <section className="bestsellers page-wrap">
        <div className="section-title" data-reveal><span className="category-subtitle"><b>top</b> products</span><h2>Best sellers at Dreams Kulture</h2><p>Pieces our community returns to—designed to carry truth with quiet confidence.</p></div>
        <div className="bestseller-grid">{products.slice(1, 4).map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}</div>
      </section>

      <section className="custom-form-section page-wrap" id="custom-form">
        <div className="custom-form-copy" data-reveal><span className="category-subtitle"><b>tell us</b> your idea</span><h2>Something made<br />just for you.</h2><p>Share the product, quantity, message and occasion. Our team will review the details and send a tailored quote.</p></div>
        <form className="mol-form" onSubmit={(event) => submitDemo(event, "Thank you—your custom request is in. Our team will reply with a quote within one business day.")} data-reveal>
          <div className="field-grid"><label>Full name<input required placeholder="Your name" /></label><label>Phone / WhatsApp<input required type="tel" placeholder="+234" /></label></div>
          <div className="field-grid"><label>Product<select required defaultValue=""><option value="" disabled>Select a product</option><option>Shirts & T-shirts</option><option>Hoodies</option><option>Couples Collection</option><option>Mugs & coffee sets</option><option>Tote bags & caps</option><option>Journals & home gifts</option></select></label><label>Quantity<input type="number" min="1" defaultValue="1" required /></label></div>
          <label>Email address<input required type="email" placeholder="you@example.com" /></label>
          <label>Describe the idea<textarea required rows={4} placeholder="Message, colours, sizes, event date and any details that matter…" /></label>
          <label className="file-field"><input type="file" accept="image/*,.pdf" /><span>＋</span><b>Add a logo or reference file</b><small>PNG, JPG or PDF · up to 10MB</small></label>
          <button className="mol-button" type="submit"><span>Request a quote</span></button>
        </form>
      </section>

      <section className="journal page-wrap" id="journal">
        <div className="section-title" data-reveal><span className="category-subtitle">our <b>journal</b></span><h2>Stories behind the message</h2><p>Style, faith and thoughtful gifting—notes from the Dreams Kulture community.</p></div>
        <div className="journal-grid">
          <article data-reveal><div className="journal-image"><img src="/campaign/couple-connection.png" alt="Dreams Kulture Couples Collection" /></div><div className="journal-card"><h3>Faith, friendship and the cord of three</h3><time>July 27, 2026</time><a className="read-more" href="/couples">Read story</a></div></article>
          <article data-reveal><div className="journal-image"><img src="/campaign/faith-at-home.png" alt="Dreams Kulture faith-inspired home collection" /></div><div className="journal-card"><h3>Creating a home filled with gentle reminders</h3><time>July 24, 2026</time><a className="read-more" href="#shop">Read story</a></div></article>
        </div>
      </section>

      <section className="newsletter" id="contact">
        <div className="newsletter__inner page-wrap" data-reveal>
          <div><span className="category-subtitle"><b>stay</b> inspired</span><h2>Join the culture</h2><p>Be first to hear about new drops, meaningful stories and special offers.</p></div>
          <form onSubmit={(event) => submitDemo(event, "You’re on the list. Your 10% welcome code is DREAM10.")}><label><span>Email address</span><input required type="email" placeholder="Enter your email" /></label><button aria-label="Subscribe">→</button></form>
        </div>
      </section>

      <footer className="mol-footer">
        <img className="footer-dots footer-dots--left" src="/mollee/vector-footer-left.svg" alt="" />
        <img className="footer-dots footer-dots--right" src="/mollee/vector-footer-right.svg" alt="" />
        <div className="mol-footer__top page-wrap">
          <div className="footer-brand"><BrandLogo /><p>Faith-inspired apparel, prints and gifts—designed in Nigeria, delivered worldwide.</p><div className="footer-socials"><a href="#">FB</a><a href="#">X</a><a href="https://www.instagram.com/dreamskulture_/" target="_blank" rel="noreferrer" aria-label="Dreams Kulture on Instagram">INS</a><a href="#">PIN</a></div></div>
          <div className="footer-links"><div><h3>About</h3><a href="#collections">Collections</a><a href="#shop">Shop</a><a href="#journal">Journal</a><a href="#contact">Contact us</a></div><div><h3>Useful links</h3><a href="#">Privacy policy</a><a href="#">Terms of use</a><a href="#">Shipping details</a><a href="#">FAQs</a></div></div>
          <div className="footer-contact"><h3>Visit & contact</h3><p>Lagos, Nigeria<br />Mon–Sat, 9am–6pm</p><a href="mailto:hello@dreamskulture.com">hello@dreamskulture.com</a><a href="https://wa.me/2348104268019" target="_blank" rel="noreferrer">+234 810 426 8019 · WhatsApp</a><a href="https://www.instagram.com/dreamskulture_/" target="_blank" rel="noreferrer">@dreamskulture_ · Instagram</a></div>
        </div>
        <div className="mol-footer__bottom page-wrap"><span>© 2026 Dreams Kulture</span><span>Designed with faith + intention</span></div>
      </footer>

      {selected && <div className="overlay" role="dialog" aria-modal="true" aria-label={selected.name}><button className="overlay__backdrop" onClick={() => setSelected(null)} aria-label="Close product details" /><div className="product-modal"><button className="close-button" onClick={() => setSelected(null)} aria-label="Close">×</button><div className="product-modal__art"><ProductArtwork product={selected} /></div><div className="product-modal__content"><span className="category-subtitle"><b>{selected.category}</b></span><h2>{selected.name}</h2><strong className="product-price">{money(selected.price)}</strong><p>A premium everyday piece carrying a quiet reminder of truth. Thoughtfully finished for comfort, longevity and easy gifting.</p><blockquote>Inspired by {selected.scripture}</blockquote><fieldset><legend>Choose size</legend><div className="option-row">{selected.sizes.map((size) => <button type="button" key={size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></fieldset><fieldset><legend>Choose colour</legend><div className="option-row">{selected.colors.map((color) => <button type="button" key={color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)}>{color}</button>)}</div></fieldset><div className="add-row"><div className="quantity"><button onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}>−</button><span>{selectedQuantity}</span><button onClick={() => setSelectedQuantity(selectedQuantity + 1)}>＋</button></div><button className="mol-button" onClick={addToCart}><span>Add to bag · {money(selected.price * selectedQuantity)}</span></button></div><div className="product-facts"><span>Premium materials</span><span>2–4 day production</span><span>14-day returns</span></div></div></div></div>}

      {cartOpen && <div className="overlay overlay--cart" role="dialog" aria-modal="true" aria-label="Shopping bag"><button className="overlay__backdrop" onClick={() => setCartOpen(false)} aria-label="Close shopping bag" /><aside className="cart-panel"><header><div><span className="category-subtitle"><b>your</b> selection</span><h2>Shopping bag <small>({cartCount})</small></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close">×</button></header>{cart.length === 0 ? <div className="cart-empty"><p>Your bag is waiting for something meaningful.</p><button className="mol-button" onClick={() => setCartOpen(false)}><span>Explore the shop</span></button></div> : <><div className="cart-items">{cart.map((item, index) => <article className="cart-item" key={`${item.id}-${item.size}-${item.color}`}><div className="cart-item__art"><span>{item.message}</span></div><div><h3>{item.name}</h3><p>{item.color} · {item.size}</p><strong>{money(item.price)}</strong><div className="cart-item__actions"><div className="quantity quantity--small"><button onClick={() => changeQuantity(index, -1)}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(index, 1)}>＋</button></div><button onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div></div></article>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Estimated delivery</span><strong>{delivery === 0 ? "Free" : money(delivery)}</strong></div><div className="cart-total"><span>Total</span><strong>{money(subtotal + delivery)}</strong></div><p>Taxes and international shipping are calculated at checkout.</p><button className="mol-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}><span>Proceed to checkout</span></button></div></>}</aside></div>}

      {checkoutOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="Checkout"><button className="overlay__backdrop" onClick={() => !checkoutLoading && setCheckoutOpen(false)} aria-label="Close checkout" /><div className="checkout-modal"><button className="close-button" onClick={() => setCheckoutOpen(false)} disabled={checkoutLoading}>×</button><div className="checkout-head"><span className="category-subtitle"><b>paystack</b> checkout</span><h2>Delivery details</h2><p>Guest checkout · Cards, bank transfer and USSD through Paystack.</p></div><form className="checkout-form" onSubmit={submitCheckout}><div className="field-grid"><label>First name<input name="firstName" required /></label><label>Last name<input name="lastName" required /></label></div><label>Email<input name="email" required type="email" /></label><label>Phone number<input name="phone" required type="tel" placeholder="+234" /></label><label>Country<select name="country" required defaultValue="Nigeria"><option>Nigeria</option><option>Ghana</option><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Other international</option></select></label><label>Delivery address<input name="address" required placeholder="Street address" /></label><div className="field-grid"><label>City<input name="city" required /></label><label>State / region<input name="state" required /></label></div><div className="checkout-total"><span>Order total</span><strong>{money(subtotal + delivery)}</strong></div><label className="terms"><input type="checkbox" required /> I agree to the store terms, shipping and return policy.</label>{checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}<button className="mol-button" type="submit" disabled={checkoutLoading || cart.length === 0}><span>{checkoutLoading ? "Connecting to Paystack…" : "Pay securely with Paystack"}</span></button><small>Your order is only confirmed after Paystack verifies the payment.</small></form></div></div>}

      {formMessage && <div className="toast" role="status"><p>{formMessage}</p><button onClick={() => setFormMessage("")} aria-label="Dismiss message">×</button></div>}
      <a className="whatsapp-float" href="https://wa.me/2348104268019" target="_blank" rel="noreferrer" aria-label="Shop with Dreams Kulture on WhatsApp"><span>◉</span><b>WhatsApp</b></a>
    </main>
  );
}
