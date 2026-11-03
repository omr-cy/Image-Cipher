# Image Cipher

## Video Demo:  <URL HERE>

## Description:

> My Idea

A Program Can Encrypt and also Decrypt a **Part** or a **Section** of Image with password.

---

> Detailed

- Hybrid Code (`C`, `Python`, `Web`)
- For Encrypt and Decrypt Pixels (Back-end) Using:  `C`,
- For User Interface (Front-end) Using: `HTML CSS JavaScript`
- For **API** Between (Front-end) and (Back-end) and more.., Using: `Python` > `Flask`,

---

> Input & Process & Output (Algorithm)

1. Import a part of image 
2. Encrypt/Decrypt the selected pixels with the password.
3. Append a compressed metadata block to the image bytes. The block stores the source format, image

---

> metadata: ICMETA(S/E) aka Image Cipher Meta Data (Starts or Ends)

```
image as base64 bytes + b"ICMETAS" + Coords.json as base64 bytes + b"ICMETAE"
```

----

## My Terrible Explaining

### Backend

I just impeleminted the Code that will take the pxls as C Pixle Struct and Cipherd in the memory without making a buffer to make it fast

#### `helpers.c`, `helpers.h`,

> contains the helpers function like;
> `generate_hex_keys()`: that takes a passowrd and spliting into a nodes of hex characters, thene returns it.
> `Pixle`: Struct that stores the RGB colors like the RGBTRIPLE in "Problem Set 4/filter"

#### `main.c`, `compile.sh`   
> `main.c`: the core of the project, takes a origin_pxls and encrypt it with the generate_hex_keys(password)
> `compile.sh`: makes a python library to use it with `ctypes` in python
> `main.so`: the actual compiled library

### Frontend

I impeleminted the code that will take the image and there coords and send it to the backend aka Flask

i added `layout.html` the recommended convention for adding template to save my time.

i also added `Cropper JS` Frame work to save my time and taking the selected part form the user.

### API

`app.py`, `helpers.py`: 
- the API between the frontend and the backend,
- it handells the errors that may come form the user,


### Design Decisions

During the development of this project, one of the most critical architectural decisions involved determining the most efficient way to handle and transfer data between the frontend, the Python backend, and the C processing layer. 

**The Alternative Considered (Raw Pixel Arrays via JSON):**
Initially, I experimented with sending raw pixel data directly from the frontend as a JSON array. However, this approach introduced significant performance bottlenecks. Transmitting pixel data as JSON massively bloats the payload size—often increasing it to two or three times the original size. Since each pixel requires approximately 3 bytes for RGB values and must be serialized into text-based JSON integers, the overhead for serialization, network transfer, and deserialization became unacceptably high and inefficient.

**The Chosen Approach (Image & Bounding Coordinates):**
To resolve this, I opted for a much more lightweight and efficient approach: sending the image file itself along with precise bounding box coordinates (`x`, `y`, `width`, and `height`). Instead of serializing every single pixel into a heavy JSON structure, the frontend simply passes the image file and the target coordinates to Python, which then forwards them to the C layer. This drastically reduces payload size, minimizes memory overhead, and ensures fast, seamless communication and processing.

----

## Honesty

The Idea Is complete 100% from me.

I wrote 95% of the code in C, except for the SHA256 library, which I downloaded from this link <https://lucidar.me/en/dev-c-cpp/sha-256-in-c-cpp/#top>

So in python Almost of the code by me except the decrypt i got alot help from the AIs, But I reviewed and checked it

Immm With the `CSS` for Honesty I'm a terrible front-end designer, so i got help with the AIs, and with the wonderful Framework (Cropper.js) it's saved me alot of time.

With `HTML` All pages from me, except the decrypt page because it's jsut like copy and pest.

With The `Javascipt` i wrote the core of the functions and i got a good imporved from the AIs

I tried to keep on the Convension like adding `helpers.c`, `helpers.py` and `baakend`, `frontend` folders, `static` and ....

> What i learned: `/Image-Cipher/Resources.md` 

> My Pseudocodes: `/Image-Cipher/Pseudocodes.pdf`

---

## Finally

I tried to mex all what i learned with cs50 in one project.

**I truly thank you guys from my heart for this exciting journey.**

And yeah, I love writing in Markdown cause im using Obsidian for my notes.




