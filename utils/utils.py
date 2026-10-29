# All What i need here !

import ctypes as ct
# import numpy as np
# import base64
# from io import BytesIO
# import json
# from PIL import Image


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


"""Example of what shoud the jsobject contains"""
'''
the jsobject contains
	{
		"pxls": [
			{"r":255, "g":247, "b":66},
			{"r":47, "g":99, "b":37},
			....
		],
		"plen": 7000
		"pass":"somePassWord123!!",
	}
'''


"""The Python Helpers Functions"""
# Convert the RGB dict to an array of Pixles
def to_pxls(rgb_dict, pxls_len):
    pxls = (Pixle * pxls_len)()
    for i in range(pxls_len):
        pxls[i] = Pixle(
            rgb_dict[i]["r"],
            rgb_dict[i]["g"],
            rgb_dict[i]["b"]
            )
    return pxls


# Convert the array of Pixles to RGB dict
def to_dict(pxls, pxls_len):
    rgb_dict = {}
    for i in range(pxls_len):
        rgb_dict[i] = {
            pxls[i].r,
            pxls[i].g,
            pxls[i].b
            }
    return rgb_dict


# """The Python Cypher Function"""
# def cypher(img_base64, coordinates, passwd):
    
        
#     # Decode the base64 image
#     img_data = base64.b64decode(bytes.read())
    
#     # Convert the Image to a 2D Array
#     img_array = np.array(Image.open(BytesIO(img_data))) # rgb inside pxl data[x][y][0:3]

#     # Storing the Length of the pxls for futers perbos
#     pxls_len = len(coordinates)
    
#     # Extracting the pxls from the Image aka Array
#     pxls = extract_pxls(img_array, pxls_len, coordinates)
    
#     # Encrypting The Pixles with pxls_cipher
#     pxls_cipher(pxls, pxls_len, passwd.decode())
    
#     return base64.encode(Image.fromarray(img_array))
