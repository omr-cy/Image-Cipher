#!/usr/bin/python3

from utils import *
from flask import Flask, render_template as rt, request, jsonify


app = Flask(__name__, template_folder="./frontend/templates", static_folder="./frontend/static")


@app.route("/")
def index():
	return rt("index.html")


@app.route("/encryptor")
def encryptor():
	return rt("encryptor.html")


@app.route("/decryptor")
def decryptor():
	return rt("decryptor.html")


@app.route("/api", methods=["POST"])
def api():
	if not request.form.get("jsobject"):
		return rt("error.html")

	jsobject = request.form.get("jsobject")
	pxls = to_pxls(jsobject[0])

	pxls_cipher(
		pxls, # Origin Pixles
		jsobject[1], # Lingth
		jsobject[2], # Passwd
	)
	# This means converte pxls to a RGB dict and return it as json with jsonify
	return jsonify(to_dict(pxls))



# def main():
#     with open("/home/omr/Projects/Image-Cipher/utils/tests/image.base64", "rb") as bytes:
#         # Decode the base64 image
#         img_data = base64.b64decode(bytes.read())
#         # Convert the Image to a 2D Array
#         img_array = np.array(Image.open(BytesIO(img_data))) # row data[1], pxl in row data[1][2], rgb inside pxl data[1][2][0:3]
# 
#     with open("./utils/tests/pxls_coordinates.json", "r") as file:
#         coordinates_json = json.loads(file.read())

