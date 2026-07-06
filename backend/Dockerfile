# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Dependency installer
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS deps

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to optimize Docker layer caching
COPY package*.json ./

# Install only production dependencies (excluding devDependencies)
# Running npm ci in a clean environment builds/downloads correct binaries (e.g. sharp)
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Production image
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS production

# Set environment variables for production execution
ENV NODE_ENV=production

# Install all required external CLI tools via apt.
# Using --no-install-recommends and cleaning apt cache keeps the image as lean as possible.
# - imagemagick: For image manipulation (magick CLI, convert)
# - ghostscript: For PDF compression and optimization
# - libreoffice-nogui: Headless office converter, ~200MB smaller than standard libreoffice
# - python3, python3-pip: Python interpreter and pip (required for background removal scripts, etc.)
# - ffmpeg: For future audio/video processing
# - tesseract-ocr: For OCR (tesseract)
# - poppler-utils: For PDF page extract/rendering (pdftoppm, pdfimages)
# - wget, curl: For network requests and health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
      imagemagick \
      ghostscript \
      libreoffice-nogui \
      python3 \
      python3-pip \
      ffmpeg \
      tesseract-ocr \
      poppler-utils \
      wget \
      curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ImageMagick compatibility symlink:
# Debian Bookworm's imagemagick package installs "convert" (ImageMagick 6).
# If the "magick" binary (ImageMagick 7 standard) is not present, we create
# a symlink pointing to "convert" so that IMAGEMAGICK_COMMAND=magick works seamlessly.
RUN if ! command -v magick > /dev/null 2>&1; then \
      ln -s "$(command -v convert)" /usr/local/bin/magick; \
    fi

# Set working directory for application
WORKDIR /app

# Copy built node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source files
COPY . .

# Ensure runtime upload and download directories exist and are writable
RUN mkdir -p src/uploads src/downloads src/scripts && \
    chown -R node:node src/uploads src/downloads src/scripts

# Switch execution to the non-root 'node' user for security
USER node

# Expose port for Render (typically sets PORT dynamic environment variable)
EXPOSE 5000

# Health check to ensure Express application is responsive.
# We escape the $ to prevent build-time interpolation so it resolves $PORT at runtime.
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- "http://localhost:\${PORT:-5000}/health" || exit 1

# Start the application using the existing npm start script
CMD ["npm", "start"]
