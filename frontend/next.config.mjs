import os from 'os';

const getLocalIps = () => {
  const interfaces = os.networkInterfaces();
  const ips = ['localhost', '127.0.0.1'];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
        ips.push(`${iface.address}:3000`);
      }
    }
  }
  return ips;
};

const localIps = getLocalIps();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: process.env.NODE_ENV === "production",
  allowedDevOrigins: localIps,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  turbopack: {
    // Fixes "Next.js inferred your workspace root" warning caused by
    // multiple package-lock.json files at C:\Users\Jmpan\ and this project.
    root: 'C:/Users/Jmpan/OneDrive/Desktop/Image Converter/frontend',
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    // In development, skip the strict CSP so local tool testing is not blocked.
    // In production, apply the full strict Content-Security-Policy.
    const securityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
    ];

    if (isProd) {
      const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://www.google.com https://www.gstatic.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: blob: https://image-converter-web-app.onrender.com https://*.google.com https://*.googleusercontent.com https://*.googlesyndication.com https://*.doubleclick.net;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://image-converter-web-app.onrender.com https://pagead2.googlesyndication.com https://*.google.com https://*.doubleclick.net;
        frame-src 'self' https://*.google.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
        media-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
      `.replace(/\s{2,}/g, ' ').trim();
      securityHeaders.push({ key: "Content-Security-Policy", value: cspHeader });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/CG.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
