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

		pxls_base64 = request.json.get("pxls")
		if not pxls_base64:
			return "<p>Error with image</p>", 400
		
		# Validate Password
		passwd = request.json.get("passwd")
		if not passwd or len(passwd) < 8:
			return "<p>Error with password</p>", 400

		return jsonify(
			encrypted_pxls=cypher(pxls_base64, passwd),
		)

	return rt("encrypt.html")


@app.route("/decrypt", methods=["GET", "POST"])
def decrypt():
	if request.method == "POST":

		pxls_base64 = request.json.get("pxls")
		if not pxls_base64:
			return "<p>Error with image</p>", 400
		
		# Validate Password
		passwd = request.json.get("passwd")
		if not passwd or len(passwd) < 8:
			return "<p>Error with password</p>", 400


		return jsonify(
			decrypted_pxls=cypher(pxls_base64, passwd),
		)

	return rt("decrypt.html")