from ctypes import CDLL, c_char_p

# Importing the c backend
backend = CDLL("./backend/main.so")

# Get pxls_cipher
pxls_cipher = backend.pxls_cipher

# Define the types of the (arguments and results) in pxls_cipher()
pxls_cipher.argtypes = [c_char_p, c_char_p]
pxls_cipher.restype  = c_char_p
