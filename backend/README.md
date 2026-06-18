# Image Converter API Backend

A production-ready Node.js & Express.js REST API for image processing, conversion, compression, resizing, and cropping. Powered by **Sharp** and secured with **Helmet**, **CORS**, and **Rate Limiting**.

---

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Image Library:** Sharp
* **File Uploader:** Multer
* **Security:** Helmet, CORS, Express Rate Limit
* **Logger:** Morgan

---

## Directory Structure
```text
backend/
├── src/
│   ├── controllers/
│   │   └── convertController.js   # API Endpoint Handlers
│   ├── routes/
│   │   └── convertRoutes.js       # Router mapping routes to controllers
│   ├── middleware/
│   │   ├── upload.js              # Multer configuration & validations
│   │   ├── validation.js          # Crop & Resize input validations
│   │   └── errorHandler.js        # Global error handling & temp file cleanup
│   ├── services/
│   │   └── imageService.js        # Core Sharp image processing logic
│   ├── uploads/                   # Temporary upload directory (auto-created)
│   ├── downloads/                 # Processed output directory (auto-created)
│   ├── app.js                     # Express app setup & middlewares
│   └── server.js                  # Entry server startup file
├── .env                           # Environment variables
├── package.json                   # Project scripts and dependencies
└── README.md                      # API documentation
```

---

## Installation & Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Review or edit the `.env` file in the root of the `backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   MAX_FILE_SIZE=20971520
   ```

4. **Run in development mode (with nodemon auto-restart):**
   ```bash
   npm run dev
   ```

5. **Run in production mode:**
   ```bash
   npm start
   ```

---

## API Endpoints

All conversion/processing endpoints accept a `multipart/form-data` request with the image file attached to the `image` field.

### 1. JPG to PNG
* **Endpoint:** `POST /api/convert/jpg-to-png`
* **Content-Type:** `multipart/form-data`
* **Form Body:**
  * `image`: `File` (JPG/JPEG format)

### 2. PNG to JPG
* **Endpoint:** `POST /api/convert/png-to-jpg`
* **Content-Type:** `multipart/form-data`
* **Form Body:**
  * `image`: `File` (PNG format)

### 3. WEBP to JPG
* **Endpoint:** `POST /api/convert/webp-to-jpg`
* **Content-Type:** `multipart/form-data`
* **Form Body:**
  * `image`: `File` (WEBP format)

### 4. JPG to WEBP
* **Endpoint:** `POST /api/convert/jpg-to-webp`
* **Content-Type:** `multipart/form-data`
* **Form Body:**
  * `image`: `File` (JPG/JPEG format)

### 5. Compress Image
* **Endpoint:** `POST /api/convert/compress-image`
* **Content-Type:** `multipart/form-data`
* **Form Body:**
  * `image`: `File` (JPG, PNG, or WEBP format)
  * `quality`: `Number` (Optional, 1-100, default is 75)

### 6. Resize Image
* **Endpoint:** `POST /api/convert/resize-image`
* **Content-Type:** `multipart/form-data`
* **Form Body:**
  * `image`: `File` (JPG, PNG, or WEBP format)
  * `width`: `Number` (Optional, pixel width)
  * `height`: `Number` (Optional, pixel height)
  *(Note: At least one of `width` or `height` must be specified)*

### 7. Crop Image
* **Endpoint:** `POST /api/convert/crop-image`
* **Content-Type:** `multipart/form-data`
* **Form Body:**
  * `image`: `File` (JPG, PNG, or WEBP format)
  * `width`: `Number` (Required, crop area width)
  * `height`: `Number` (Required, crop area height)
  * `left`: `Number` (Required, X offset from top-left)
  * `top`: `Number` (Required, Y offset from top-left)

---

## Response Formats

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Image converted successfully",
  "downloadUrl": "/downloads/image-name-1781203498.png"
}
```

### Error Response (400 Bad Request / 500 Internal Error)
```json
{
  "success": false,
  "message": "Invalid file format. Only JPG, PNG, and WEBP formats are supported."
}
```

---

## Frontend Integration Example (Next.js)

```javascript
const handleImageConversion = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:5000/api/convert/jpg-to-png", {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      const downloadLink = `http://localhost:5000${data.downloadUrl}`;
      console.log("Converted image url:", downloadLink);
      // Trigger download or display image
    } else {
      console.error("Conversion failed:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
```

---

## Health & Monitoring
* **Health Check URL:** `GET /health`
* **Response:**
  ```json
  {
    "status": "OK",
    "uptime": 124.52
  }
  ```
