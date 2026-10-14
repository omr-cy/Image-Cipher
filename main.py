#!/usr/bin/python3

from ctypes import CDLL, c_char_p, c_int

# get the code of pxls_cipher
pxls_cipher = CDLL("./pxls_cipher/pxls_cipher.so").pxls_cipher

# define the types of the function arguments and results.
pxls_cipher.argtypes = [c_char_p, c_char_p, c_char_p]
pxls_cipher.restype  = c_char_p

# run the function
action = b"e"
pixles = (b"56,95,69/"*300).strip(b'/')
passwd = b"pass123"

result_bytes = pxls_cipher(action, pixles, passwd)

# print the results
if result_bytes:
    print(result_bytes.decode())
