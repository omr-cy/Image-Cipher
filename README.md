# Image Cipher

## Idea

>Simple

A Program Can Encrypt and also Decrypt a **Part** or a **Section** of Image with password.

---

>Detailed

- Hybrid Code (`C`, `Python`, `Web`)
- For Encrypt and Decrypt Pixels (Back-end) Using:  `C`,
- For User Interface (Front-end) Using: `HTML CSS JavaScript`
- For **API** Between (Front-end) and (Back-end) and more.., Using: `Python` > `Flask`,

---

## Input & Process & Output

1. Import a single-frame image supported by Pillow (up to 23 MiB and 5 million pixels) and select a square area.
2. Encrypt the selected pixels with the password.
3. The server decodes the uploaded format and returns a lossless PNG so the pixel values remain reversible.
4. Append a compressed metadata block to the image bytes. The block stores the source format, image dimensions, crop rectangle, and encrypted pixel dimensions.

The binary metadata format is:

`image bytes + "ICMETA" + uint32_be(compressed length) + deflate(JSON metadata) + "ICMETA"`

The metadata framing is independent of the uploaded image format. Pillow-supported image inputs are normalized to PNG output so encryption and decryption remain reversible, including for lossy input formats.

The browser sends Base64 image data, Cropper coordinates (`x`, `y`, `width`, `height`), and the password as JSON to `/encrypt`. The response contains one Base64 PNG with the metadata trailer; the browser strips the trailer for preview while retaining it in the download. `/decrypt` accepts only the encrypted image and password; the server reads the crop coordinates from the metadata.

---
