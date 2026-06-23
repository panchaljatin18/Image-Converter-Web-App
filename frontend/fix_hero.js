const fs = require('fs');

const file = 'c:/Users/Jmpan/OneDrive/Desktop/Image Converter/frontend/src/sections/HomePage/Hero/index.jsx';
let content = fs.readFileSync(file, 'utf-8');

// 1. Add imports
if (!content.includes('import imageCompression')) {
  content = content.replace(
    'import authService from "../../../services/authService";',
    `import authService from "../../../services/authService";\nimport imageCompression from "browser-image-compression";\nimport { PDFDocument } from "pdf-lib";`
  );
}

// 2. Replace INPUT_ACCEPT
content = content.replace(
  /const INPUT_ACCEPT =[\s\S]*?;/,
  `const INPUT_ACCEPT = ".jpg,.jpeg,.jpe,.jfif,.png,.webp,.svg,image/*,.pdf";`
);

// 3. Replace ALL_FORMAT_CATEGORIES
content = content.replace(
  /const ALL_FORMAT_CATEGORIES = \([\s\S]*?\];\n\n\/\/ Build flat lookup/m,
  `const ALL_FORMAT_CATEGORIES = [
  {
    id: "image",
    label: "Image",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.35)",
    formats: [
      { value: "jpeg", label: "JPEG", note: "Standard JPEG" },
      { value: "jpg", label: "JPG", note: "Best for photos" },
      { value: "png", label: "PNG", note: "Transparent & lossless" },
      { value: "webp", label: "WebP", note: "Small & web-friendly" },
    ],
  },
  {
    id: "vector",
    label: "Vector",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.35)",
    formats: [
      { value: "svg", label: "SVG", note: "Scalable vector" },
    ],
  },
  {
    id: "document",
    label: "Document",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.35)",
    formats: [
      { value: "pdf", label: "PDF", note: "Portable document" },
    ],
  },
];

// Build flat lookup`
);

// 4. Replace conversionMap
content = content.replace(
  /const conversionMap = \{[\s\S]*?\};/,
  `const conversionMap = {
  jpg: ["png", "webp", "pdf", "svg"],
  jpeg: ["png", "webp", "pdf", "svg"],
  png: ["jpg", "webp", "pdf", "svg"],
  webp: ["jpg", "png", "pdf", "svg"],
  svg: ["jpg", "png", "webp", "pdf"]
};`
);

// 5. Replace SOURCE_FORMATS
content = content.replace(
  /const SOURCE_FORMATS = \[[\s\S]*?\];/,
  `const SOURCE_FORMATS = [
  { label: "JPG", extensions: ["jpg", "jpeg", "jpe", "jfif"], mimes: ["image/jpeg"] },
  { label: "JPEG", extensions: ["jpeg"], mimes: ["image/jpeg"] },
  { label: "PNG", extensions: ["png"], mimes: ["image/png"] },
  { label: "WebP", extensions: ["webp"], mimes: ["image/webp"] },
  { label: "SVG", extensions: ["svg"], mimes: ["image/svg+xml"] }
];`
);

// 6. Fix handleConvert
// Replace from "const handleConvert = useCallback(async () => {" to "}, [file, activeTool, target, compressionQuality, resizeMode, resizePercent, customWidth, customHeight, cropAspect, clearOutputUrl]);"
const handleConvertCode = `  const handleConvert = useCallback(async () => {
    if (!file) return;

    setConverting(true);
    setProgress(8);
    setError("");

    let sourceUrl = "";

    try {
      const img = new window.Image();
      sourceUrl = URL.createObjectURL(file);
      img.src = sourceUrl;

      const isImageLoaded = await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

      setProgress(40);

      let targetWidth = 2000;
      let targetHeight = 2000;
      let blob = null;

      const lookupTarget = SOURCE_FORMATS.find(f => f.extensions.includes(target?.value));
      const targetMime = lookupTarget ? lookupTarget.mimes[0] : \`image/\${target?.value === "jpg" ? "jpeg" : target?.value === "svg" ? "svg+xml" : target?.value || "png"}\`;
      const mime = targetFormat ? targetMime : (file.type || "application/octet-stream");
      const ext = targetFormat ? (lookupTarget ? \`.\${lookupTarget.extensions[0]}\` : \`.\${target?.value || "png"}\`) : "." + (file.name.split(".").pop() || "png");

      if (isImageLoaded) {
        targetWidth = img.naturalWidth || 2000;
        targetHeight = img.naturalHeight || 2000;

        if (activeTool === "resize") {
          if (resizeMode === "percent") {
            const ratio = resizePercent / 100;
            targetWidth = Math.max(1, Math.round(targetWidth * ratio));
            targetHeight = Math.max(1, Math.round(targetHeight * ratio));
          } else {
            const w = parseInt(customWidth);
            const h = parseInt(customHeight);
            if (w > 0 && h > 0) {
              targetWidth = w;
              targetHeight = h;
            } else if (w > 0) {
              targetWidth = w;
              targetHeight = Math.max(1, Math.round((w / (img.naturalWidth || 2000)) * (img.naturalHeight || 2000)));
            } else if (h > 0) {
              targetHeight = h;
              targetWidth = Math.max(1, Math.round((h / (img.naturalHeight || 2000)) * (img.naturalWidth || 2000)));
            }
          }
        }

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.naturalWidth || 2000;
        let sourceHeight = img.naturalHeight || 2000;

        if (activeTool === "crop") {
          if (cropAspect === "1:1") {
            const size = Math.min(sourceWidth, sourceHeight);
            sourceX = Math.round((sourceWidth - size) / 2);
            sourceY = Math.round((sourceHeight - size) / 2);
            sourceWidth = size;
            sourceHeight = size;
            targetWidth = size;
            targetHeight = size;
          } else if (cropAspect === "16:9") {
            const targetRatio = 16 / 9;
            const currentRatio = sourceWidth / sourceHeight;
            if (currentRatio > targetRatio) {
              sourceHeight = sourceHeight;
              sourceWidth = Math.round(sourceHeight * targetRatio);
              sourceX = Math.round(((img.naturalWidth || 2000) - sourceWidth) / 2);
            } else {
              sourceWidth = sourceWidth;
              sourceHeight = Math.round(sourceWidth / targetRatio);
              sourceY = Math.round(((img.naturalHeight || 2000) - sourceHeight) / 2);
            }
            targetWidth = sourceWidth;
            targetHeight = sourceHeight;
          } else if (cropAspect === "4:3") {
            const targetRatio = 4 / 3;
            const currentRatio = sourceWidth / sourceHeight;
            if (currentRatio > targetRatio) {
              sourceHeight = sourceHeight;
              sourceWidth = Math.round(sourceHeight * targetRatio);
              sourceX = Math.round(((img.naturalWidth || 2000) - sourceWidth) / 2);
            } else {
              sourceWidth = sourceWidth;
              sourceHeight = Math.round(sourceWidth / targetRatio);
              sourceY = Math.round(((img.naturalHeight || 2000) - sourceHeight) / 2);
            }
            targetWidth = sourceWidth;
            targetHeight = sourceHeight;
          }
        }

        if (mime === "application/pdf") {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([targetWidth, targetHeight]);
            
            // Draw to a canvas first to get PNG/JPG bytes
            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");
            
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
            
            const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1.0));
            const pngBytes = await pngBlob.arrayBuffer();
            const pdfImage = await pdfDoc.embedPng(pngBytes);
            
            page.drawImage(pdfImage, {
                x: 0,
                y: 0,
                width: targetWidth,
                height: targetHeight,
            });
            
            const pdfBytes = await pdfDoc.save();
            blob = new Blob([pdfBytes], { type: "application/pdf" });
        } else if (mime === "image/svg+xml") {
            // Convert to SVG by embedding the image as base64
            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
            
            const dataUrl = canvas.toDataURL("image/png");
            const svgContent = \`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="\${targetWidth}" height="\${targetHeight}" viewBox="0 0 \${targetWidth} \${targetHeight}">
  <image width="\${targetWidth}" height="\${targetHeight}" href="\${dataUrl}" />
</svg>\`.trim();
            blob = new Blob([svgContent], { type: "image/svg+xml" });
        } else {
            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              if (mime === "image/jpeg") {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }

              ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

              let quality = 0.95;
              if (activeTool === "compress") {
                quality = compressionQuality / 100;
              } else if (mime === "image/jpeg") {
                quality = 0.92;
              }

              blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
            }
        }
      }

      setProgress(75);

      if (!blob) {
        await new Promise(resolve => setTimeout(resolve, 800));
        blob = new Blob([await file.arrayBuffer()], { type: mime });
      }

      let actionSuffix = "";
      if (activeTool === "compress") actionSuffix = "-compressed";
      if (activeTool === "resize") actionSuffix = \`-resized-\${targetWidth}x\${targetHeight}\`;
      if (activeTool === "crop") actionSuffix = \`-cropped-\${cropAspect.replace(":", "x")}\`;

      const nameWithoutExt = file.name.replace(/\\.[^.]+$/, "");
      const outputName = nameWithoutExt + actionSuffix + ext;
      const outputUrl = URL.createObjectURL(blob);

      clearOutputUrl();
      outputUrlRef.current = outputUrl;

      setResult({
        url: outputUrl,
        name: outputName,
        size: getImageSize(blob.size),
        width: targetWidth,
        height: targetHeight,
      });
      setProgress(100);
    } catch (err) {
      setProgress(0);
      setError(\`Failed to process image: \${err?.message || "Unknown error"}\`);
    } finally {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }
      setConverting(false);
    }
  }, [file, activeTool, target, compressionQuality, resizeMode, resizePercent, customWidth, customHeight, cropAspect, clearOutputUrl]);`;

content = content.replace(
  /const handleConvert = useCallback\(async \(\) => \{[\s\S]*?\}, \[file, activeTool, target, compressionQuality, resizeMode, resizePercent, customWidth, customHeight, cropAspect, clearOutputUrl\]\);/,
  handleConvertCode
);

fs.writeFileSync(file, content, 'utf-8');
console.log("Successfully updated Hero/index.jsx");
