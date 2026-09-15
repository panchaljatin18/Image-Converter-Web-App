import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public/png-to-avif.webp");

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#0f0f1a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#080811" stop-opacity="1"/>
    </radialGradient>

    <!-- Glowing accents -->
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>

    <linearGradient id="avifGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>

    <linearGradient id="pngGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>

    <!-- Checkerboard pattern for PNG icon -->
    <pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#1e293b"/>
      <rect x="8" width="8" height="8" fill="#334155"/>
      <rect y="8" width="8" height="8" fill="#334155"/>
      <rect x="8" y="8" width="8" height="8" fill="#1e293b"/>
    </pattern>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGlow)"/>

  <!-- Subtle circuit grid lines -->
  <path d="M 100 100 L 300 100 L 400 200 M 800 150 L 950 150 L 1050 250 M 150 500 L 280 500 L 360 420 M 850 480 L 1000 480" 
        stroke="rgba(99, 102, 241, 0.12)" stroke-width="2" fill="none"/>

  <!-- Title Header -->
  <text x="600" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', sans-serif" 
        font-size="64" font-weight="900" fill="#f8fafc" text-anchor="middle" letter-spacing="-1">
    PNG to AVIF
  </text>
  <text x="600" y="160" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', sans-serif" 
        font-size="24" font-weight="500" fill="#94a3b8" text-anchor="middle">
    Free Online Converter · Up to 90% Smaller · 100% In-Browser WASM
  </text>

  <!-- LEFT CARD: PNG File -->
  <g transform="translate(180, 220)">
    <!-- Card Frame -->
    <rect x="0" y="0" width="220" height="290" rx="24" fill="#141426" stroke="#38bdf8" stroke-width="3" opacity="0.9"/>
    
    <!-- Cut corner effect -->
    <path d="M 160 0 L 220 60 L 220 0 Z" fill="#0f0f1a"/>
    <path d="M 160 0 L 160 60 L 220 60" fill="none" stroke="#38bdf8" stroke-width="3"/>
    
    <!-- Transparent Checkerboard Graphic in center -->
    <rect x="25" y="30" width="170" height="150" rx="14" fill="url(#checker)"/>
    
    <!-- Inner Badge -->
    <rect x="15" y="195" width="190" height="68" rx="16" fill="url(#pngGrad)"/>
    <text x="110" y="243" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="34" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1">
      PNG
    </text>
  </g>

  <!-- CENTER CONVERT CIRCLE WITH GLOW -->
  <g transform="translate(600, 365)">
    <!-- Outer ambient glow circle -->
    <circle cx="0" cy="0" r="85" fill="rgba(99, 102, 241, 0.15)" filter="url(#glow)"/>
    <circle cx="0" cy="0" r="65" fill="#1a1a2e" stroke="url(#primaryGrad)" stroke-width="3"/>
    
    <!-- Dual curved refresh/convert arrows -->
    <path d="M -30 -10 A 32 32 0 0 1 20 -24 L 14 -34 M 20 -24 L 10 -14" 
          stroke="#818cf8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 30 10 A 32 32 0 0 1 -20 24 L -14 34 M -20 24 L -10 14" 
          stroke="#06b6d4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

    <!-- Rocket Icon Center -->
    <text x="0" y="8" font-size="28" text-anchor="middle">🚀</text>
  </g>

  <!-- RIGHT CARD: AVIF File -->
  <g transform="translate(800, 220)">
    <!-- Card Frame -->
    <rect x="0" y="0" width="220" height="290" rx="24" fill="#141426" stroke="#10b981" stroke-width="3" opacity="0.9"/>
    
    <!-- Cut corner effect -->
    <path d="M 160 0 L 220 60 L 220 0 Z" fill="#0f0f1a"/>
    <path d="M 160 0 L 160 60 L 220 60" fill="none" stroke="#10b981" stroke-width="3"/>
    
    <!-- Futuristic graphic inside card -->
    <rect x="25" y="30" width="170" height="150" rx="14" fill="#064e3b" opacity="0.5"/>
    <text x="110" y="95" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="14" font-weight="700" fill="#34d399" text-anchor="middle" letter-spacing="1.5">
      NEXT-GEN
    </text>
    <text x="110" y="125" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="22" font-weight="900" fill="#a7f3d0" text-anchor="middle">
      AV1 CODEC
    </text>
    <text x="110" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="12" font-weight="600" fill="#6ee7b7" text-anchor="middle">
      -90% FILE SIZE
    </text>

    <!-- Inner Badge -->
    <rect x="15" y="195" width="190" height="68" rx="16" fill="url(#avifGrad)"/>
    <text x="110" y="243" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="34" font-weight="900" fill="#064e3b" text-anchor="middle" letter-spacing="1">
      AVIF
    </text>
  </g>

  <!-- Bottom Brand Footer -->
  <text x="600" y="585" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="15" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="2">
    CONVERTGALAXY.COM · 100% PRIVATE &amp; SECURE
  </text>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(outputPath);
  console.log("Successfully generated /png-to-avif.webp at", outputPath);
}

generate().catch(console.error);
