## Image Cipher

### Need to know

هل في طريقة اخفي بيها بيانات جوه صورة ؟
- بوضع Metadata بعد الباينري بتاع الصورة `IPC: pxl, pxl, pxl`

هل في طريقة تحويل الباسورد لأرقام ؟
- ممكن احول كل `char` لباينري والباينري احوله لرقم واجمع كل الحروف مع بعض

هل في طريقة اشفر الـ `RGP` بالباصورد منغير خسارة للبيانات او الألوان تتلف ؟

إيه الطريقة اللي اقدر اوصل بيها لبيكسل محدد ؟ أو بيكسلات ؟

أزاي اجيب أرتفاع وعرض الصورة ؟

----
### Idea

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
### C Part Steps 

>After ending the `C` Language Lectures, will trying to build the `C` Part of the Program.

#### enCipher

> Input

first need to take the *Image*, *Pexeles-locations*, and *Encrypt-Password* as arguments.
`./enCipher img pxls pass`

---

> Process & Output

1. Import the Image as a raw data.
2. Encrypt the selected `pxls` with the Encrypt-Password.
3. Create a Metadata in the last of the **Raw Data**, Contains the location of the encrypted `pxls`
4. Encrypt the Metadata with xor key.
5. Return the Ciphered Image.

---

#### deCipher



----
