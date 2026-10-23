#!/usr/bin/python3

from utils import *


def main():
    with open("/home/omr/Projects/Image-Cipher/utils/tests/image.base64", "rb") as bytes:
        # Decode the base64 image
        img_data = base64.b64decode(bytes.read())
        # Convert the Image to a 2D Array
        img_array = np.array(Image.open(BytesIO(img_data))) # row data[1], pxl in row data[1][2], rgb inside pxl data[1][2][0:3]

    with open("./utils/tests/pxls_coordinates.json", "r") as file:
        coordinates_json = json.loads(file.read())

    pxls_len = len(coordinates_json)

    pxls = extract_pxls(img_array, pxls_len, coordinates_json)

    # cipherd_pxls = pxls_cipher(origin_pxls, pxls_len, b"omar123")
    pxls_cipher(pxls, pxls_len, b"omar123!AAAAAA")

    # Replace pxls aka Swap them
    for i in range(pxls_len):
        c = coordinates_json[i]
        img_array[c["x"]][c["y"]][0:3] = np.array((pxls[i].r, pxls[i].g, pxls[i].b))

    cipherd_img = Image.fromarray(img_array)
    cipherd_img.save("./utils/tests/cipherd_img.png")


if __name__ == "__main__":
    main()
