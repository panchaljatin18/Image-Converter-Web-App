import { getApiUrl } from "./apiUrl";

export interface UploadOptions {
  targetFormat: string;
  options?: any;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export async function processFileWithBackend(file: File, config: UploadOptions): Promise<void> {
  const API_URL = getApiUrl();
  const rawSourceFormat = file.name.split(".").pop()?.toLowerCase() || "";
  // Normalize jpeg → jpg so routing conditions work consistently for both .jpg and .jpeg files
  const sourceFormat = rawSourceFormat === "jpeg" ? "jpg" : rawSourceFormat;
  const targetFormat = config.targetFormat.toLowerCase().trim();

  // 1. Determine correct backend endpoint
  let endpoint = `${API_URL}/api/convert/convert`; // generic convert fallback

  if (config.options?.crop) {
    endpoint = `${API_URL}/api/convert/crop-image`;
  } else if (config.options?.width || config.options?.height) {
    endpoint = `${API_URL}/api/convert/resize-image`;
  } else if (config.options?.quality !== undefined && (targetFormat === sourceFormat || targetFormat === "compress")) {
    endpoint = `${API_URL}/api/convert/compress-image`;
  } else {
    // Map specific conversion endpoints
    if (sourceFormat === "png" && (targetFormat === "jpg" || targetFormat === "jpeg")) {
      endpoint = `${API_URL}/api/convert/png-to-jpg`;
    } else if ((sourceFormat === "jpg" || sourceFormat === "jpeg") && targetFormat === "png") {
      endpoint = `${API_URL}/api/convert/jpg-to-png`;
    } else if (sourceFormat === "webp" && (targetFormat === "jpg" || targetFormat === "jpeg")) {
      endpoint = `${API_URL}/api/convert/webp-to-jpg`;
    } else if ((sourceFormat === "jpg" || sourceFormat === "jpeg") && targetFormat === "webp") {
      endpoint = `${API_URL}/api/convert/jpg-to-webp`;
    }
  }

  // 2. Build FormData payload matching Express backend expectations
  const formData = new FormData();

  if (endpoint.endsWith("/crop-image")) {
    formData.append("image", file);
    formData.append("width", Math.round(config.options.crop.width).toString());
    formData.append("height", Math.round(config.options.crop.height).toString());
    formData.append("left", Math.round(config.options.crop.x).toString());
    formData.append("top", Math.round(config.options.crop.y).toString());
    // Forward target format so backend saves in correct format
    if (targetFormat) {
      formData.append("targetFormat", targetFormat);
    }
    // Forward quality
    if (config.options?.quality !== undefined) {
      const quality = Math.round(config.options.quality * 100);
      formData.append("quality", quality.toString());
    }
  } else if (endpoint.endsWith("/resize-image")) {
    formData.append("image", file);
    if (config.options.width) {
      formData.append("width", Math.round(config.options.width).toString());
    }
    if (config.options.height) {
      formData.append("height", Math.round(config.options.height).toString());
    }
    if (config.options?.quality !== undefined) {
      const quality = Math.round(config.options.quality * 100);
      formData.append("quality", quality.toString());
    }
    // Forward target format so backend can save in the right file format
    if (targetFormat) {
      formData.append("targetFormat", targetFormat);
    }
  } else if (endpoint.endsWith("/compress-image")) {
    formData.append("image", file);
    const quality = config.options.quality !== undefined
      ? Math.round(config.options.quality * 100)
      : 75;
    formData.append("quality", quality.toString());
    // Also forward max dimension if provided (used by ImageCompressorTool)
    if (config.options?.maxWidthOrHeight) {
      formData.append("maxWidthOrHeight", Math.round(config.options.maxWidthOrHeight).toString());
    }
  } else {
    // Generic or specific format conversions
    formData.append("image", file);
    formData.append("targetFormat", targetFormat);
    if (config.options?.quality !== undefined) {
      const quality = Math.round(config.options.quality * 100);
      formData.append("quality", quality.toString());
    }
    // Forward background color for conversions that need it (e.g., PNG→JPG, WebP→JPG)
    if (config.options?.bgColor) {
      formData.append("bgColor", config.options.bgColor);
    }
  }

  // 3. Send single POST request using XMLHttpRequest to support progress tracking
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    // Track upload progress up to 90%
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && config.onProgress) {
        const percent = Math.round((event.loaded / event.total) * 90);
        config.onProgress(percent);
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.downloadUrl) {
            const outputUrl = `${API_URL}${response.downloadUrl}`;

            if (config.onProgress) {
              config.onProgress(95);
            }

            // Retrieve output size via HEAD request (enabled by exposedHeaders on CORS)
            let outputSize: number | undefined;
            try {
              const headRes = await fetch(outputUrl, { method: "HEAD" });
              if (headRes.ok) {
                const contentLength = headRes.headers.get("content-length");
                if (contentLength) {
                  outputSize = parseInt(contentLength, 10);
                }
              }
            } catch (err) {
              console.warn("Could not determine output file size via HEAD request", err);
            }

            if (config.onProgress) {
              config.onProgress(100);
            }

            if (config.onSuccess) {
              config.onSuccess({
                outputUrl,
                outputSize,
                message: response.message,
              });
            }
            resolve();
          } else {
            const err = new Error(response.message || "Failed to process image file");
            if (config.onError) config.onError(err);
            reject(err);
          }
        } catch (e: any) {
          const err = new Error("Failed to parse response: " + e.message);
          if (config.onError) config.onError(err);
          reject(err);
        }
      } else {
        let errorMsg = `Upload failed with status: ${xhr.status}`;
        try {
          const errData = JSON.parse(xhr.responseText);
          if (errData && (errData.message || errData.error)) {
            errorMsg = errData.message || errData.error;
          }
        } catch (e) {}
        const err = new Error(errorMsg);
        if (config.onError) config.onError(err);
        reject(err);
      }
    };

    xhr.onerror = () => {
      const err = new Error("Network error occurred during file upload.");
      if (config.onError) config.onError(err);
      reject(err);
    };

    xhr.send(formData);
  });
}
