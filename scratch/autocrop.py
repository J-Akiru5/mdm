from PIL import Image

def autocrop(image_path, output_path):
    img = Image.open(image_path)
    # Get the bounding box of non-zero (non-transparent) pixels
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
        cropped.save(output_path)
        print(f"Cropped image from {img.size} to {cropped.size} and saved to {output_path}")
    else:
        print("No non-transparent pixels found!")

if __name__ == "__main__":
    autocrop("public/logo/mdm_logo.png", "public/logo/mdm_logo.png")
