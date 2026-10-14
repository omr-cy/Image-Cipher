#include "pxls_encryptor.h"

// Affine Cipher: for Encrypt
// ---------------------------
// C = ((a * x) + b) mod 256
// ---------------------------
// Key = a & b
// x = the cypher goal
// C = is the result
// ---------------------------

pixle encrypt_pxl(pixle pxl, affkey key)
{
    pixle encrypted_pxl; // Encrypted Pixle
    encrypted_pxl.red = ((key.a * pxl.red) + key.b) % 256;
    encrypted_pxl.green = ((key.a * pxl.green) + key.b) % 256;
    encrypted_pxl.blue = ((key.a * pxl.blue) + key.b) % 256;
    return encrypted_pxl;
}

pixle* encrypt_pxls(pixle pxls[], int pxls_num, affkey key)
{
    pixle *encrypted_pxls = malloc(sizeof(pixle ) * pxls_num);

    for (int i = 0; i < pxls_num; i++)
    {
        encrypted_pxls[i] = encrypt_pxl(pxls[i], key);
    }
    return encrypted_pxls;
}
