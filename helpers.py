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
Payload from JS: { pxls: base64Image, passwd: password };
"""


"""The Python Cypher Function"""
def cypher(pxls_base64, passwd):

    # Decode the base64 image
    pxls_raw = BytesIO(base64.b64decode(pxls_base64))
    
    # Make it as Image Object 
    pxls_obj = Image.open(pxls_raw)

    # Get width and height
    w, h = pxls_obj.size

    # Get Length of Pixles
    pxls_len = w * h

    # Convert the Image to a 2D Array
    pxls_arr = np.array(pxls_obj) # rgb inside pxl data[x][y][0:3]

    # Extracting the pxls from the Array and store it in c array,
    c_pxls = (Pixle * pxls_len)()
    idx = 0
    for i in range(h):
        for j in range(w):
            c_pxls[idx] = (Pixle(*pxls_arr[i][j][0:3]))
            idx += 1

    # Encrypting The Pixles with pxls_cipher
    pxls_cipher(c_pxls, pxls_len, passwd.encode())
    
    # Return the cipherd pxls to the array of pxls
    idx = 0
    for i in range(h):
        for j in range(w):
            pxls_arr[i][j][0] = c_pxls[idx].r
            pxls_arr[i][j][1] = c_pxls[idx].g
            pxls_arr[i][j][2] = c_pxls[idx].b
            idx += 1

    # Image_object > Bytes > Base64 > return
    # return base64.b64encode(BytesIO(Image.fromarray(pxls_arr)))
    
    output = BytesIO()
    Image.fromarray(pxls_arr).save(output, format="PNG")
    return base64.b64encode(output.getvalue()).decode("ascii")

