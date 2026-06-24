export interface UploadOptions {
  targetFormat: string;
  options?: any;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export async function processFileWithBackend(file: File, config: UploadOptions) {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = Math.random().toString(36).substring(7);
  let createdJobId = null;

  try {
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("chunkIndex", chunkIndex.toString());
      formData.append("totalChunks", totalChunks.toString());
      formData.append("fileName", file.name);
      formData.append("targetFormat", config.targetFormat);
      formData.append("uploadId", uploadId);
      if (config.options) {
        formData.append("options", JSON.stringify(config.options));
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const data = await res.json();
      if (data.complete) {
        createdJobId = data.jobId;
      }

      if (config.onProgress) {
        // Upload progress takes 0-50% of total progress
        const uploadProgress = Math.round(((chunkIndex + 1) / totalChunks) * 50);
        config.onProgress(uploadProgress);
      }
    }

    if (createdJobId) {
      pollJobStatus(createdJobId, config);
    }
  } catch (err: any) {
    if (config.onError) config.onError(err);
  }
}

function pollJobStatus(jobId: string, config: UploadOptions) {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error("Failed to check job status");
      
      const data = await res.json();

      if (data.status === "completed") {
        clearInterval(interval);
        if (config.onProgress) config.onProgress(100);
        if (config.onSuccess) config.onSuccess(data);
      } else if (data.status === "failed") {
        clearInterval(interval);
        if (config.onError) config.onError(new Error(data.errorMessage || "Processing failed"));
      } else {
        if (config.onProgress) {
          // Processing progress takes 50-100%
          const processingProgress = 50 + Math.round((data.progress || 0) / 2);
          config.onProgress(processingProgress);
        }
      }
    } catch (err: any) {
      console.error("Polling error", err);
      // We don't clear interval immediately on fetch error in case of temporary network blip, 
      // but you might want to add a retry counter.
    }
  }, 2000);
}
