import { getApiUrl } from "./apiUrl";

export interface UploadOptions {
  targetFormat: string;
  options?: any;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

const BROWSER_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "bmp", "ico", "gif"];

/**
 * Fast client-side browser image processing using HTML5 Canvas.
 * Converts images in ~50ms directly on the user's device.
 */
async function processInBrowser(file: File, config: UploadOptions): Promise<boolean> {
  const rawSourceFormat = file.name.split(".").pop()?.toLowerCase() || "";
  const sourceFormat = rawSourceFormat === "jpeg" ? "jpg" : rawSourceFormat;
  const targetFormat = config.targetFormat.toLowerCase().trim();
  const cleanTarget = targetFormat === "jpeg" ? "jpg" : targetFormat;

  const isBrowserSource = BROWSER_IMAGE_FORMATS.includes(sourceFormat) || file.type.startsWith("image/");
  const isBrowserTarget = BROWSER_IMAGE_FORMATS.includes(cleanTarget) || cleanTarget === "compress";

  if (!isBrowserSource || !isBrowserTarget) {
    return false; // Fall back to server processing for documents / non-browser formats
  }

  return new Promise<boolean>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      try {
        if (config.onProgress) config.onProgress(30);

        let targetWidth = img.naturalWidth || 800;
        let targetHeight = img.naturalHeight || 600;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.naturalWidth || 800;
        let sourceHeight = img.naturalHeight || 600;

        // Handle resize option
        if (config.options?.width || config.options?.height) {
          targetWidth = config.options.width || Math.round((config.options.height / targetHeight) * targetWidth);
          targetHeight = config.options.height || Math.round((config.options.width / targetWidth) * targetHeight);
        }

        // Handle crop option
        if (config.options?.crop) {
          sourceX = Math.round(config.options.crop.x || 0);
          sourceY = Math.round(config.options.crop.y || 0);
          sourceWidth = Math.round(config.options.crop.width || targetWidth);
          sourceHeight = Math.round(config.options.crop.height || targetHeight);
          targetWidth = sourceWidth;
          targetHeight = sourceHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(false);
          return;
        }

        // Fill background color for JPEG / non-alpha formats
        if (cleanTarget === "jpg" || cleanTarget === "jpeg") {
          ctx.fillStyle = config.options?.bgColor || "#FFFFFF";
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

        if (config.onProgress) config.onProgress(70);

        // Target MIME & Quality
        let mimeType = "image/png";
        if (cleanTarget === "jpg" || cleanTarget === "jpeg") mimeType = "image/jpeg";
        else if (cleanTarget === "webp") mimeType = "image/webp";

        const quality = config.options?.quality !== undefined ? config.options.quality : 0.92;

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              resolve(false);
              return;
            }

            const outputBlobUrl = URL.createObjectURL(blob);

            if (config.onProgress) config.onProgress(100);

            if (config.onSuccess) {
              config.onSuccess({
                outputUrl: outputBlobUrl,
                outputSize: blob.size,
                message: "Converted instantly in browser",
              });
            }
            resolve(true);
          },
          mimeType,
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        resolve(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };

    img.src = objectUrl;
  });
}

export async function processFileWithBackend(file: File, config: UploadOptions): Promise<void> {
  // 1. Try instant in-browser client conversion first for supported image formats
  try {
    const successInBrowser = await processInBrowser(file, config);
    if (successInBrowser) {
      return;
    }
  } catch (err) {
    console.warn("In-browser processing failed, falling back to server:", err);
  }

  // 2. Server-side conversion via local Next.js /api/jobs or Express API
  const API_URL = getApiUrl();
  const rawSourceFormat = file.name.split(".").pop()?.toLowerCase() || "";
  const sourceFormat = rawSourceFormat === "jpeg" ? "jpg" : rawSourceFormat;
  const targetFormat = config.targetFormat.toLowerCase().trim();

  // Build FormData payload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("image", file);
  formData.append("targetFormat", targetFormat);

  if (config.options) {
    if (config.options.width) formData.append("width", config.options.width.toString());
    if (config.options.height) formData.append("height", config.options.height.toString());
    if (config.options.quality !== undefined) formData.append("quality", Math.round(config.options.quality * 100).toString());
    if (config.options.crop) {
      formData.append("left", Math.round(config.options.crop.x).toString());
      formData.append("top", Math.round(config.options.crop.y).toString());
      formData.append("width", Math.round(config.options.crop.width).toString());
      formData.append("height", Math.round(config.options.crop.height).toString());
    }
  }

  // First try local Next.js /api/jobs endpoint
  try {
    if (config.onProgress) config.onProgress(20);

    const jobsEndpoint = `${API_URL}/api/jobs`;
    const res = await fetch(jobsEndpoint, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.jobId) {
        const jobId = data.jobId;
        let attempts = 0;
        const maxAttempts = 60; // 30 seconds max

        while (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, 500));
          attempts++;

          const statusRes = await fetch(`${API_URL}/api/jobs/${jobId}`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (config.onProgress && statusData.progress) {
              config.onProgress(Math.min(95, statusData.progress));
            }

            if (statusData.status === "completed") {
              if (config.onProgress) config.onProgress(100);
              if (config.onSuccess) {
                config.onSuccess({
                  outputUrl: `${API_URL}${statusData.outputUrl}`,
                  outputSize: statusData.outputSize,
                  message: "Conversion completed successfully",
                });
              }
              return;
            } else if (statusData.status === "failed") {
              throw new Error(statusData.errorMessage || "Conversion failed");
            }
          }
        }
      }
    }
  } catch (jobsErr: any) {
    console.warn("Local /api/jobs endpoint fallback:", jobsErr);
  }

  // Fallback to legacy endpoint if needed
  let endpoint = `${API_URL}/api/convert/convert`;
  if (config.options?.crop) endpoint = `${API_URL}/api/convert/crop-image`;
  else if (config.options?.width || config.options?.height) endpoint = `${API_URL}/api/convert/resize-image`;
  else if (config.options?.quality !== undefined) endpoint = `${API_URL}/api/convert/compress-image`;

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && config.onProgress) {
        config.onProgress(Math.round((event.loaded / event.total) * 90));
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.downloadUrl) {
            const outputUrl = `${API_URL}${response.downloadUrl}`;
            if (config.onProgress) config.onProgress(100);
            if (config.onSuccess) {
              config.onSuccess({
                outputUrl,
                outputSize: response.size,
                message: response.message,
              });
            }
            resolve();
          } else {
            const err = new Error(response.message || "Failed to process file");
            if (config.onError) config.onError(err);
            else reject(err);
          }
        } catch (e: any) {
          const err = new Error("Failed to parse response: " + e.message);
          if (config.onError) config.onError(err);
          else reject(err);
        }
      } else {
        const err = new Error(`Processing failed with status ${xhr.status}`);
        if (config.onError) config.onError(err);
        else reject(err);
      }
    };

    xhr.onerror = () => {
      const err = new Error("Network error occurred during conversion.");
      if (config.onError) config.onError(err);
      else reject(err);
    };

    xhr.send(formData);
  });
}
