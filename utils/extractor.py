import numpy as np
from PIL import Image
import json
import base64
from io import BytesIO

with open("image.base64", "rb") as img_base64:
    img_data = base64.b64decode(img_base64.read())

with open("pixles_locations.json", "r") as file:
    locations_json = json.loads(file.read())

# r1, g1, b1 = 0, 0, 0 # Original value
# r2, g2, b2 = 255, 255, 255 # Value that we want to replace it with

# img = Image.fromarray(data)
# img.save('image_modified.png')

def extract_pxls(img_data, locations_json):
    # Convert the Image to a 2D Array
    img = Image.open(BytesIO(img_data))
    img = np.array(img) # row data[1], pxl in row data[1][2], rgb inside pxl data[1][2][0:3]

    # Extraxt Pixles in Locations
    pxls = []
    for cn in locations_json:
        pxl = img[cn["x"]][cn["y"]][0:3] # only rgb
        pxls.append(pxl)

    # Return the Extracted Pixles
    return np.array(pxls)

pxls = extract_pxls(img_data, locations_json)
print(pxls)
