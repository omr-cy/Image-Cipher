#!/usr/bin/python3
from ctypes import CDLL, c_char_p

# get the code of pxls_cipher
backend = CDLL("./backend/main.so")
pxls_cipher = backend.pxls_cipher

# define the types of the function arguments and results.
pxls_cipher.argtypes = [c_char_p, c_char_p]
pxls_cipher.restype  = c_char_p

# run the function
pixles = (b"56,95,69/"*10).strip(b'/')
passwd = b"pass123"

result_bytes = pxls_cipher(pixles, passwd)

# print the results
if result_bytes:
    print(result_bytes.decode())
