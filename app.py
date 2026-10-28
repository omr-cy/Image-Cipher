#!/usr/bin/python3

from utils import *
from flask import Flask, render_template as rt


app = Flask(__name__, template_folder='./frontend')

@app.route("/")
def index():
	...
	
@app.route("/encryptor")
def encryptor():
	return rt("encryptor.html")
	# encryptor()
	...


# def main():
#     with open("/home/omr/Projects/Image-Cipher/utils/tests/image.base64", "rb") as bytes:
#         # Decode the base64 image
#         img_data = base64.b64decode(bytes.read())
#         # Convert the Image to a 2D Array
#         img_array = np.array(Image.open(BytesIO(img_data))) # row data[1], pxl in row data[1][2], rgb inside pxl data[1][2][0:3]
# 
#     with open("./utils/tests/pxls_coordinates.json", "r") as file:
#         coordinates_json = json.loads(file.read())

