#!/usr/bin/python3
from utils.extractors import extract_pxls, pxls_arr_to_str, swap_pxls
from utils.ciphers import pxls_cipher
import base64
import json
import numpy as np
from PIL import Image
from io import BytesIO


with open("/home/omr/Projects/Image-Cipher/utils/tests/image.base64", "rb") as raw:
    # Decode the base64 image
    img_data = base64.b64decode(raw.read())
    # Convert the Image to a 2D Array
    img_array = np.array(Image.open(BytesIO(img_data))) # row data[1], pxl in row data[1][2], rgb inside pxl data[1][2][0:3]

with open("./utils/tests/pxls_coordinates.json", "r") as file:
    coordinates_json = json.loads(file.read())

origin_pxls = extract_pxls(img_array, coordinates_json)
str_pxls = pxls_arr_to_str(origin_pxls).strip("/")
cipherd_pxls = pxls_cipher(str_pxls.encode(), b"Om15112002Ar!")

cipherd_pxls_array = np.array(cipherd_pxls.decode().split("/"))

cipherd_img_array = swap_pxls(img_array, coordinates_json, cipherd_pxls_array)

cipherd_img = Image.fromarray(cipherd_img_array)

cipherd_img.save("./utils/tests/cipherd_img.png")
