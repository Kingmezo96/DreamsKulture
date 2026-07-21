"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  message: string;
  scripture: string;
  tone: string;
  badge?: string;
  sizes: string[];
  colors: string[];
};

type CartItem = Product & { size: string; color: string; quantity: number };

const products: Product[] = [
  { id: 1, name: "Walk by Faith Tee", category: "T-Shirts", price: 18500, message: "FAITH / OVER / FEAR", scripture: "2 Corinthians 5:7", tone: "chalk", badge: "Best seller", sizes: ["S", "M", "L", "XL"], colors: ["Black", "White", "Sand"] },
  { id: 2, name: "Created With Purpose", category: "Sweatshirts", price: 32000, message: "PURPOSE", scripture: "Ephesians 2:10", tone: "ink", badge: "New", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Ash"] },
  { id: 3, name: "Still I Rise Print", category: "Faith Prints", price: 12000, message: "GRACE\nFOUND ME", scripture: "Psalm 40:2", tone: "paper", sizes: ["A4", "A3", "A2"], colors: ["Mono", "Natural"] },
  { id: 4, name: "Morning Mercy Mug", category: "Mugs", price: 9500, message: "NEW MERCIES", scripture: "Lamentations 3:23", tone: "stone", sizes: ["350ml"], colors: ["White", "Black"] },
  { id: 5, name: "Prayer Notes Journal", category: "Notepads", price: 8500, message: "PRAY\nWRITE\nREPEAT", scripture: "Philippians 4:6", tone: "linen", sizes: ["A5"], colors: ["Black", "Ivory"] },
  { id: 6, name: "Grace Upon Grace Long Sleeve", category: "Long Sleeves", price: 24000, message: "GRACE²", scripture: "John 1:16", tone: "clay", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Cream"] },
  { id: 7, name: "Celebration Gift Box", category: "Gift Souvenirs", price: 42000, message: "CHOSEN", scripture: "1 Peter 2:9", tone: "gift", badge: "Limited", sizes: ["Classic", "Signature"], colors: ["Mono", "Cream"] },
  { id: 8, name: "Loved Beyond Measure Tee", category: "T-Shirts", price: 19500, message: "FULLY\nKNOWN.\nFULLY\nLOVED.", scripture: "Romans 8:39", tone: "mist", sizes: ["S", "M", "L", "XL"], colors: ["White", "Black", "Stone"] },
];

const categories = ["All", "T-Shirts", "Sweatshirts", "Long Sleeves", "Faith Prints", "Notepads", "Mugs", "Gift Souvenirs"];

const money = (value: number) => `₦${value.toLocaleString("en-NG")}`;

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-mark ${light ? "brand-mark--light" : ""}`} aria-label="Dreams Kulture">
      <img src={light ? "/dream-kulture-logo-dark.jpeg" : "/dream-kulture-logo-horizontal.jpeg"} alt="Dreams Kulture" />
    </span>
  );
}

function ProductArtwork({ product }: { product: Product }) {
  return (
    <div className={`product-art product-art--${product.tone}`}>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <span className="product-art__message">{product.message}</span>
      <span className="product-art__verse">{product.scripture}</span>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const inCategory = category === "All" || product.category === category;
      const query = search.toLowerCase().trim();
      return inCategory && (!query || `${product.name} ${product.category} ${product.message}`.toLowerCase().includes(query));
    });
    if (sort === "low") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...result].sort((a, b) => b.price - a.price);
    if (sort === "new") return [...result].sort((a, b) => b.id - a.id);
    return result;
  }, [category, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= 75000 ? 0 : 4500;

  const openProduct = (product: Product) => {
    setSelected(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setSelectedQuantity(1);
  };

  const addToCart = () => {
    if (!selected) return;
    const keyMatch = (item: CartItem) => item.id === selected.id && item.size === selectedSize && item.color === selectedColor;
    setCart((current) => {
      const existing = current.find(keyMatch);
      if (existing) return current.map((item) => keyMatch(item) ? { ...item, quantity: item.quantity + selectedQuantity } : item);
      return [...current, { ...selected, size: selectedSize, color: selectedColor, quantity: selectedQuantity }];
    });
    setSelected(null);
    setCartOpen(true);
  };

  const changeQuantity = (index: number, delta: number) => {
    setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const submitDemo = (event: FormEvent<HTMLFormElement>, message: string) => {
    event.preventDefault();
    setFormMessage(message);
    event.currentTarget.reset();
  };

  return (
    <main>
      <div className="announcement">Free delivery in Lagos on orders over ₦75,000 <span>Worldwide shipping available</span></div>
      <header className="site-header">
        <a href="#home" className="logo-link"><BrandMark /></a>
        <nav className={menuOpen ? "nav nav--open" : "nav"} aria-label="Main navigation">
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
          <a href="#custom" onClick={() => setMenuOpen(false)}>Custom print</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-actions">
          <button className="text-icon desktop-search" onClick={() => document.getElementById("product-search")?.focus()} aria-label="Search products">Search</button>
          <button className="text-icon" aria-label="Customer account">Account</button>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag with ${cartCount} items`}>Bag <span>{cartCount}</span></button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><span /><span /></button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero__content">
          <p className="eyebrow">Faith, thoughtfully worn</p>
          <h1>Carry the<br /><em>message.</em></h1>
          <p className="hero__copy">Modern apparel, prints and gifts created to make faith visible—in everyday moments and meaningful celebrations.</p>
          <div className="button-row">
            <a href="#shop" className="button button--dark">Shop the collection <span>↗</span></a>
            <a href="#custom" className="button button--text">Create something yours <span>→</span></a>
          </div>
          <div className="hero__note"><span>01</span><p>Designed in Nigeria<br />Delivered worldwide</p></div>
        </div>
        <div className="hero__image">
          <img src="/dream-kulture-shopping.jpg" alt="Dreams Kulture branded shopping bags" />
          <span className="vertical-note">Dreams worth sharing</span>
        </div>
      </section>

      <section className="promise-strip" aria-label="Store benefits">
        <span>Made with meaning</span><i>✦</i><span>Premium quality</span><i>✦</i><span>Nationwide delivery</span><i>✦</i><span>Secure checkout</span>
      </section>

      <section className="collections section" id="collections">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">Shop by feeling</p><h2>Find your<br /><em>daily reminder.</em></h2></div>
          <p>What we wear and give can say something true. Explore pieces made for quiet conviction, joyful celebration and everything between.</p>
        </div>
        <div className="collection-grid">
          <a href="#shop" className="collection-card collection-card--dark" onClick={() => setCategory("T-Shirts")}>
            <span className="collection-card__number">01</span><span className="collection-card__art">FAITH<br /><i>looks good</i><br />ON YOU</span><span className="collection-card__name">Apparel <b>→</b></span>
          </a>
          <a href="#shop" className="collection-card collection-card--image" onClick={() => setCategory("Gift Souvenirs")}>
            <img src="/dream-kulture-brand-wall.jpg" alt="Dreams Kulture gift presentation" /><span className="collection-card__name">Gifts & souvenirs <b>→</b></span>
          </a>
          <a href="#shop" className="collection-card collection-card--paper" onClick={() => setCategory("Faith Prints")}>
            <span className="collection-card__number">03</span><blockquote>“Set your mind on things above.”</blockquote><span className="collection-card__verse">Colossians 3:2</span><span className="collection-card__name">Prints & paper <b>→</b></span>
          </a>
        </div>
      </section>

      <section className="shop section" id="shop">
        <div className="section-heading shop-heading"><div><p className="eyebrow">The shop</p><h2>Made to <em>mean more.</em></h2></div><p>{filtered.length} pieces</p></div>
        <div className="shop-toolbar">
          <div className="category-tabs" role="tablist" aria-label="Product categories">
            {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); setVisibleCount(6); }}>{item}</button>)}
          </div>
          <div className="shop-tools">
            <label className="search-field"><span>⌕</span><input id="product-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" /></label>
            <label className="sort-field">Sort <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
          </div>
        </div>
        <div className="product-grid">
          {filtered.slice(0, visibleCount).map((product) => (
            <article className="product-card" key={product.id}>
              <button className="product-card__visual" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}><ProductArtwork product={product} /><span className="quick-add">Quick add +</span></button>
              <div className="product-card__info"><div><p>{product.category}</p><h3>{product.name}</h3></div><strong>{money(product.price)}</strong></div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-state">No pieces match that search. Try another word or collection.</div>}
        {visibleCount < filtered.length && <button className="button button--outline load-more" onClick={() => setVisibleCount((count) => count + 3)}>View more pieces</button>}
      </section>

      <section className="custom section" id="custom">
        <div className="custom__intro">
          <p className="eyebrow eyebrow--light">Your vision, made tangible</p>
          <h2>Custom prints<br />for <em>your moment.</em></h2>
          <p>Church events, celebrations, teams or thoughtful one-offs. Tell us what you have in mind and our team will bring it to life.</p>
          <ol><li><span>01</span>Choose your product</li><li><span>02</span>Share your idea</li><li><span>03</span>Approve & receive</li></ol>
        </div>
        <form className="custom-form" onSubmit={(event) => submitDemo(event, "Thank you—your custom request is in. Our team will reply with a quote within one business day.")}>
          <div className="form-heading"><span>Start your request</span><small>Usually replies within 24 hours</small></div>
          <div className="field-row"><label>What would you like to print?<select required><option value="">Select a product</option><option>T-shirts</option><option>Sweatshirts</option><option>Mugs</option><option>Notepads</option><option>Gift souvenirs</option><option>Other</option></select></label><label>Quantity<input type="number" min="1" defaultValue="1" required /></label></div>
          <div className="field-row"><label>Your name<input required placeholder="Full name" /></label><label>Phone / WhatsApp<input required type="tel" placeholder="+234" /></label></div>
          <label>Email address<input required type="email" placeholder="you@example.com" /></label>
          <label>Tell us about the idea<textarea required rows={4} placeholder="Message, colours, sizes, event date and any details that matter…" /></label>
          <label className="upload-field"><input type="file" accept="image/*,.pdf" /><span>＋</span><b>Add a logo or reference</b><small>PNG, JPG or PDF · up to 10MB</small></label>
          <button className="button button--dark" type="submit">Request a quote <span>↗</span></button>
        </form>
      </section>

      <section className="story section" id="story">
        <div className="story__image"><img src="/dream-kulture-brand-wall.jpg" alt="Dreams Kulture brand display" /><span>EST. NG</span></div>
        <div className="story__content"><p className="eyebrow">Our story</p><h2>More than a product.<br /><em>A conversation.</em></h2><p>Dreams Kulture began with a simple belief: the things around us can carry light. Every piece is thoughtfully created to help people express faith with confidence, beauty and authenticity.</p><p>Designed in Nigeria and made for people everywhere, our work brings timeless truth into modern culture.</p><a href="#contact" className="button button--text">Meet the heart behind the brand <span>→</span></a><blockquote>“Let your light shine before others.”<small>Matthew 5:16</small></blockquote></div>
      </section>

      <section className="testimonials section">
        <div className="section-heading"><p className="eyebrow">Notes from the community</p><h2>Loved, worn & <em>shared.</em></h2></div>
        <div className="testimonial-grid">
          <article><span>★★★★★</span><p>“The quality is beautiful, but it is the message that makes it special. My sweatshirt starts conversations everywhere I go.”</p><footer><b>Amara O.</b><small>Lagos · Verified buyer</small></footer></article>
          <article><span>★★★★★</span><p>“Dreams Kulture handled our church conference shirts so thoughtfully. Clean print, great fabric and delivered right on time.”</p><footer><b>Tobi A.</b><small>Abuja · Bulk order</small></footer></article>
          <article><span>★★★★★</span><p>“I sent a gift box to my sister in London. It arrived beautifully packed and felt deeply personal—even from miles away.”</p><footer><b>Nneka E.</b><small>Port Harcourt · Verified buyer</small></footer></article>
        </div>
      </section>

      <section className="delivery-banner">
        <div><p className="eyebrow eyebrow--light">From Nigeria, with purpose</p><h2>Near or far,<br />we deliver <em>meaning.</em></h2></div>
        <div className="delivery-stats"><p><strong>36</strong><span>States covered<br />across Nigeria</span></p><p><strong>20+</strong><span>Countries reached<br />worldwide</span></p><p><strong>3–7</strong><span>Business days<br />within Nigeria</span></p></div>
      </section>

      <section className="newsletter section" id="contact">
        <div><p className="eyebrow">Stay inspired</p><h2>A little faith<br />for your <em>inbox.</em></h2><p>New collections, meaningful stories and a welcome gift of 10% off your first order.</p></div>
        <form onSubmit={(event) => submitDemo(event, "You’re on the list. Your 10% welcome code is DREAM10.")}><label>Email address<input type="email" required placeholder="Enter your email" /></label><button className="button button--dark" type="submit">Join the culture <span>→</span></button><small>By subscribing, you agree to receive occasional emails. Unsubscribe anytime.</small></form>
      </section>

      <footer className="site-footer">
        <div className="footer-main"><div className="footer-brand"><BrandMark light /><p>Faith-inspired apparel, prints and gifts—designed in Nigeria, delivered worldwide.</p><div className="social-links"><a href="#" aria-label="Instagram">Instagram</a><a href="https://wa.me/2340000000000" aria-label="WhatsApp">WhatsApp</a></div></div><div><h3>Shop</h3><a href="#shop">New arrivals</a><a href="#shop">Best sellers</a><a href="#collections">Apparel</a><a href="#collections">Gifts & prints</a><a href="#custom">Custom printing</a></div><div><h3>Help</h3><a href="#contact">Contact us</a><a href="#contact">Shipping & delivery</a><a href="#contact">Returns & exchanges</a><a href="#contact">Size guide</a><a href="#contact">Track an order</a></div><div><h3>Visit & contact</h3><p>Lagos, Nigeria<br />Mon–Sat, 9am–6pm</p><a href="mailto:hello@dreamskulture.com">hello@dreamskulture.com</a><a href="https://wa.me/2340000000000">Chat on WhatsApp</a></div></div>
        <div className="footer-bottom"><span>© 2026 Dreams Kulture</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div><span>Made with faith + intention</span></div>
      </footer>

      {selected && <div className="overlay" role="dialog" aria-modal="true" aria-label={selected.name}><button className="overlay__backdrop" onClick={() => setSelected(null)} aria-label="Close product details" /><div className="product-modal"><button className="close-button" onClick={() => setSelected(null)} aria-label="Close">×</button><div className="product-modal__art"><ProductArtwork product={selected} /></div><div className="product-modal__content"><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><strong className="product-price">{money(selected.price)}</strong><p>A premium everyday piece carrying a quiet reminder of truth. Thoughtfully finished for comfort, longevity and easy gifting.</p><blockquote>Inspired by {selected.scripture}</blockquote><fieldset><legend>Choose size</legend><div className="option-row">{selected.sizes.map((size) => <button type="button" key={size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></fieldset><fieldset><legend>Choose colour</legend><div className="option-row">{selected.colors.map((color) => <button type="button" key={color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)}>{color}</button>)}</div></fieldset><div className="add-row"><div className="quantity"><button onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}>−</button><span>{selectedQuantity}</span><button onClick={() => setSelectedQuantity(selectedQuantity + 1)}>＋</button></div><button className="button button--dark" onClick={addToCart}>Add to bag · {money(selected.price * selectedQuantity)}</button></div><div className="product-facts"><span>Premium materials</span><span>2–4 day production</span><span>Easy 14-day returns</span></div></div></div></div>}

      {cartOpen && <div className="overlay overlay--cart" role="dialog" aria-modal="true" aria-label="Shopping bag"><button className="overlay__backdrop" onClick={() => setCartOpen(false)} aria-label="Close shopping bag" /><aside className="cart-panel"><header><div><p className="eyebrow">Your selection</p><h2>Shopping bag <span>({cartCount})</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close">×</button></header>{cart.length === 0 ? <div className="cart-empty"><p>Your bag is waiting for something meaningful.</p><button className="button button--dark" onClick={() => setCartOpen(false)}>Explore the shop</button></div> : <><div className="cart-items">{cart.map((item, index) => <article className="cart-item" key={`${item.id}-${item.size}-${item.color}`}><div className="cart-item__art"><span>{item.message}</span></div><div><h3>{item.name}</h3><p>{item.color} · {item.size}</p><strong>{money(item.price)}</strong><div className="cart-item__actions"><div className="quantity quantity--small"><button onClick={() => changeQuantity(index, -1)}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(index, 1)}>＋</button></div><button onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div></div></article>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Estimated delivery</span><strong>{delivery === 0 ? "Free" : money(delivery)}</strong></div><div className="cart-total"><span>Total</span><strong>{money(subtotal + delivery)}</strong></div><p>Taxes and international shipping are calculated at checkout.</p><button className="button button--dark" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Proceed to checkout <span>→</span></button></div></>}</aside></div>}

      {checkoutOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="Checkout"><button className="overlay__backdrop" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout" /><div className="checkout-modal"><button className="close-button" onClick={() => setCheckoutOpen(false)}>×</button>{orderPlaced ? <div className="order-success"><span>✓</span><p className="eyebrow">Order received</p><h2>Thank you for<br /><em>choosing meaning.</em></h2><p>Your confirmation number is <b>DK-260721</b>. We have sent the next steps to your email.</p><button className="button button--dark" onClick={() => { setCheckoutOpen(false); setOrderPlaced(false); setCart([]); }}>Continue shopping</button></div> : <><div className="checkout-head"><p className="eyebrow">Secure checkout</p><h2>Delivery details</h2><p>Guest checkout · Cards and bank transfer accepted</p></div><form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setOrderPlaced(true); }}><div className="field-row"><label>First name<input required /></label><label>Last name<input required /></label></div><label>Email<input required type="email" /></label><label>Phone number<input required type="tel" /></label><label>Country<select required defaultValue="Nigeria"><option>Nigeria</option><option>Ghana</option><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Other international</option></select></label><label>Delivery address<input required placeholder="Street address" /></label><div className="field-row"><label>City<input required /></label><label>State / region<input required /></label></div><div className="checkout-total"><span>Order total</span><strong>{money(subtotal + delivery)}</strong></div><label className="terms"><input type="checkbox" required /> I agree to the store terms, shipping and return policy.</label><button className="button button--dark" type="submit">Place demo order securely <span>→</span></button><small>This preview does not collect or charge payment details.</small></form></>}</div></div>}

      {formMessage && <div className="toast" role="status"><p>{formMessage}</p><button onClick={() => setFormMessage("")} aria-label="Dismiss message">×</button></div>}
      <a className="whatsapp-float" href="https://wa.me/2340000000000" aria-label="Shop with us on WhatsApp"><span>◉</span><b>WhatsApp</b></a>
    </main>
  );
}
