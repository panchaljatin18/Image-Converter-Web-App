# Image Converter — Backend API

Production-ready Node.js + Express backend for the Image Converter web application.  
Supports **Sharp** (native) and **ImageMagick** (CLI) for images, **LibreOffice** for documents, and **Python** for script-based tasks.  
Fully cross-platform: runs on **Windows**, **Linux**, **macOS**, and **Docker/Render**.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Image processing | Sharp + ImageMagick 7 |
| Document conversion | LibreOffice (soffice) |
| Scripting | Python 3 |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Upload | Multer |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.js              ← All env variables resolved here
│   ├── controllers/
│   │   ├── convertController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── upload.js
│   │   ├── validation.js
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── convertRoutes.js
│   │   ├── authRoutes.js
│   │   └── ...
│   ├── services/
│   │   ├── imageService.js         ← Sharp (pure Node — no binary)
│   │   ├── imageMagickService.js   ← ImageMagick CLI (fallback)
│   │   ├── documentService.js      ← LibreOffice CLI
│   │   └── pythonService.js        ← Python scripts
│   ├── utils/
│   │   └── shell.js                ← Promisified exec (used by services only)
│   ├── app.js
│   └── server.js
├── Dockerfile
├── .dockerignore
├── .env.example
└── package.json
```

---

## Local Development

### Prerequisites

- **Node.js 20+**
- **ImageMagick 7** — [imagemagick.org](https://imagemagick.org/script/download.php)
- **LibreOffice** — [libreoffice.org](https://www.libreoffice.org/download/)
- **Python 3** — [python.org](https://www.python.org/downloads/)
- **MongoDB** (local or Atlas)

### Setup

```bash
# 1. Clone and install
cd backend
npm install

# 2. Copy and fill in your environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# 3. Start the development server
npm run dev
```

The server starts on `http://localhost:5000`.

### Environment Variables for Tools

| Variable | Default | Description |
|---|---|---|
| `IMAGEMAGICK_COMMAND` | `magick` | ImageMagick CLI command |
| `LIBREOFFICE_COMMAND` | `soffice` | LibreOffice CLI command |
| `PYTHON_COMMAND` | `python3` | Python binary name |

> **Windows users:** If your Python is `python` (not `python3`), set `PYTHON_COMMAND=python` in your `.env`.

---

## Docker

### Build

```bash
cd backend
docker build -t image-converter-backend .
```

### Run

```bash
docker run -p 5000:5000 \
  -e MONGO_URI="your_mongo_connection_string" \
  -e JWT_SECRET="your_secret" \
  -e CORS_ORIGIN="http://localhost:3000" \
  image-converter-backend
```

### Docker Compose (recommended for local full-stack)

```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=${CORS_ORIGIN}
      - IMAGEMAGICK_COMMAND=magick
      - LIBREOFFICE_COMMAND=soffice
      - PYTHON_COMMAND=python3
    volumes:
      - uploads_data:/app/src/uploads
      - downloads_data:/app/src/downloads

volumes:
  uploads_data:
  downloads_data:
```

---

## Deploying on Render

### Step 1 — Create a new Web Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`

### Step 2 — Configure the service

| Setting | Value |
|---|---|
| **Environment** | Docker |
| **Dockerfile Path** | `./Dockerfile` |
| **Build Command** | *(leave blank — Docker handles it)* |
| **Start Command** | *(leave blank — Docker CMD handles it)* |

### Step 3 — Set Environment Variables

In the Render dashboard → **Environment** tab, add:

```
NODE_ENV=production
PORT=5000
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<long random string>
CORS_ORIGIN=https://your-frontend.vercel.app
IMAGEMAGICK_COMMAND=magick
LIBREOFFICE_COMMAND=soffice
PYTHON_COMMAND=python3
```

> ImageMagick, LibreOffice, and Python3 are automatically installed inside the Docker container — **no extra setup needed on Render**.

### Step 4 — Deploy

Click **Create Web Service**. Render will build the Docker image and deploy automatically.

**Health check endpoint:** `GET /health`  
Render uses this to verify the service is running.

---

## API Reference

### Image Conversion

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/convert/jpg-to-png` | Convert JPG → PNG |
| POST | `/api/convert/png-to-jpg` | Convert PNG → JPG |
| POST | `/api/convert/webp-to-jpg` | Convert WebP → JPG |
| POST | `/api/convert/jpg-to-webp` | Convert JPG → WebP |
| POST | `/api/convert/compress-image` | Compress (reduce file size) |
| POST | `/api/convert/resize-image` | Resize (width/height) |
| POST | `/api/convert/crop-image` | Crop (x/y/w/h) |
| POST | `/api/convert/convert` | Generic: any format → any format |

All endpoints accept `multipart/form-data` with field name `image`.

**Generic convert body fields:**
```
targetFormat=bmp    (or heic, tiff, avif, png, webp, …)
quality=85          (optional, 1-100)
```

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (requires Bearer token) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

---

## Cross-Platform Notes

| Platform | ImageMagick | LibreOffice | Python |
|---|---|---|---|
| Windows | `magick` (IM7 installer) | `soffice` in PATH | `python` or `python3` |
| Linux | `magick` (apt) | `soffice` (apt) | `python3` (apt) |
| Docker | `magick` (Dockerfile apt) | `soffice` (Dockerfile apt) | `python3` (Dockerfile apt) |
| Render | ✅ automatic via Docker | ✅ automatic | ✅ automatic |

---

## License

ISC
