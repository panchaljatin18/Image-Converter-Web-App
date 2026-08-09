export interface FAQItem {
  q: string;
  a: string;
}

export interface StepItem {
  title: string;
  text: string;
}

export interface BenefitItem {
  title: string;
  text: string;
  icon: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface ToolContent {
  howToUseSteps: StepItem[];
  faqs: FAQItem[];
  benefits: BenefitItem[];
  comparisonTable?: ComparisonTable;
  technicalDescription: string;
}

export const toolContentMap: Record<string, ToolContent> = Object.freeze({
  "heic-to-jpg": {
    howToUseSteps: [
      { title: "Select HEIC Photo", text: "Click the upload panel or drag and drop your Apple .heic or .heif files into the browser converter." },
      { title: "Configure Quality", text: "Adjust the JPEG quality slider. 90% is highly recommended to maintain crisp details while reducing file size." },
      { title: "Manage Metadata", text: "Choose whether to preserve EXIF metadata (GPS, camera info) or remove it for complete privacy." },
      { title: "Convert & Download", text: "Click the 'Convert to JPG' button. Once finished, click 'Download JPG' to save your new universally compatible image." }
    ],
    faqs: [
      { q: "What is HEIC and why should I convert it to JPG?", a: "HEIC (High Efficiency Image Container) is the default image format used by modern iPhones and iPads. While it saves space, it is not supported natively on Windows, legacy Android systems, or many online upload forms. Converting to JPG makes it instantly viewable everywhere." },
      { q: "Will I lose image quality when converting HEIC to JPG?", a: "Our converter preserves the original photo details and sharpness. If you keep the output quality setting around 85% to 95%, the resulting JPG will look virtually identical to your original HEIC file." },
      { q: "Are my personal iPhone photos safe?", a: "Absolutely. All files are transferred over secure, encrypted SSL connections and are processed immediately. Files are deleted from our backend immediately after processing, and we never access or share your images." },
      { q: "Can I convert HEIC photos in bulk?", a: "Yes, our converter supports processing multiple HEIC files. You can upload multiple files and convert them at once to save time." }
    ],
    benefits: [
      { title: "EXIF Preservation", text: "Retain capture dates, GPS details, and camera settings, or choose to strip them.", icon: "Layers" },
      { title: "Secure Processing", text: "Secure SSL encrypted transmissions. Files deleted immediately after conversion.", icon: "Shield" },
      { title: "Zero Install", text: "Works inside any modern web browser on Windows, Mac, iOS, and Android.", icon: "Sparkles" }
    ],
    comparisonTable: {
      title: "HEIC vs. JPG Technical Comparison",
      headers: ["Feature", "HEIC Format", "JPG/JPEG Format"],
      rows: [
        ["Compression", "Lossy (HEVC/H.265 compression)", "Lossy (JPEG standard)"],
        ["File Size", "Extremely Small (saves ~50% space)", "Medium to Large (less efficient)"],
        ["Transparency", "Yes (supports alpha transparency channels)", "No (replaces transparent areas with background)"],
        ["Color Depth", "Supports 16-bit color depth for rich details", "Limited to 8-bit color depth"],
        ["Compatibility", "Limited (Apple ecosystem, requires plugins elsewhere)", "Universal (every device, OS, and browser)"]
      ]
    },
    technicalDescription: "HEIC (High Efficiency Image Container) was introduced by Apple in iOS 11 as a way to store high-quality photographs at roughly half the file size of standard JPEGs. It achieves this by using the HEVC (High Efficiency Video Coding) codec. Despite its technological advantages, compatibility remains HEIC's greatest challenge. By converting HEIC to JPEG, users translate the modern HEVC-compressed image stream into a standard baseline JPEG format, ensuring the image can be loaded by web engines, legacy operating systems, and image processing libraries worldwide without additional codecs."
  },

  "jpg-to-png": {
    howToUseSteps: [
      { title: "Upload JPG Files", text: "Drag and drop your JPG or JPEG images into the upload area or browse them from your local computer." },
      { title: "Initiate Conversion", text: "No complex setup needed. Click the 'Convert to PNG' button to begin encoding standard JPEG format into lossless PNG." },
      { title: "Lossless Rendering", text: "The converter decodes the image and wraps it in a lossless compression container to prevent further quality loss." },
      { title: "Download Image", text: "Click the 'Download PNG' button to store the converted lossless image on your device." }
    ],
    faqs: [
      { q: "Why would I convert a JPG to PNG?", a: "JPG uses lossy compression, which degrades each time you edit and save the image. PNG is a lossless format, making it ideal if you need to perform multiple edits, add transparency, or keep text and logos razor-sharp." },
      { q: "Will converting a JPG to PNG make the background transparent?", a: "No. Standard JPGs do not contain transparent background data. Converting it to PNG preserves the image exactly as is (usually with a solid background), but it prevents future quality loss." },
      { q: "Is this JPG to PNG converter free?", a: "Yes, our online tool is 100% free with no registration, email sign-ups, or software downloads required." },
      { q: "Are my uploaded photos secure?", a: "Yes. All images are uploaded via secure HTTPS, processed instantly, and deleted automatically from our system. We do not store or keep copies of your files." }
    ],
    benefits: [
      { title: "Lossless Quality", text: "Encode images into a lossless compression container, avoiding further quality degradation.", icon: "Sparkles" },
      { title: "Logo & Graphics Ready", text: "Ideal for preparing images for graphic editing, web layout design, and logo design.", icon: "FileImage" },
      { title: "Safe & Reliable", text: "Encrypted transmission ensures your sensitive personal documents remain confidential.", icon: "Shield" }
    ],
    comparisonTable: {
      title: "JPG vs. PNG Technical Comparison",
      headers: ["Feature", "JPG Format", "PNG Format"],
      rows: [
        ["Compression", "Lossy (reduces quality to save space)", "Lossless (preserves every pixel perfectly)"],
        ["Transparency", "No", "Yes (full alpha transparency support)"],
        ["File Size", "Small (optimized for web images and photos)", "Large (due to high-fidelity pixel retention)"],
        ["Best Use Case", "Complex photographs, colorful scenery", "Logos, charts, digital icons, text screenshots"],
        ["Compression Type", "Discrete Cosine Transform (DCT)", "DEFLATE (Zip-like compression)"]
      ]
    },
    technicalDescription: "JPEG is an abbreviation for Joint Photographic Experts Group, which uses lossy compression to discard visual information that the human eye is less sensitive to, creating small files. PNG (Portable Network Graphics) was created as a patent-free replacement for GIF, utilizing lossless DEFLATE compression. Converting a JPG image to PNG converts the image from a lossy compressed format to a lossless container. While this does not reconstruct lost pixels, it ensures no further compression artifacts are introduced during future saves, making it a critical step before professional image editing."
  },

  "png-to-jpg": {
    howToUseSteps: [
      { title: "Upload PNG Files", text: "Click the selection zone or drop your PNG files into the uploader." },
      { title: "Set Background Color", text: "Since JPG doesn't support transparency, choose white or black to fill transparent regions." },
      { title: "Adjust Quality Level", text: "Use the quality slider to set the balance between compression ratio and output image details." },
      { title: "Convert & Save", text: "Trigger the 'Convert to JPG' operation and download your compressed, web-optimized JPEG files." }
    ],
    faqs: [
      { q: "What happens to transparency when converting PNG to JPG?", a: "Because JPG does not support transparency, any transparent background pixels in your PNG will be filled with a solid background color (default is white) during conversion." },
      { q: "Why should I convert PNG to JPG?", a: "PNG images with high resolutions are often massive in file size, which slows down websites and eats storage. JPG compression reduces file sizes by up to 80%, making files much easier to email, share, and post online." },
      { q: "Does converting PNG to JPG reduce image quality?", a: "Yes, because JPG uses lossy compression. However, setting the quality slider to 85%-90% results in compression that is visually identical to the original PNG to the human eye while saving significant storage space." },
      { q: "Can I convert files from my mobile device?", a: "Yes, ConvertGalaxy works in any mobile browser on iOS and Android. You can convert PNG to JPG on the go with zero installation." }
    ],
    benefits: [
      { title: "Custom Backgrounds", text: "Control what color replaces transparent PNG layers during the JPG conversion process.", icon: "Layers" },
      { title: "Extreme Size Reduction", text: "Shrink massive screenshot PNG files into light, storage-friendly JPEGs.", icon: "Zap" },
      { title: "Universal Compatibility", text: "Ensure your converted images load quickly and reliably on any device or platform.", icon: "Shield" }
    ],
    comparisonTable: {
      title: "PNG vs. JPG Technical Comparison",
      headers: ["Feature", "PNG Format", "JPG Format"],
      rows: [
        ["Compression", "Lossless", "Lossy"],
        ["Transparency", "Yes (Alpha channel)", "No (filled with solid color)"],
        ["File Size", "Very Large", "Small & Compressed"],
        ["Web Loading Speed", "Slower (due to large payload size)", "Faster (perfect for web publishing)"],
        ["Editing", "Excellent for multi-layer revisions", "Not recommended for multiple resaves due to decay"]
      ]
    },
    technicalDescription: "PNG (Portable Network Graphics) preserves all pixel coordinates and color values perfectly using the DEFLATE algorithm, which is highly efficient for flat graphics but yields large file sizes for photos. When converting a PNG to JPG, the converter strips the alpha transparency channel (filling transparent layers with a selected background color) and applies the JPEG compression codec. This converts the pixel values using Discrete Cosine Transform (DCT) blocks, compressing the file and decreasing download latency, which is essential for SEO and page performance."
  },

  "png-to-webp": {
    howToUseSteps: [
      { title: "Select & Upload PNG Image", text: "Drag and drop your .png file into our free PNG to WebP converter upload box, or click to browse files from your computer or mobile device (up to 50MB per file)." },
      { title: "Configure WebP Quality & Compression", text: "Use the WebP quality slider to select your ideal compression ratio (80% recommended for maximum file size reduction with zero visible loss)." },
      { title: "Instant PNG to WebP Conversion", text: "Click 'Convert to WebP' to process your image locally in your browser context, preserving 100% of alpha background transparency without server uploads." },
      { title: "Download WebP File Immediately", text: "View your real-time file size savings (KB/MB statistics) and click 'Download WebP' to get your lightweight, web-optimized image free without watermarks." }
    ],
    faqs: [
      { q: "How do I convert PNG to WebP online for free?", a: "To convert PNG to WebP online for free, simply drag and drop your PNG image into our converter, choose your preferred WebP encoding quality (10% to 100%), and click 'Convert PNG to WebP'. Once processing completes, click 'Download WebP' to save your compressed image instantly without any registration, email, or watermark." },
      { q: "Will converting PNG to WebP preserve background transparency (alpha channel)?", a: "Yes, 100%! Unlike standard JPEG format converters that replace transparent backgrounds with solid white fills, the Google WebP format natively supports full 8-bit alpha channel transparency. Our converter keeps transparent PNG backgrounds completely clear, making it ideal for website logos, app icons, digital badges, and UI overlays." },
      { q: "How much file size reduction can I expect when converting PNG to WebP?", a: "Converting PNG to WebP typically reduces image file sizes by 25% to 35% compared to PNG files at equivalent visual quality. For high-resolution screenshot PNGs and digital artwork, file size reductions often exceed 70%, dramatically reducing page payload and boosting your website's Google Core Web Vitals score." },
      { q: "Is WebP supported across all web browsers and devices?", a: "Yes! WebP is fully supported by all modern web browsers, including Google Chrome, Mozilla Firefox, Microsoft Edge, Opera, and Apple Safari (iOS 14+ / macOS Big Sur+). WebP is recommended by Google as a next-generation image format for web publishing." },
      { q: "Are my personal photos and graphics safe on ConvertGalaxy?", a: "Your privacy is 100% guaranteed. All PNG to WebP conversions execute locally inside your own web browser using modern HTML5 Canvas APIs. Your images are never uploaded, stored, or processed on remote cloud servers, ensuring complete document privacy and security." },
      { q: "What is the difference between lossy and lossless PNG to WebP conversion?", a: "Lossy WebP compression discards microscopic pixel variations that are imperceptible to the human eye, yielding maximum file size savings. Lossless WebP compression reorganizes pixel data to reduce file size while maintaining 100% bit-for-bit mathematical visual accuracy. Our converter allows you to set custom WebP encoding quality from 10% to 100% to suit your specific project needs." }
    ],
    benefits: [
      { title: "Alpha Transparency Preserved", text: "100% support for transparent PNG backgrounds without adding solid white or color background fills.", icon: "Layers" },
      { title: "Custom WebP Quality Control", text: "Fine-tune output compression slider from 10% to 100% for the exact balance between file size and sharpness.", icon: "Sparkles" },
      { title: "100% Private Browser Encoding", text: "Client-side processing executes in your browser sandbox with zero server uploads or external data leaks.", icon: "Shield" },
      { title: "Core Web Vitals SEO Boost", text: "Shrink heavy PNG image payloads up to 70% to speed up website load times and improve Google search rankings.", icon: "Zap" }
    ],
    comparisonTable: {
      title: "PNG vs. WebP Technical Comparison for Web Optimization",
      headers: ["Key Performance Metric", "Standard PNG Format", "Google WebP Next-Gen Format"],
      rows: [
        ["Compression Technology", "Lossless (DEFLATE / Zip algorithm)", "Lossy & Lossless (VP8 / VP8L predictive block coding)"],
        ["Average File Size", "Large to Very Large (Heavy web payload)", "Up to 35% smaller than PNG at same visual quality"],
        ["Alpha Channel Transparency", "Supported (8-bit alpha channel)", "Supported (8-bit alpha channel with lossy/lossless compression)"],
        ["Page Load Speed Impact", "Slower page render times & higher bandwidth cost", "Faster page loading speed & lower bandwidth consumption"],
        ["Google Core Web Vitals Impact", "Higher LCP (Largest Contentful Paint) score", "Optimized LCP & improved Google search engine rankings"],
        ["Browser Compatibility", "Universal (all systems & legacy browsers)", "Universal in modern browsers (Chrome, Firefox, Edge, Safari 14+)"]
      ]
    },
    technicalDescription: "PNG (Portable Network Graphics) relies on lossless DEFLATE compression to maintain exact pixel fidelity. While PNG is ideal for graphic design master copies, its uncompressed pixel structures generate large file sizes that degrade mobile page load speeds and increase server bandwidth. Developed by Google, WebP leverages advanced predictive coding derived from the VP8 and VP8L keyframe codecs. By predicting pixel color values based on adjacent pixel blocks, WebP compresses spatial image channels while retaining full 8-bit alpha transparency. Converting PNG to WebP using our free online converter reduces total file size by up to 35% to 70% without sacrificing visual quality, giving your website faster page speeds, lower bounce rates, and better Google Core Web Vitals SEO performance."
  },

  "webp-converter": {
    howToUseSteps: [
      { title: "Upload Source Image", text: "Add images in standard formats like JPG, PNG, GIF, or WebP to the converter." },
      { title: "Select Target Format", text: "Choose your output format. Select WebP to reduce size, or choose JPG/PNG to export from WebP." },
      { title: "Set Compression Quality", text: "Fine-tune the output compression quality slider to get the exact file size you need." },
      { title: "Execute & Download", text: "Click the conversion button to render the output image, then click download to save it." }
    ],
    faqs: [
      { q: "What is WebP and what are its benefits?", a: "WebP is a modern image format developed by Google. It offers superior lossless and lossy compression, resulting in image file sizes that are about 26% smaller than PNGs and 25-34% smaller than JPGs, while keeping the same quality." },
      { q: "Are WebP images supported by all browsers?", a: "Yes, WebP is fully supported by all modern web browsers, including Chrome, Safari, Firefox, and Edge. However, some old applications or offline software may require converting WebP back to JPG/PNG." },
      { q: "Can I convert WebP files back to PNG or JPG?", a: "Yes, our WebP converter is bi-directional. You can convert JPG/PNG to WebP, and you can also convert WebP files back to standard JPG or PNG images." },
      { q: "Is this WebP converter safe?", a: "Absolutely. All transactions are securely encrypted. Your uploaded files are processed in real-time and deleted instantly. We do not store your images." }
    ],
    benefits: [
      { title: "Next-Gen Format", text: "Adopt Google's WebP standard to decrease page weight and speed up page load times.", icon: "Sparkles" },
      { title: "Bi-Directional Tools", text: "Convert images to WebP or export WebP back to traditional formats (JPG, PNG).", icon: "Layers" },
      { title: "Real-time Processing", text: "Fast cloud conversion processing ensures you get your images in seconds.", icon: "Zap" }
    ],
    comparisonTable: {
      title: "WebP vs. JPG vs. PNG Comparison",
      headers: ["Feature", "WebP (Google)", "JPG/JPEG", "PNG"],
      rows: [
        ["Compression Type", "Lossy & Lossless", "Lossy only", "Lossless only"],
        ["Transparency Support", "Yes (Alpha channel)", "No", "Yes"],
        ["Animation Support", "Yes (WebP animations)", "No", "No"],
        ["Average File Size", "Smallest (Highly optimized)", "Small (Standard)", "Large (Uncompressed)"],
        ["Page Load Impact", "Extremely low (fastest loading)", "Low", "Medium to High"]
      ]
    },
    technicalDescription: "WebP was created by Google in 2010 to make internet browsing faster by shrinking image sizes without quality loss. It uses predictive coding technology (derived from VP8 video frame compression) to predict pixel values based on adjacent blocks. This allows WebP to pack lossless and lossy image data much tighter than traditional PNG and JPEG formats. Using a WebP converter helps web developers compress image assets to speed up website load times, improve user experience, and boost Google Search rankings."
  },

  "webp-to-jpg": {
    howToUseSteps: [
      { title: "Choose WebP Images", text: "Drag and drop your Google WebP files into the browser's upload section." },
      { title: "Set Output Properties", text: "Choose your preferred JPG quality and fill transparent pixels with a solid color." },
      { title: "Trigger Conversion", text: "Click the 'Convert to JPG' button. The converter will decode the WebP blocks into JPEG." },
      { title: "Download Files", text: "Save the converted JPG files to your local computer, tablet, or smartphone." }
    ],
    faqs: [
      { q: "Why convert WebP to JPG?", a: "WebP is designed for web browsers, but legacy desktop applications, Microsoft Office, older image editors, and some social media sites still do not support it. Converting WebP to JPG ensures universal compatibility." },
      { q: "Will I lose quality when converting WebP to JPG?", a: "Yes, minor loss of detail occurs because both WebP (when lossy) and JPG are lossy formats. Selecting a high quality value (like 90%) ensures the change in quality is virtually invisible." },
      { q: "How are my files handled?", a: "Your files are transferred over secure SSL, processed instantly on our servers, and deleted immediately after. We do not store or read your images." },
      { q: "Can I convert multiple WebP files at once?", a: "Yes, you can upload multiple WebP files and convert them in batch, allowing you to download them all in a single click." }
    ],
    benefits: [
      { title: "High Compatibility", text: "Export WebP images to standard JPEGs that can be opened on any system or website.", icon: "Shield" },
      { title: "Custom Compression", text: "Control output compression quality to fit exact file size constraints.", icon: "Layers" },
      { title: "Instant Conversion", text: "High-performance engines process conversions in seconds with no delays.", icon: "Zap" }
    ],
    comparisonTable: {
      title: "WebP to JPG Conversion Characteristics",
      headers: ["Aspect", "WebP Format", "JPG Format"],
      rows: [
        ["Transparency", "Supported (Alpha layer)", "Unsupported (solid color fill required)"],
        ["Color Profiles", "Supports ICC profiles", "Supports ICC profiles"],
        ["Compatibility", "Modern web browsers, select editors", "Universal (all hardware and software)"],
        ["Compression Efficiency", "Very High (~30% smaller than JPG)", "High (Standard)"],
        ["File Suffix", ".webp", ".jpg / .jpeg"]
      ]
    },
    technicalDescription: "WebP images use predictive encoding from the VP8 video compression standard, making them difficult to open on legacy platforms. Converting WebP to JPG decodes the VP8-compressed bitstream into raw RGB pixels. The converter then applies the Joint Photographic Experts Group standard to encode these pixels into YCbCr color spaces, performing discrete cosine transform quantization. This processes the image into a standard JPG file that can be opened on any software, OS, or legacy browser."
  },

  "image-compressor": {
    howToUseSteps: [
      { title: "Upload Images", text: "Select your JPG, PNG, or WebP images to compress by dragging them into the selector." },
      { title: "Select Compression Level", text: "Adjust the quality slider to find your desired balance between file size and image clarity." },
      { title: "Compare File Sizes", text: "View the real-time preview showing the original vs. compressed file size and savings percentage." },
      { title: "Save Compressed File", text: "Click the download button to save the newly optimized, lightweight image." }
    ],
    faqs: [
      { q: "How does image compression work?", a: "Image compression works by reducing the digital payload of an image. Lossy compression removes minor visual detail that is hard for the human eye to detect, while lossless compression reorganizes pixel data to save space without any loss in quality." },
      { q: "Will compression ruin my image quality?", a: "No. Our compression tool is designed to compress images efficiently. Setting the quality slider to 80% or above yields significant file size savings with virtually no visible difference in quality." },
      { q: "What formats can I compress?", a: "We support compression for JPG, JPEG, PNG, and WebP formats. Each format uses specialized compression techniques to optimize performance." },
      { q: "Is there a limit on file size or usage?", a: "No, you can compress as many images as you need, completely free of charge. Files are processed instantly and deleted immediately for your security." }
    ],
    benefits: [
      { title: "Real-time Statistics", text: "See exactly how many kilobytes you are saving before downloading.", icon: "Sparkles" },
      { title: "Optimized for SEO", text: "Shrink images to improve website loading speeds, reducing bounce rates and boosting SEO rankings.", icon: "Zap" },
      { title: "Privacy First", text: "Encrypted processing means your files are handled securely and deleted immediately.", icon: "Shield" }
    ],
    comparisonTable: {
      title: "Lossless vs. Lossy Compression",
      headers: ["Characteristic", "Lossless Compression (PNG)", "Lossy Compression (JPG/WebP)"],
      rows: [
        ["Quality Retained", "100% (Bit-perfect copy)", "Slightly reduced (removes high-frequency data)"],
        ["File Size Reduction", "Moderate (typically 10-30% smaller)", "Significant (typically 50-80% smaller)"],
        ["Reversibility", "Fully reversible (can reconstruct original)", "Irreversible (discarded visual data cannot be recovered)"],
        ["Best Used For", "Text screenshots, logos, pixel art", "Digital photos, colorful banners, social media posts"]
      ]
    },
    technicalDescription: "Image compression reduces file size to save storage space and decrease network transfer times. This tool applies optimization algorithms depending on the file format: JPEG images are optimized by scaling quantization matrices, PNG images are compressed using color-palette reduction and DEFLATE filtering, and WebP images use predictive coding. This allows you to strip unnecessary metadata and optimize pixel storage to make files much lighter without compromising visual quality."
  },

  "image-resizer": {
    howToUseSteps: [
      { title: "Select Image", text: "Upload the image you want to resize by dragging it into the upload box." },
      { title: "Enter New Dimensions", text: "Type in your target width and height in pixels, or choose a percentage scale (e.g., 50%)." },
      { title: "Toggle Aspect Ratio", text: "Keep the aspect ratio locked to prevent stretching, or unlock it to stretch the image to custom dimensions." },
      { title: "Resize and Download", text: "Click the resize button to process the image, then download the resized image." }
    ],
    faqs: [
      { q: "Why should I keep the aspect ratio locked?", a: "Locking the aspect ratio ensures that when you adjust the width, the height scales proportionally, and vice versa. This keeps the image from looking stretched, distorted, or squished." },
      { q: "Can resizing an image increase its quality?", a: "No. Scaling down an image makes it smaller and sharper. Scaling up an image beyond its original dimensions requires interpolating new pixels, which can make the image look blurry or pixelated." },
      { q: "What file formats does the resizer support?", a: "You can resize images in JPG, PNG, and WebP formats. The output format can be customized to suit your needs." },
      { q: "Are my images safe when resized?", a: "Yes. Your privacy is guaranteed. All files are sent over secure SSL connections, processed instantly, and deleted immediately from our servers." }
    ],
    benefits: [
      { title: "Proportional Scaling", text: "Lock the aspect ratio to resize images without distortion or stretching.", icon: "Layers" },
      { title: "Percentage Sizing", text: "Scale images down quickly by percentage (25%, 50%, 75%) for ease of use.", icon: "Sparkles" },
      { title: "High-Fidelity Resampling", text: "Uses high-quality scaling algorithms to keep images looking sharp.", icon: "Zap" }
    ],
    comparisonTable: {
      title: "Resizing vs. Compression",
      headers: ["Action", "Resizing Dimensions", "Compressing File Size"],
      rows: [
        ["What it changes", "Alters physical pixel width & height", "Reduces file size in bytes while keeping dimensions same"],
        ["Impact on Resolution", "Decreases or increases pixel count", "Maintains same resolution but may introduce minor compression artifacts"],
        ["Best Use Case", "Meeting specific dimensions (e.g. 800x600)", "Reducing page weight for faster web loading"],
        ["Visual Effect", "Image becomes physically smaller/larger", "Image remains same size but may lose subtle color details"]
      ]
    },
    technicalDescription: "Resizing changes the resolution of an image by altering its pixel count. Scaling down an image is a great way to reduce file size. The image resizer uses bilinear or bicubic interpolation algorithms to recalculate the colors of pixels in the new grid, ensuring transitions remain smooth. By adjusting width and height dimensions, developers can optimize images for specific layouts, banners, and profile picture slots."
  },

  "crop-image": {
    howToUseSteps: [
      { title: "Upload Image", text: "Drop your image into the crop section or browse files on your device." },
      { title: "Select Aspect Ratio", text: "Choose a preset ratio like 1:1 (Square), 16:9 (Widescreen), or select 'Free' for custom cropping." },
      { title: "Position Crop Box", text: "Drag and resize the crop frame on the canvas overlay to select the area you want to keep." },
      { title: "Apply & Save", text: "Click the crop button to trim the outer pixels, then download your cropped image." }
    ],
    faqs: [
      { q: "What is the difference between cropping and resizing?", a: "Resizing scales the entire image down or up, keeping all content visible. Cropping cuts away the outer borders of the image, discarding unwanted content to focus on a specific subject or fit a specific aspect ratio." },
      { q: "What preset aspect ratios are available?", a: "We provide presets for common web requirements: 1:1 (Square - ideal for profile pictures), 16:9 (Widescreen - perfect for YouTube and video headers), 4:3 (standard photo prints), and 'Free' crop." },
      { q: "Does cropping reduce my image resolution?", a: "Yes, because cropping discards outer pixels, the width and height of the remaining image will be smaller than the original. However, it does not degrade the pixel quality of the remaining portion." },
      { q: "Is my privacy protected?", a: "Absolutely. All image files are processed using secure HTTPS connections and are deleted immediately after cropping is complete." }
    ],
    benefits: [
      { title: "Preset Ratios", text: "Crop images quickly to fit common social media layouts and video frames.", icon: "Layers" },
      { title: "Precise Control", text: "Drag and resize the crop frame precisely over your image canvas.", icon: "Sparkles" },
      { title: "Safe Processing", text: "Files are handled securely and deleted immediately after processing.", icon: "Shield" }
    ],
    comparisonTable: {
      title: "Cropping vs. Resizing Comparison",
      headers: ["Feature", "Cropping Image", "Resizing Image"],
      rows: [
        ["Core Action", "Trims/removes outer parts of the image", "Shrinks or expands the entire image canvas"],
        ["Content Retained", "Keeps only selected area; discards the rest", "Retains 100% of original image contents"],
        ["Proportion Change", "Changes aspect ratio to focus on subjects", "Maintains original proportions (unless unlocked)"],
        ["Common Use Case", "Framing a face, removing background clutter", "Fitting an image into a website column width"]
      ]
    },
    technicalDescription: "Cropping is the process of removing unwanted outer areas from an image. This tool renders your image onto an interactive canvas, allowing you to position coordinate pointers. Once you apply the crop, the backend crops the image to the selected area. This is ideal for adjusting photos to fit standard aspect ratios like 1:1 for social media or 16:9 for widescreen headers."
  },

  "image-to-pdf": {
    howToUseSteps: [
      { title: "Upload Images", text: "Select your images (JPG, PNG, or WebP) by dragging them into the converter." },
      { title: "Set Layout Options", text: "Choose PDF settings: Page Size (A4, Letter, Fit Image), orientation, and margin sizes." },
      { title: "Arrange Page Order", text: "If you uploaded multiple images, drag and drop the thumbnails to set their page order in the PDF." },
      { title: "Generate & Download", text: "Click the 'Convert to PDF' button, wait for compilation, and download your PDF document." }
    ],
    faqs: [
      { q: "Can I convert multiple images into a single PDF?", a: "Yes! You can upload multiple images at once, arrange them in the sequence you want, and compile them into a single, multi-page PDF document." },
      { q: "What image formats can I convert to PDF?", a: "We support converting JPG, JPEG, PNG, and WebP images. You can even mix different formats in the same compilation." },
      { q: "Can I adjust the margins and page sizes?", a: "Yes. Our tool allows you to select A4 or Letter page sizes, choose fit-to-image mode, set margins, and configure page orientation (portrait or landscape)." },
      { q: "Are my sensitive documents secure?", a: "Yes. Files are transferred over secure SSL, processed in real-time, and deleted immediately from our servers. Your documents are completely confidential." }
    ],
    benefits: [
      { title: "Multi-Image Merging", text: "Merge and arrange multiple images into a single PDF document in seconds.", icon: "Layers" },
      { title: "Flexible PDF Layouts", text: "Configure page sizes, margins, and orientation to fit your needs.", icon: "Sparkles" },
      { title: "Secure Document Handling", text: "Processes files securely over HTTPS and deletes them immediately after.", icon: "Shield" }
    ],
    comparisonTable: {
      title: "Image Format vs. PDF Document Features",
      headers: ["Property", "Image Formats (JPG/PNG)", "PDF Format (Portable Document)"],
      rows: [
        ["Purpose", "Displaying graphics, photos, web assets", "Archiving, sharing documents, printing"],
        ["Page Support", "Single page only", "Supports multiple pages in a single file"],
        ["Layout Protection", "Can look different depending on screen size", "Keeps layout, fonts, and images fixed on all devices"],
        ["Text Layering", "Rasterized (text cannot be highlighted or searched)", "Vectorized (supports selectable text layers)"]
      ]
    },
    technicalDescription: "Converting images to PDF involves wrapping raw image formats inside a PDF container. The converter reads the uploaded images, maps them to PDF document pages, and sets document structure details like margins, orientation, and resolution metadata. This compiles your images into a single PDF document that preserves its formatting, making it easy to email, print, or submit to online portals."
  },

  "pdf-to-image": {
    howToUseSteps: [
      { title: "Upload PDF File", text: "Drag and drop your PDF document into the uploader zone." },
      { title: "Select Extraction Mode", text: "Choose to convert entire pages to images or extract only the embedded raw images." },
      { title: "Choose Format & Quality", text: "Select your preferred output format (JPG or PNG) and image quality level." },
      { title: "Convert & Download", text: "Click the convert button. Download your images individually or as a single ZIP archive." }
    ],
    faqs: [
      { q: "What is the difference between converting pages and extracting images?", a: "Converting pages renders each full page of your PDF as a separate image. Extracting images pulls only the raw, embedded graphic files out of the PDF, ignoring text and layout styling." },
      { q: "Can I convert password-protected PDFs?", a: "Currently, you must remove password protection from the PDF before uploading it for conversion." },
      { q: "What output image formats are supported?", a: "You can convert your PDF pages into high-resolution JPG or PNG formats depending on your needs." },
      { q: "Is converting sensitive PDFs safe?", a: "Yes. Files are processed securely over encrypted SSL connections. All uploaded documents and converted images are automatically deleted from our servers immediately after use." }
    ],
    benefits: [
      { title: "Dual Output Modes", text: "Render complete PDF pages as images or extract only the raw embedded graphics.", icon: "Layers" },
      { title: "ZIP Package Downloads", text: "Convert multi-page PDFs and download all output images at once in a single ZIP file.", icon: "Sparkles" },
      { title: "Secure Processing", text: "Files are handled securely and deleted immediately after processing.", icon: "Shield" }
    ],
    comparisonTable: {
      title: "PDF Page Conversion vs. Image Extraction",
      headers: ["Action", "Convert PDF Pages", "Extract Embedded Images"],
      rows: [
        ["Result", "Renders full pages (including text and styling) as images", "Extracts only raw graphic files embedded inside the PDF"],
        ["Page Layout", "Preserved exactly as seen on screen", "Layout discarded; returns only raw image assets"],
        ["Output Count", "Always equals the total page count of the PDF", "Depends on the number of images embedded in the document"],
        ["Best Used For", "Sharing slides, displaying documents on social media", "Saving original photos from a document"]
      ]
    },
    technicalDescription: "Converting PDF to images involves rasterizing vector and layout instructions into pixel values. The converter decodes page layouts, processes vector objects and text overlays, and renders the result onto a rasterized grid. It then encodes this grid into JPG or PNG formats. This allows users to view, share, or edit PDF pages without requiring a PDF reader."
  }
})
