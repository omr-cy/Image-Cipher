import numpy as np

def extract_pxls(img_array, coordinates_json):
    # Extraxt Pixles in Locations
    pxls = []
    for c in coordinates_json:
        pxl = img_array[c["x"]][c["y"]][0:3] # only rgb
        pxls.append(pxl)

    # Return the Extracted Pixles
    return np.array(pxls)

def pxls_arr_to_str(pxls_arr):
    pxls_str = ""
    for p in pxls_arr:
        pxls_str += f"{p[0]},{p[1]},{p[2]}/"
    return pxls_str

def swap_pxls(img_array, coordinates_json, cipherd_pxls):
    for i in range(len(cipherd_pxls)):
        c = coordinates_json[i]
        pxl = [int(p) for p in cipherd_pxls[i].split(",") ]
        img_array[c["x"]][c["y"]][0:3] = pxl
    return img_array
