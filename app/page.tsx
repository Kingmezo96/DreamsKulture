"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = {
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

type CartItem = Product & { size: string; color: string; quantity: number };

const products: Product[] = [
  { id: 1, name: "Walk by Faith Shirt", category: "Shirts", collection: "Faith Tees", price: 20, message: "WALK BY FAITH", scripture: "2 Corinthians 5:7", tone: "chalk", image: "/campaign/faith-tees-rack.png", badge: "new", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Cream", "Army Green", "Maroon"] },
  { id: 2, name: "Pray Boldly Tee", category: "T-Shirts", collection: "Women", price: 25, message: "PRAY BOLDLY", scripture: "1 Thessalonians 5:17", tone: "ink", image: "/campaign/women-pray-boldly.png", badge: "top", sizes: ["S", "M", "L", "XL"], colors: ["Army Green", "Cream", "Black"] },
  { id: 3, name: "The Way Hoodie", category: "Hoodies", collection: "Men", price: 25, message: "THE WAY", scripture: "John 14:6", tone: "clay", image: "/campaign/men-the-way.png", badge: "new", sizes: ["S", "M", "L", "XL"], colors: ["Maroon", "Black", "Ash"] },
  { id: 4, name: "Cord of Three Tee", category: "T-Shirts", collection: "Couple Connection", price: 25, message: "CORD OF THREE", scripture: "Ecclesiastes 4:12", tone: "paper", image: "/campaign/couple-connection.png", sizes: ["S", "M", "L", "XL"], colors: ["Cream", "Cocoa"] },
  { id: 5, name: "Better Together Tee", category: "T-Shirts", collection: "Couple Connection", price: 25, message: "BETTER TOGETHER", scripture: "Ecclesiastes 4:12", tone: "mist", image: "/campaign/couple-connection.png", sizes: ["S", "M", "L", "XL"], colors: ["Cocoa", "Cream"] },
  { id: 6, name: "Grace for Today Mug", category: "Mugs", collection: "Gifts & Home", price: 10, message: "GRACE FOR TODAY", scripture: "Lamentations 3:23", tone: "stone", image: "/campaign/faith-accessories.png", sizes: ["12 oz"], colors: ["Cream", "White"] },
  { id: 7, name: "Let God Lead Tote", category: "Tote Bags", collection: "Gifts & Home", price: 12, message: "LET GOD LEAD", scripture: "Proverbs 3:6", tone: "gift", image: "/campaign/faith-accessories.png", badge: "top", sizes: ["One size"], colors: ["Black", "Natural"] },
  { id: 8, name: "Faith Everyday Cap", category: "Caps", collection: "Gifts & Home", price: 9, message: "FAITH", scripture: "Hebrews 11:1", tone: "linen", image: "/campaign/faith-accessories.png", sizes: ["Adjustable"], colors: ["Army Green", "Black"] },
  { id: 9, name: "Coffee & Grace Set", category: "Gift Sets", collection: "Gifts & Home", price: 30, message: "COFFEE & GRACE", scripture: "Psalm 90:14", tone: "stone", image: "/campaign/faith-accessories.png", badge: "sale", sizes: ["Gift set"], colors: ["Ivory & Sage"] },
  { id: 10, name: "Peace, Be Still Cushion", category: "Home", collection: "Gifts & Home", price: 20, message: "PEACE, BE STILL", scripture: "Mark 4:39", tone: "paper", image: "/campaign/faith-at-home.png", sizes: ["18 × 18 in"], colors: ["Cream", "Sage"] },
  { id: 11, name: "Write the Vision Journal", category: "Journals", collection: "Gifts & Home", price: 12, message: "WRITE THE VISION", scripture: "Habakkuk 2:2", tone: "clay", image: "/campaign/faith-at-home.png", sizes: ["A5"], colors: ["Maroon", "Cream"] },
];

const heroSlides = [
  { kicker: "faith tees", title: <>Wear the word.<br />Live the message.</>, image: "/campaign/faith-tees-rack.png", className: "hero-slide--shopping" },
  { kicker: "couple connection", title: <>Faith together.<br />Love connected.</>, image: "/campaign/couple-connection.png", className: "hero-slide--gifting" },
  { kicker: "gifts with meaning", title: <>Small reminders.<br />Lasting truth.</>, image: "/campaign/faith-accessories.png", className: "hero-slide--accessories" },
];

const categories = ["All", "Couple Connection", "Women", "Men", "Faith Tees", "Gifts & Home"];
const money = (value: number) => `$${value.toFixed(2)}`;

function BrandLogo({ light = false }: { light?: boolean }) {
  return <img className={`dk-logo ${light ? "dk-logo--light" : ""}`} src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />;
}

function ProductArtwork({ product }: { product: Product }) {
  return (
    <div className={`product-art product-art--${product.tone} product-art--photo`}>
      <img src={product.image} alt={`${product.name} product campaign`} />
      <span className="product-art__caption"><b>{product.message}</b><small>{product.scripture}</small></span>
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
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
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
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const visibleProducts = useMemo(() => products.filter((product) => {
    if (category === "All") return true;
    return product.collection === category;
  }), [category]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= 75 ? 0 : 8;

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

  return (
    <main className="mollee-site">
      <header className={`mol-header ${scrolled ? "mol-header--scrolled" : ""}`}>
        <div className="mol-header__inner">
          <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><span /><span /><span /></button>
          <a className="mol-header__logo" href="#home"><BrandLogo /></a>
          <nav className={`mol-nav ${menuOpen ? "mol-nav--open" : ""}`} aria-label="Main navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
            <a href="#custom" onClick={() => setMenuOpen(false)}>Custom print</a>
            <a href="#journal" onClick={() => setMenuOpen(false)}>Journal</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
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
            <div className="collection-tile__image"><img src="/campaign/couple-connection.png" alt="Dreams Kulture Couple Connection collection" /></div>
            <span className="collection-tile__giant">couples</span>
            <div className="collection-tile__content"><span className="category-subtitle"><b>couple</b> connection</span><h2>Bound in faith.<br />Better together.</h2><a className="read-more" href="#shop">Shop the pair</a></div>
          </article>
          <article className="sale-tile" data-reveal>
            <img src="/campaign/faith-tees-rack.png" alt="Four Dreams Kulture faith T-shirts" />
            <div className="sale-tile__border"><div><h2>four <strong>truths</strong></h2><p>Black, cream, army green and maroon—made to carry the message.</p><a className="read-more read-more--light" href="#shop">Shop faith tees</a></div></div>
          </article>
          <article className="collection-tile collection-tile--two" data-reveal>
            <div className="collection-tile__image"><img src="/campaign/women-pray-boldly.png" alt="Dreams Kulture women’s Pray Boldly T-shirt" /></div>
            <span className="collection-tile__giant">women</span>
            <div className="collection-tile__content"><span className="category-subtitle"><b>her</b> faith</span><h2>Soft strength.<br />Bold prayer.</h2><a className="read-more" href="#shop">Shop women</a></div>
          </article>
          <article className="collection-tile collection-tile--three" data-reveal>
            <div className="collection-tile__image"><img src="/campaign/faith-at-home.png" alt="Dreams Kulture faith-inspired home collection" /></div>
            <span className="collection-tile__giant">home</span>
            <div className="collection-tile__content"><span className="category-subtitle"><b>faith</b> at home</span><h2>Peace in<br />every room.</h2><a className="read-more" href="#shop">Explore home</a></div>
          </article>
        </div>
        <div className="collection-stats collection-stats--right" data-reveal><strong>36<span>+</span></strong><small>States delivered<br />across Nigeria</small></div>
        <a className="mol-button collection-cta" href="#shop"><span>View all collections</span></a>
      </section>

      <section className="catalog-section page-wrap" id="shop">
        <div className="section-title" data-reveal><span className="category-subtitle"><b>new</b> collections</span><h2>Featured products</h2></div>
        <div className="product-tabs" role="tablist" aria-label="Product categories">{categories.map((item) => <button role="tab" aria-selected={category === item} key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="catalog-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}</div>
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
          <div className="field-grid"><label>Product<select required defaultValue=""><option value="" disabled>Select a product</option><option>Shirts & T-shirts</option><option>Hoodies</option><option>Couple Connection</option><option>Mugs & coffee sets</option><option>Tote bags & caps</option><option>Journals & home gifts</option></select></label><label>Quantity<input type="number" min="1" defaultValue="1" required /></label></div>
          <label>Email address<input required type="email" placeholder="you@example.com" /></label>
          <label>Describe the idea<textarea required rows={4} placeholder="Message, colours, sizes, event date and any details that matter…" /></label>
          <label className="file-field"><input type="file" accept="image/*,.pdf" /><span>＋</span><b>Add a logo or reference file</b><small>PNG, JPG or PDF · up to 10MB</small></label>
          <button className="mol-button" type="submit"><span>Request a quote</span></button>
        </form>
      </section>

      <section className="journal page-wrap" id="journal">
        <div className="section-title" data-reveal><span className="category-subtitle">our <b>journal</b></span><h2>Stories behind the message</h2><p>Style, faith and thoughtful gifting—notes from the Dreams Kulture community.</p></div>
        <div className="journal-grid">
          <article data-reveal><div className="journal-image"><img src="/campaign/couple-connection.png" alt="Dreams Kulture Couple Connection collection" /></div><div className="journal-card"><h3>Faith, friendship and the cord of three</h3><time>July 27, 2026</time><a className="read-more" href="#collections">Read story</a></div></article>
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

      {checkoutOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="Checkout"><button className="overlay__backdrop" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout" /><div className="checkout-modal"><button className="close-button" onClick={() => setCheckoutOpen(false)}>×</button>{orderPlaced ? <div className="order-success"><span>✓</span><p className="category-subtitle"><b>order</b> received</p><h2>Thank you for<br />choosing meaning.</h2><p>Your confirmation number is <b>DK-260727</b>. We have sent the next steps to your email.</p><button className="mol-button" onClick={() => { setCheckoutOpen(false); setOrderPlaced(false); setCart([]); }}><span>Continue shopping</span></button></div> : <><div className="checkout-head"><span className="category-subtitle"><b>secure</b> checkout</span><h2>Delivery details</h2><p>Guest checkout · Cards and bank transfer accepted</p></div><form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setOrderPlaced(true); }}><div className="field-grid"><label>First name<input required /></label><label>Last name<input required /></label></div><label>Email<input required type="email" /></label><label>Phone number<input required type="tel" /></label><label>Country<select required defaultValue="Nigeria"><option>Nigeria</option><option>Ghana</option><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Other international</option></select></label><label>Delivery address<input required placeholder="Street address" /></label><div className="field-grid"><label>City<input required /></label><label>State / region<input required /></label></div><div className="checkout-total"><span>Order total</span><strong>{money(subtotal + delivery)}</strong></div><label className="terms"><input type="checkbox" required /> I agree to the store terms, shipping and return policy.</label><button className="mol-button" type="submit"><span>Place demo order securely</span></button><small>This preview does not collect or charge payment details.</small></form></>}</div></div>}

      {formMessage && <div className="toast" role="status"><p>{formMessage}</p><button onClick={() => setFormMessage("")} aria-label="Dismiss message">×</button></div>}
      <a className="whatsapp-float" href="https://wa.me/2348104268019" target="_blank" rel="noreferrer" aria-label="Shop with Dreams Kulture on WhatsApp"><span>◉</span><b>WhatsApp</b></a>
    </main>
  );
}
