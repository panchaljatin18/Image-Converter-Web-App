import os
import sys
import shutil
# pyrefly: ignore [missing-import]
from pdf2image import convert_from_path

def get_poppler_path():
    # 1. If pdftoppm is in PATH, convert_from_path handles it automatically
    if shutil.which("pdftoppm"):
        return None
    # 2. Try POPPLER_PATH from environment variable
    env_path = os.environ.get("POPPLER_PATH")
    if env_path:
        return env_path
    # 3. Try POPPLER_COMMAND parent directory
    cmd_path = os.environ.get("POPPLER_COMMAND")
    if cmd_path and os.path.isdir(os.path.dirname(cmd_path)):
        return os.path.dirname(cmd_path)
    return None

def main():
    if len(sys.argv) < 4:
        print("Usage: python pdf_to_image.py <input_pdf> <output_dir> <format> [dpi]", file=sys.stderr)
        sys.exit(1)

    input_pdf = sys.argv[1]
    output_dir = sys.argv[2]
    fmt = sys.argv[3].lower()
    dpi = int(sys.argv[4]) if len(sys.argv) > 4 else 150

    if not os.path.exists(input_pdf):
        print(f"Error: Input file {input_pdf} not found.", file=sys.stderr)
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    poppler_path = get_poppler_path()
    try:
        pages = convert_from_path(input_pdf, dpi=dpi, poppler_path=poppler_path)
        generated_files = []
        for i, page in enumerate(pages):
            filename = f"page_{i + 1}.{fmt}"
            filepath = os.path.join(output_dir, filename)
            page.save(filepath, fmt.upper())
            generated_files.append(filepath)
        
        # Print generated file paths to stdout
        print(",".join(generated_files))
    except Exception as e:
        print(f"PDF Conversion error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
