#!/usr/bin/python3

from flask import Flask, jsonify, render_template as rt, request

from helpers import *

app = Flask(__name__, template_folder="./frontend/templates", static_folder="./frontend/static")


@app.route("/")
def index():
	return rt("index.html")


@app.route("/encrypt", methods=["GET", "POST"])
def encrypt():
	if request.method == "POST":

		# Validate Image
		img_base64 = request.json.get("image")
		if not img_base64:
			return "<p>Error with image</p>", 400

		# Validate Coords
		coords = request.json.get("coords")
		if not coords:
			return "<p>Error with coords</p>", 400
		
		# Validate Password
		passwd = request.json.get("passwd")
		if not passwd or len(passwd) < 8:
			return "<p>Error with password</p>", 400

		encrypted_image = cypher(img_base64, coords, passwd)
		return jsonify(
			image=encrypted_image.decode("ascii"),
			imageType="image/png",
		)

	return rt("encrypt.html")


@app.route("/decrypt", methods=["GET", "POST"])
def decrypt():
	# NOTE: AI has written this code and i reveiwit after that
	if request.method == "POST":
		payload = request.get_json(silent=True)
		if not isinstance(payload, dict):
			return jsonify(error="Invalid JSON request."), 400

		img_base64 = payload.get("image")
		passwd = payload.get("passwd")
		if not isinstance(img_base64, str) or not img_base64:
			return jsonify(error="Image is required."), 400
		if not isinstance(passwd, str) or len(passwd) < 8:
			return jsonify(error="Password must be at least 8 characters."), 400

		try:
			decrypted_image = decipher(img_base64, passwd)
		except (OSError, TypeError, ValueError) as error:
			return jsonify(error=str(error)), 400

		return jsonify(
			image=decrypted_image.decode("ascii"),
			imageType="image/png",
		)


	return rt("decrypt.html")