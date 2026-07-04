import os
import sys
import cv2
import pytesseract
from PIL import Image

# Configure Tesseract binary path dynamically via environment variable
TESSERACT_CMD = os.environ.get("TESSERACT_COMMAND")
if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

def preprocess_image(image_path):
    # Use OpenCV to load and preprocess the image (convert to grayscale, apply Otsu's thresholding)
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Image not found or unreadable at {image_path}")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding
    threshold_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    
    # Save preprocessed image to a temp path
    temp_path = image_path + "_preprocessed.png"
    cv2.imwrite(temp_path, threshold_img)
    return temp_path

def main():
    if len(sys.argv) < 2:
        print("Usage: python ocr_extractor.py <image_path> [lang]", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "eng"

    if not os.path.exists(image_path):
        print(f"Error: Image file {image_path} not found.", file=sys.stderr)
        sys.exit(1)

    temp_path = None
    try:
        # Preprocess with OpenCV
        temp_path = preprocess_image(image_path)
        
        # Extract text using pytesseract
        text = pytesseract.image_to_string(Image.open(temp_path), lang=lang)
        print(text)
    except Exception as e:
        print(f"OCR error: {str(e)}", file=sys.stderr)
        sys.exit(1)
    finally:
        # Cleanup temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

if __name__ == "__main__":
    main()
