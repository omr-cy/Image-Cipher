# All What i need here !
import ctypes as ct
import numpy as np
import base64
from io import BytesIO
import json
from PIL import Image


# Making a C Pixle  type
class Pixle(ct.Structure):
    _fields_ = [
        ("r", ct.c_int),
        ("g", ct.c_int),
        ("b", ct.c_int)
    ]

# Making a Pointer of an Arry of Pixles
c_pixle_p = ct.POINTER(Pixle)

# Importing the c backend
backend = ct.CDLL("./backend/main.so")

# Get pxls_cipher
pxls_cipher = backend.pxls_cipher

# Define the types of the (arguments and results) in pxls_cipher()
pxls_cipher.argtypes = [c_pixle_p, ct.c_int, ct.c_char_p] # Takes a Pointer of Pixles, & a String. aka (origin_pxls, passwd)
pxls_cipher.restype  = None # The C function edits the pixel array in place.

"""
Payload in JS: { image: base64Image, passwd: password.value };
"""


"""The Python Helpers Functions"""
"""
    NOTE: I got a lot help from AIs with this functions, 
    NOTE: AI improved my code not write it all.
"""
def extract_pxls(image_array, coords): 
    x, y = int(coords["x"]), int(coords["y"])
    width, height = int(coords["width"]), int(coords["height"])

    region = image_array[y:y + height, x:x + width, :3].reshape(-1, 3)
    pxls = (Pixle * len(region))()

    for i, (r, g, b) in enumerate(region):
        pxls[i] = Pixle(int(r), int(g), int(b))

    return pxls 


def pxls_to_arr(pxls):
    cipherd = []
    for pxl in pxls:
        cipherd.append([pxl.r, pxl.g, pxl.b])

    return np.array(cipherd)


def inject_meta(img_base64, coords):
    image_data = base64.b64decode(img_base64)
    metadata = json.dumps(coords).encode()
    marker = b"ICMETA"
    payload = image_data + marker + len(metadata).to_bytes(4, "big") + metadata + marker
    return base64.b64encode(payload)


def _metadata_bounds(img_base64):
    image_data = base64.b64decode(img_base64, validate=True)
    marker = b"ICMETA"
    footer = len(image_data) - len(marker)
    if image_data[footer:] != marker:
        return None

    for start in range(footer - len(marker) - 4, -1, -1):
        if image_data[start:start + len(marker)] != marker:
            continue
        length_start = start + len(marker)
        metadata_length = int.from_bytes(image_data[length_start:length_start + 4], "big")
        if length_start + 4 + metadata_length == footer:
            return image_data, start, length_start + 4, footer
    return None


def ismarked(img_base64):
    try:
        return _metadata_bounds(img_base64) is not None
    except (TypeError, ValueError):
        return False

def extract_meta(img_base64):
    bounds = _metadata_bounds(img_base64)
    if bounds is None:
        raise ValueError("Image metadata is missing or invalid.")
    image_data, _, start, end = bounds
    return json.loads(image_data[start:end])
    

"""The Python Cypher Function"""
def cypher(img_base64, coords, passwd):

    # Decode the base64 image
    img_data = base64.b64decode(img_base64)
    
    # Convert the Image to a 2D Array
    img_array = np.array(Image.open(BytesIO(img_data))) # rgb inside pxl data[x][y][0:3]

    # Extracting the pxls from the Image aka Array
    pxls = extract_pxls(img_array, coords)
    pxls_len = len(pxls)
    
    # Encrypting The Pixles with pxls_cipher
    pxls_cipher(pxls, pxls_len, passwd.encode())
    
    # Convert the cipherd pxls to an array of pxls
    cipherd_pxls = pxls_to_arr(pxls)
    x, y = int(coords["x"]), int(coords["y"])
    width, height = int(coords["width"]), int(coords["height"])
    img_array[y:y + height, x:x + width, :3] = cipherd_pxls.reshape(height, width, 3)

    # Encode the complete encrypted image, then append the coordinate metadata.
    output = BytesIO()
    Image.fromarray(img_array).save(output, format="PNG")
    encrypted_image = base64.b64encode(output.getvalue())

    return inject_meta(encrypted_image, coords)


def decipher(img_base64, passwd):
    # the Truth is it with AI
    bounds = _metadata_bounds(img_base64)
    if bounds is None:
        raise ValueError("This image is not encrypted or its metadata is invalid.")

    image_data, image_end, metadata_start, metadata_end = bounds
    coords = json.loads(image_data[metadata_start:metadata_end])
    if not isinstance(coords, dict):
        raise ValueError("Image metadata contains invalid coordinates.")

    img_array = np.array(Image.open(BytesIO(image_data[:image_end])))
    if img_array.ndim != 3 or img_array.shape[2] < 3:
        raise ValueError("The encrypted image must have RGB color channels.")

    try:
        x, y = int(coords["x"]), int(coords["y"])
        width, height = int(coords["width"]), int(coords["height"])
    except (KeyError, TypeError, ValueError) as error:
        raise ValueError("Image metadata contains invalid coordinates.") from error

    if (
        x < 0 or y < 0 or width <= 0 or height <= 0
        or x + width > img_array.shape[1]
        or y + height > img_array.shape[0]
    ):
        raise ValueError("Image metadata coordinates are outside the image.")

    pxls = extract_pxls(img_array, coords)
    pxls_cipher(pxls, len(pxls), passwd.encode())
    decrypted_pxls = pxls_to_arr(pxls).reshape(height, width, 3)
    img_array[y:y + height, x:x + width, :3] = decrypted_pxls

    output = BytesIO()
    Image.fromarray(img_array).save(output, format="PNG")
    return base64.b64encode(output.getvalue())
