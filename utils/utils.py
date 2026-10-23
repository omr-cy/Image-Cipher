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
pxls_cipher.restype  = ct.c_void_p # Returns a Pointer of Pixles. aka cipherd_pxls


"""The Python Helpers Functions"""
def extract_pxls(img_array, pxls_len, coordinates_json):
    # Extraxt Pixles in Coordinates aka crds
    pxls = (Pixle * pxls_len)()

    for i in range(pxls_len):
        c = coordinates_json[i]
        pxls[i] = Pixle(*img_array[c["x"]][c["y"]][0:3]) # only rgb

    # Return the Extracted
    return pxls


# def replace_pxls(img_array, cipherd_pxls, pxls_len, coordinates_json):
#     for i in range(pxls_len):
#         c = coordinates_json[i]
#         img_array[c["x"]][c["y"]][0:3] = np.array((cipherd_pxls[i].r, cipherd_pxls[i].g, cipherd_pxls[i].b))
#     return img_array
