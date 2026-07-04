# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Dependency installer
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS deps

WORKDIR /app
COPY package*.json ./
# Install only production deps; devDependencies are not needed in the image
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Production image
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS production

# ── System packages ───────────────────────────────────────────────────────────
# Install all required external tools via apt.
# Adding --no-install-recommends keeps the image lean.
#
# imagemagick      → "magick" CLI, includes RAW (dcraw), HEIC, WebP, TIFF delegates
# ghostscript      → "gs" CLI for PDF optimization
# libreoffice      → "soffice" CLI for document conversions
# python3 pip      → Python 3 interpreter + package manager
# libvips-dev      → Native library required by Sharp (Node.js image processing)
# wget curl        → Used in HEALTHCHECK and for Render deploy hooks
RUN apt-get update && apt-get install -y --no-install-recommends \
      imagemagick \
      ghostscript \
      libreoffice \
      python3 \
      python3-pip \
      libvips-dev \
      ffmpeg \
      poppler-utils \
      tesseract-ocr \
      wget \
      curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ── ImageMagick compatibility symlink ─────────────────────────────────────────
# Debian/Ubuntu apt installs "convert" (IM 6) AND optionally "magick" (IM 7).
# If "magick" is not present, create a symlink so IMAGEMAGICK_COMMAND=magick works.
RUN if ! command -v magick > /dev/null 2>&1; then \
      ln -s "$(command -v convert)" /usr/local/bin/magick; \
    fi

# ── App files ─────────────────────────────────────────────────────────────────
WORKDIR /app

# Copy production node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# ── Runtime directories ───────────────────────────────────────────────────────
# Create uploads/downloads with correct ownership before switching user
RUN mkdir -p src/uploads src/downloads src/scripts && \
    chown -R node:node src/uploads src/downloads src/scripts

# ── Security: run as non-root ─────────────────────────────────────────────────
USER node

# ── Expose ────────────────────────────────────────────────────────────────────
EXPOSE 5000

# ── Health check ─────────────────────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-5000}/health" || exit 1

# ── Start ─────────────────────────────────────────────────────────────────────
CMD ["node", "src/server.js"]
