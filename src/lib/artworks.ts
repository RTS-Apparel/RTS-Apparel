// Bespoke classic-luxury SVG data URI artworks for RTS Apparel products and hero banners.
// Designed for the White + Black + Gold luxury theme.

function createGarmentSvg(config: {
  title: string;
  subtitle: string;
  urduTitle: string;
  accentColor: string;
  garmentFill: string;
  silhouette: "kurta" | "shirt" | "trouser" | "hoodie" | "jacket";
}): string {
  const { title, subtitle, urduTitle, accentColor, garmentFill, silhouette } =
    config;

  let pathMarkup = "";
  if (silhouette === "kurta") {
    pathMarkup = `
      <g stroke="${accentColor}" stroke-width="2.2" fill="${garmentFill}">
        <path d="M235 120 L275 100 L325 100 L365 120 L425 220 L390 245 L360 185 L360 470 L240 470 L240 185 L210 245 L175 220 Z" />
        <path d="M275 100 Q300 118 325 100" fill="none" stroke-width="3" />
        <line x1="300" y1="112" x2="300" y2="255" stroke="${accentColor}" stroke-width="2.5" />
        <rect x="288" y="125" width="24" height="125" fill="none" stroke="${accentColor}" stroke-opacity="0.65" stroke-dasharray="4 3" />
        <circle cx="300" cy="145" r="3" fill="${accentColor}" />
        <circle cx="300" cy="175" r="3" fill="${accentColor}" />
        <circle cx="300" cy="205" r="3" fill="${accentColor}" />
        <circle cx="300" cy="235" r="3" fill="${accentColor}" />
        <rect x="318" y="185" width="28" height="32" fill="none" stroke="${accentColor}" stroke-opacity="0.7" />
      </g>
    `;
  } else if (silhouette === "shirt") {
    pathMarkup = `
      <g stroke="${accentColor}" stroke-width="2.2" fill="${garmentFill}">
        <path d="M230 130 L270 105 L330 105 L370 130 L430 240 L392 260 L358 190 L358 430 L242 430 L242 190 L208 260 L170 240 Z" />
        <polygon points="270,105 300,145 282,162 258,122" fill="rgba(201,168,76,0.22)" />
        <polygon points="330,105 300,145 318,162 342,122" fill="rgba(201,168,76,0.22)" />
        <line x1="300" y1="145" x2="300" y2="430" stroke="${accentColor}" stroke-opacity="0.8" />
        <circle cx="300" cy="185" r="2.8" fill="${accentColor}" />
        <circle cx="300" cy="230" r="2.8" fill="${accentColor}" />
        <circle cx="300" cy="275" r="2.8" fill="${accentColor}" />
        <circle cx="300" cy="320" r="2.8" fill="${accentColor}" />
        <circle cx="300" cy="365" r="2.8" fill="${accentColor}" />
      </g>
    `;
  } else if (silhouette === "trouser") {
    pathMarkup = `
      <g stroke="${accentColor}" stroke-width="2.2" fill="${garmentFill}">
        <path d="M235 115 L365 115 L380 455 L322 455 L300 235 L278 455 L220 455 Z" />
        <rect x="235" y="115" width="130" height="24" fill="rgba(201,168,76,0.2)" />
        <line x1="300" y1="115" x2="300" y2="215" stroke="${accentColor}" />
        <line x1="262" y1="139" x2="255" y2="455" stroke="${accentColor}" stroke-opacity="0.45" stroke-dasharray="6 4" />
        <line x1="338" y1="139" x2="345" y2="455" stroke="${accentColor}" stroke-opacity="0.45" stroke-dasharray="6 4" />
        <rect x="288" y="121" width="24" height="12" fill="none" stroke="${accentColor}" />
      </g>
    `;
  } else if (silhouette === "hoodie") {
    pathMarkup = `
      <g stroke="${accentColor}" stroke-width="2.2" fill="${garmentFill}">
        <path d="M255 125 Q300 72 345 125" fill="rgba(201,168,76,0.16)" />
        <path d="M225 130 L260 120 L340 120 L375 130 L435 265 L395 282 L362 200 L362 430 L238 430 L238 200 L205 282 L165 265 Z" />
        <polygon points="258,325 342,325 356,395 244,395" fill="rgba(201,168,76,0.12)" stroke="${accentColor}" stroke-opacity="0.7" />
        <line x1="286" y1="132" x2="286" y2="205" stroke="${accentColor}" stroke-width="2" />
        <line x1="314" y1="132" x2="314" y2="205" stroke="${accentColor}" stroke-width="2" />
      </g>
    `;
  } else if (silhouette === "jacket") {
    pathMarkup = `
      <g stroke="${accentColor}" stroke-width="2.4" fill="${garmentFill}">
        <path d="M220 128 L268 104 L332 104 L380 128 L438 265 L396 285 L364 195 L364 435 L236 435 L236 195 L204 285 L162 265 Z" />
        <polygon points="268,104 300,210 252,185" fill="rgba(201,168,76,0.22)" />
        <polygon points="332,104 300,210 348,185" fill="rgba(201,168,76,0.22)" />
        <line x1="300" y1="210" x2="300" y2="435" stroke="${accentColor}" stroke-width="2.8" />
        <line x1="252" y1="320" x2="285" y2="335" stroke="${accentColor}" />
        <line x1="348" y1="320" x2="315" y2="335" stroke="${accentColor}" />
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <radialGradient id="glow" cx="50%" cy="42%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
        <stop offset="65%" stop-color="#F5F4F0" stop-opacity="1" />
        <stop offset="100%" stop-color="#EAE4D7" stop-opacity="1" />
      </radialGradient>
      <linearGradient id="frame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.7" />
        <stop offset="50%" stop-color="#E8E0D0" stop-opacity="0.9" />
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.7" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#glow)" />
    <rect x="28" y="24" width="744" height="552" rx="8" fill="none" stroke="url(#frame)" stroke-width="1.5" />
    <text x="56" y="64" fill="#9B7B2F" font-family="Georgia, serif" font-size="13" font-weight="bold" letter-spacing="4">RTS APPAREL ATELIER</text>
    <text x="744" y="64" fill="#4A4A4A" font-family="serif" font-size="16" text-anchor="end">${urduTitle}</text>
    <g transform="translate(100, -10)">
      ${pathMarkup}
    </g>
    <line x1="56" y1="496" x2="744" y2="496" stroke="#E8E0D0" stroke-width="1.5" />
    <text x="56" y="528" fill="#1A1A1A" font-family="Georgia, serif" font-size="21" font-weight="bold">${title}</text>
    <text x="56" y="554" fill="#4A4A4A" font-family="sans-serif" font-size="12" letter-spacing="2">${subtitle.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createBannerSvg(config: {
  accent: string;
  garmentFill: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 720" width="1600" height="720">
    <defs>
      <radialGradient id="bgGlow" cx="65%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
        <stop offset="60%" stop-color="#F5F4F0" stop-opacity="1" />
        <stop offset="100%" stop-color="#E8E0D0" stop-opacity="1" />
      </radialGradient>
    </defs>
    <rect width="1600" height="720" fill="url(#bgGlow)" />
    <g stroke="${config.accent}" stroke-opacity="0.35" fill="none">
      <circle cx="800" cy="360" r="260" stroke-width="1.5" />
      <circle cx="800" cy="360" r="325" stroke-width="1" stroke-dasharray="8 6" />
    </g>
    <g transform="translate(500, 45) scale(1.0)" stroke="${config.accent}" stroke-width="2.5" fill="${config.garmentFill}">
      <path d="M235 120 L275 100 L325 100 L365 120 L425 220 L390 245 L360 185 L360 520 L240 520 L240 185 L210 245 L175 220 Z" />
      <line x1="300" y1="112" x2="300" y2="275" stroke="${config.accent}" stroke-width="3" />
      <rect x="286" y="125" width="28" height="140" fill="none" stroke="${config.accent}" stroke-opacity="0.65" stroke-dasharray="4 3" />
      <circle cx="300" cy="150" r="3.5" fill="${config.accent}" />
      <circle cx="300" cy="185" r="3.5" fill="${config.accent}" />
      <circle cx="300" cy="220" r="3.5" fill="${config.accent}" />
    </g>
    <rect x="40" y="40" width="1520" height="640" fill="none" stroke="${config.accent}" stroke-opacity="0.45" stroke-width="1.5" />
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRODUCT_ARTWORKS = {
  kurtaObsidian: createGarmentSvg({
    title: "Obsidian Zari Karandi Kurta",
    subtitle: "Bespoke Festive Collection · Hand-Embroidered Placket",
    urduTitle: "شاہی سیاہ کرنڈی کرتہ شلوار",
    accentColor: "#C9A84C",
    garmentFill: "#1A1A1A",
    silhouette: "kurta",
  }),
  kurtaEmerald: createGarmentSvg({
    title: "Imperial Emerald Boski Kurta Set",
    subtitle: "Spun Silk Blend · Tailored Cuff & Collar",
    urduTitle: "زمرد بوسکی کرتہ شلوار",
    accentColor: "#C9A84C",
    garmentFill: "#143328",
    silhouette: "kurta",
  }),
  kurtaIvory: createGarmentSvg({
    title: "Sovereign Ivory Tilla Kurta Shalwar",
    subtitle: "Egyptian Giza Cotton · Tone-on-Gold Threadwork",
    urduTitle: "سفید طلا کڑھائی کرتہ",
    accentColor: "#9B7B2F",
    garmentFill: "#FAF8F2",
    silhouette: "kurta",
  }),
  shirtOnyx: createGarmentSvg({
    title: "Noir Giza Cotton Dress Shirt",
    subtitle: "Two-Ply 120s Egyptian Cotton · Gold Mother-of-Pearl Buttons",
    urduTitle: "سیاہ مصری کاٹن ڈریس شرٹ",
    accentColor: "#C9A84C",
    garmentFill: "#1A1A1A",
    silhouette: "shirt",
  }),
  shirtOxford: createGarmentSvg({
    title: "Savile Charcoal Tailored Oxford",
    subtitle: "Structured Spread Collar · Wrinkle-Resistant Weave",
    urduTitle: "چارکول ٹیلرڈ آکسفورڈ شرٹ",
    accentColor: "#C9A84C",
    garmentFill: "#2C3036",
    silhouette: "shirt",
  }),
  trouserGurkha: createGarmentSvg({
    title: "Sartorial Double-Pleat Gurkha Trousers",
    subtitle: "Italian Wool Blend · Brass Buckle Side Adjusters",
    urduTitle: "اطالوی وول گورکھا ٹراؤزر",
    accentColor: "#C9A84C",
    garmentFill: "#23211E",
    silhouette: "trouser",
  }),
  trouserChino: createGarmentSvg({
    title: "Obsidian Stretch Tailored Chinos",
    subtitle: "Peached Pima Cotton Twill · Tapered Cut",
    urduTitle: "پریمیم ٹیلرڈ چینو ٹراؤزر",
    accentColor: "#C9A84C",
    garmentFill: "#1F2328",
    silhouette: "trouser",
  }),
  hoodieMonolith: createGarmentSvg({
    title: "Monolith 480GSM Heavyweight Hoodie",
    subtitle: "Combed Loopback French Terry · Antique Brass Tips",
    urduTitle: "ہیوی ویٹ لگژری ہوڈی",
    accentColor: "#C9A84C",
    garmentFill: "#1A1A1A",
    silhouette: "hoodie",
  }),
  jacketSuede: createGarmentSvg({
    title: "Mayfair Lambskin Suede Bomber Jacket",
    subtitle: "Full-Grain Goat Suede · Satin Quilted Lining",
    urduTitle: "لیدر سويڈ بمبر جیکٹ",
    accentColor: "#C9A84C",
    garmentFill: "#2A1F18",
    silhouette: "jacket",
  }),
  jacketRacer: createGarmentSvg({
    title: "Vanguard Matte Onyx Leather Jacket",
    subtitle: "Hand-Waxed Nappa Leather · Brushed Gold Zippers",
    urduTitle: "ناپا لیدر رائیڈر جیکٹ",
    accentColor: "#C9A84C",
    garmentFill: "#1A1A1A",
    silhouette: "jacket",
  }),
  bannerFestive: createBannerSvg({
    accent: "#C9A84C",
    garmentFill: "#1A1A1A",
  }),
  bannerSartorial: createBannerSvg({
    accent: "#9B7B2F",
    garmentFill: "#26221E",
  }),
  get shirtWhite() {
    return this.shirtOnyx;
  },
  get shirtNavy() {
    return this.shirtOxford;
  },
  get shawlPashmina() {
    return this.hoodieMonolith;
  },
};

