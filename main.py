#!/usr/bin/python3

from ctypes import CDLL, c_char_p

# get the code of pxls_cipher
pxls_cipher = CDLL("./pxls_cipher/pxls_cipher.so").pxls_cipher

# define the types of the function arguments and results.
pxls_cipher.argtypes = [c_char_p, c_char_p, c_char_p]
pxls_cipher.restype  = c_char_p

# run the function
result_bytes = pxls_cipher(b"e", b"56,95,69/56,245,69/123,255,233", b"pass123")

# print the results
if result_bytes:
    print(result_bytes.decode())
