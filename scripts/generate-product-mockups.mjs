import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "products");
mkdirSync(outDir, { recursive: true });

const products = [
  {
    file: "not-forsaken-sweatshirt.svg",
    type: "sweatshirt",
    garment: "#111827",
    ink: "#ffffff",
    accent: "#d8b56d",
    title: "NOT",
    headline: "FORSAKEN",
    scripture: "DEUTERONOMY 31:8",
  },
  {
    file: "just-a-girl-faith-shirt.svg",
    type: "shirt",
    garment: "#f8fafc",
    ink: "#111827",
    accent: "#31584a",
    title: "Just a Girl",
    headline: "DECIDED TO LIVE BY FAITH",
    scripture: "2 CORINTHIANS 5:7",
  },
  {
    file: "gods-masterpiece-sweatshirt.svg",
    type: "sweatshirt",
    garment: "#c979a9",
    ink: "#ffffff",
    accent: "#f6d7e6",
    title: "God’s",
    headline: "MASTERPIECE",
    scripture: "EPHESIANS 2:10",
  },
  {
    file: "be-the-light-sweatshirt.svg",
    type: "sweatshirt",
    garment: "#7b1e35",
    ink: "#fff7f1",
    accent: "#f1c1c8",
    title: "be the",
    headline: "LIGHT",
    scripture: "MATTHEW 5:14",
  },
  {
    file: "walk-by-faith-sweatshirt.svg",
    type: "sweatshirt",
    garment: "#d8bea1",
    ink: "#111827",
    accent: "#6e4f35",
    title: "WALK BY FAITH",
    headline: "NOT BY SIGHT",
    scripture: "2 CORINTHIANS 5:7",
  },
  {
    file: "be-salty-stay-lit-sweatshirt.svg",
    type: "sweatshirt",
    garment: "#151515",
    ink: "#ffffff",
    accent: "#a3a3a3",
    title: "BE SALTY",
    headline: "STAY LIT",
    scripture: "MATTHEW 5:13–14",
  },
  {
    file: "let-god-carry-it-sweatshirt.svg",
    type: "sweatshirt",
    garment: "#111111",
    ink: "#ffffff",
    accent: "#dad7cd",
    title: "Let God",
    headline: "CARRY IT",
    scripture: "PSALM 55:22",
  },
  {
    file: "faith-everyday-cap.svg",
    type: "cap",
    garment: "#111111",
    ink: "#ffffff",
    accent: "#6b7f45",
    title: "FAITH",
    headline: "EVERYDAY",
    scripture: "HEBREWS 11:1",
  },
  {
    file: "grace-for-today-mug.svg",
    type: "mug",
    garment: "#fafafa",
    ink: "#111827",
    accent: "#c0392b",
    title: "GRACE",
    headline: "FOR TODAY",
    scripture: "LAMENTATIONS 3:23",
  },
  {
    file: "let-god-lead-tote.svg",
    type: "tote",
    garment: "#161616",
    ink: "#ffffff",
    accent: "#d8c4a6",
    title: "LET GOD",
    headline: "LEAD",
    scripture: "PROVERBS 3:6",
  },
  {
    file: "write-the-vision-journal.svg",
    type: "journal",
    garment: "#6e1f35",
    ink: "#ffffff",
    accent: "#e8d7bd",
    title: "WRITE",
    headline: "THE VISION",
    scripture: "HABAKKUK 2:2",
  },
];

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function garmentShape(product) {
  if (product.type === "shirt") {
    return `
      <path d="M218 225 L308 166 H400 L492 225 L455 313 L426 296 V670 H282 V296 L255 313 Z" fill="${product.garment}" filter="url(#softShadow)"/>
      <path d="M328 168 Q354 214 400 214 Q446 214 472 168" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="7"/>
    `;
  }
  if (product.type === "cap") {
    return `
      <path d="M222 398 Q260 272 397 272 Q534 272 574 398 Q481 434 397 434 Q313 434 222 398 Z" fill="${product.garment}" filter="url(#softShadow)"/>
      <path d="M306 418 Q430 388 626 452 Q489 493 332 467 Q250 453 186 421 Q234 405 306 418 Z" fill="${product.garment}"/>
    `;
  }
  if (product.type === "mug") {
    return `
      <rect x="245" y="220" width="270" height="360" rx="38" fill="${product.garment}" filter="url(#softShadow)"/>
      <path d="M512 310 H572 C650 310 650 490 572 490 H512" fill="none" stroke="${product.garment}" stroke-width="45" stroke-linecap="round"/>
      <ellipse cx="380" cy="221" rx="122" ry="30" fill="#fff" opacity=".65"/>
    `;
  }
  if (product.type === "tote") {
    return `
      <path d="M238 256 H520 L548 644 H210 Z" fill="${product.garment}" filter="url(#softShadow)"/>
      <path d="M304 260 C310 140 455 140 464 260" fill="none" stroke="${product.garment}" stroke-width="25" stroke-linecap="round"/>
    `;
  }
  if (product.type === "journal") {
    return `
      <rect x="240" y="155" width="310" height="505" rx="20" fill="${product.garment}" filter="url(#softShadow)"/>
      <path d="M286 155 V660" stroke="rgba(255,255,255,.18)" stroke-width="5"/>
      <path d="M525 185 V630" stroke="${product.accent}" stroke-width="2" opacity=".65"/>
    `;
  }
  return `
    <path d="M210 246 L288 174 H512 L590 246 L548 358 L506 336 V668 H294 V336 L252 358 Z" fill="${product.garment}" filter="url(#softShadow)"/>
    <path d="M326 176 Q352 224 400 224 Q448 224 474 176" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="9"/>
    <path d="M294 430 Q400 456 506 430" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="5"/>
  `;
}

function textBlock(product) {
  const y = product.type === "cap" ? 378 : product.type === "journal" ? 330 : product.type === "mug" ? 368 : 388;
  const titleSize = product.title.length > 14 ? 30 : 38;
  const headlineSize = product.headline.length > 18 ? 31 : 43;

  return `
    <g text-anchor="middle">
      <text x="400" y="${y - 52}" fill="${product.accent}" font-family="Georgia, serif" font-size="${titleSize}" font-style="italic" font-weight="700">${esc(product.title)}</text>
      <text x="400" y="${y}" fill="${product.ink}" font-family="Arial, Helvetica, sans-serif" font-size="${headlineSize}" font-weight="900" letter-spacing="3">${esc(product.headline)}</text>
      <line x1="315" y1="${y + 28}" x2="485" y2="${y + 28}" stroke="${product.accent}" stroke-width="3" opacity=".8"/>
      <text x="400" y="${y + 62}" fill="${product.ink}" opacity=".9" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="3">${esc(product.scripture)}</text>
    </g>
  `;
}

for (const product of products) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 800 1000" role="img" aria-label="${esc(product.title)} ${esc(product.headline)}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f9f6ef"/>
        <stop offset="1" stop-color="#e7ded2"/>
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="30" stdDeviation="24" flood-color="#000" flood-opacity=".18"/>
      </filter>
      <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.4" fill="#111" opacity=".12"/>
      </pattern>
    </defs>
    <rect width="800" height="1000" fill="url(#bg)"/>
    <rect x="42" y="42" width="716" height="916" fill="url(#dots)" opacity=".65"/>
    <text x="82" y="890" fill="#111" opacity=".18" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="900" letter-spacing="10" transform="rotate(-90 82 890)">DREAMS KULTURE</text>
    ${garmentShape(product)}
    ${textBlock(product)}
    <text x="400" y="910" text-anchor="middle" fill="#111" opacity=".5" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="7">FAITH-BASED ESSENTIALS</text>
  </svg>`;

  writeFileSync(join(outDir, product.file), svg);
}
