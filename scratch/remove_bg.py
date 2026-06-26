import os
from PIL import Image, ImageDraw

def remove_background(img_path, output_path, tolerance=15):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    # We want to perform flood fill from the corners
    # Let's create a binary mask of background pixels
    # Initially all pixels are 0 (not background)
    mask = Image.new("L", (width, height), 0)
    
    # We will use flood fill on the original image
    # To do flood fill, we find pixels close to (255, 255, 255, 255)
    # PIL's ImageDraw.floodfill can do this.
    # We do floodfill on a copy of the image or on the mask
    # Let's convert img to grayscale or keep RGBA.
    # To flood fill with tolerance, we can do it by finding connected components of near-white pixels.
    # Let's implement a simple BFS flood fill in Python to have full control over the tolerance.
    
    data = img.load()
    visited = set()
    queue = []
    
    # Start points: the four corners and along the edges
    start_points = []
    for x in range(width):
        start_points.append((x, 0))
        start_points.append((x, height - 1))
    for y in range(height):
        start_points.append((0, y))
        start_points.append((width - 1, y))
        
    for pt in start_points:
        r, g, b, a = data[pt]
        # if near white
        if r >= 255 - tolerance and g >= 255 - tolerance and b >= 255 - tolerance:
            if pt not in visited:
                queue.append(pt)
                visited.add(pt)
                
    while queue:
        cx, cy = queue.pop(0)
        # Mark as background in our mask
        mask.putpixel((cx, cy), 255)
        
        # Check 4-neighbors
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    nr, ng, nb, na = data[(nx, ny)]
                    if nr >= 255 - tolerance and ng >= 255 - tolerance and nb >= 255 - tolerance:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # Now create the final image where background is transparent
    new_data = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = data[(x, y)]
            bg_val = mask.getpixel((x, y))
            if bg_val == 255:
                # Background -> Transparent
                new_data.append((r, g, b, 0))
            else:
                new_data.append((r, g, b, a))
                
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Background removed. Saved to {output_path}")

if __name__ == "__main__":
    img_path = "public/logo/mdm_logo.jpg"
    output_path = "public/logo/mdm_logo.png"
    remove_background(img_path, output_path, tolerance=25)
