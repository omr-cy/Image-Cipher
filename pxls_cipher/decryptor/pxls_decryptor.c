#include "pxls_decryptor.h"

// Affine Cipher: for Decrypt
// X = ((a^-1) * (c-b)) mod 26
// ---------------------------

pixle decrypt_pxl(pixle pxl, int key)
{
    // pixle decrypted_pxl; // Decrypted Pixle
    // decrypted_pxl.red = ((key.a^-1) * (pxl.red - key.b)) % 256;
    // decrypted_pxl.green = ((key.a^-1) * (pxl.green - key.b)) % 256;
    // decrypted_pxl.blue = ((key.a^-1) * (pxl.blue - key.b)) % 256;
    // return decrypted_pxl;

    // temp results
    pixle temp_pxl;
    return temp_pxl;
}
