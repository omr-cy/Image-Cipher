#include "pxls_encryptor.h"

// Affine Cipher: for Encrypt
// ---------------------------
// C = ((a * x) + b) mod 256
// ---------------------------
// Key = a & b
// x = the cypher goal
// C = is the result
// ---------------------------

pixle encrypt_pxl(pixle pxl, int key)
{
    pixle encrypted_pxl; // Encrypted Pixle
    encrypted_pxl.red = key ^ pxl.red;
    encrypted_pxl.green = key ^ pxl.green;
    encrypted_pxl.blue = key ^ pxl.blue;
    return encrypted_pxl;
}

pixle* encrypt_pxls(pixle pxls[], int pxls_len, int key)
{
    pixle *encrypted_pxls = malloc(sizeof(pixle) * pxls_len);

    for (int i = 0; i < pxls_len; i++)
    {
        encrypted_pxls[i] = encrypt_pxl(pxls[i], key);
    }
    return encrypted_pxls;
}
