# Image Cipher

## Idea

>Simple

A Program Can Encrypt and also Decrypt a **Part** or a **Section** of Image with password.

---

>Detailed

- Hybrid Code (`C`, `Python`, `JavaScript`)
- For Encrypt and Decrypt Pixels (Back-end) Using:  `C`,
- For User Interface (Front-end) Using: `JavaScript` > `ReactJS`
- For **API** Between (Front-end) and (Back-end) Using: `Python` > `Flask`,
- For Mobile Front-end Using: `Capacitor` program.

---

## C Part Steps (pxls_cipher)

> Usage: `pxls_cipher action pixles password

> Hint : `pxls_cipher encrypt 56,95,69/56,245,69/123,255,233 pass123!!

---


## Input & Process & Output

1. Import the Image as a raw data.
2. Encrypt the selected `pxls` with the Encrypt-Password.
3. Create a Metadata in the last of the **Raw Data**, Contains the location of the encrypted `pxls`
4. Encrypt the Metadata with xor key.
5. Return the Ciphered Image.

