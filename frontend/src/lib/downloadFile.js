/**
 * downloadFile.js
 *
 * Utility to force-download a file from any URL (including cross-origin backend URLs).
 *
 * The HTML `download` attribute on <a> tags is IGNORED by browsers for cross-origin
 * URLs (e.g., Render.com backend). This utility fetches the file as a Blob,
 * creates a temporary same-origin Object URL, and triggers a programmatic download.
 */

/**
 * Downloads a file from a URL by forcing a blob-based download.
 * Works for both same-origin and cross-origin URLs.
 *
 * @param {string} url - The URL of the file to download
 * @param {string} filename - The desired filename for the download
 * @returns {Promise<void>}
 */
export async function downloadFile(url, filename) {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();

    // Cleanup after a short delay to ensure the download has started
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(anchor);
    }, 1000);
  } catch (err) {
    console.error("Download failed:", err);
    // Fallback: open in new tab if fetch fails
    window.open(url, "_blank");
  }
}
