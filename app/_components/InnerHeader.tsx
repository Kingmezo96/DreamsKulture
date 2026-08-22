"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Couples", "/couples"],
  ["Gift & Homes", "/gifts-home"],
  ["Custom print", "/#custom"],
];

export default function InnerHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="mol-header mol-header--inner">
      <div className="mol-header__inner">
        <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
        <Link className="mol-header__logo" href="/" aria-label="Dreams Kulture home">
          <img className="dk-logo" src="/dream-kulture-logo-transparent-cropped.png" alt="Dreams Kulture" />
        </Link>
        <nav className={`mol-nav ${menuOpen ? "mol-nav--open" : ""}`} aria-label="Main navigation">
          {navigation.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
        </nav>
        <div className="mol-header__actions">
          <Link className="header-icon-link" href="/#shop" aria-label="Search products"><img src="/mollee/search.svg" alt="" /></Link>
          <Link className="header-icon-link" href="/" aria-label="Customer account"><img src="/mollee/user.svg" alt="" /></Link>
          <Link className="header-icon-link header-bag" href="/#shop" aria-label="Shopping bag with 0 items"><img src="/mollee/shopping-bag.svg" alt="" /><span>0</span></Link>
        </div>
      </div>
    </header>
  );
}
