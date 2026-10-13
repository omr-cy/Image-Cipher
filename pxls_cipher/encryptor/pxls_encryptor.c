#include "../helpers.h"

pixle encrypt_pxl(pixle pxl, affkey key)
{
    // Affine Cipher: for Encrypt
    // C = ((a * x) + b) mod 26
    // ---------------------------
    // Key = a & b
    // x = the cypher goal
    // C = is the result
    // ---------------------------
    pixle encrypted_pxl; // Encrypted Pixle
    encrypted_pxl.red = ((key.a * pxl.red) + key.b) % 256;
    encrypted_pxl.green = ((key.a * pxl.green) + key.b) % 256;
    encrypted_pxl.blue = ((key.a * pxl.blue) + key.b) % 256;
    return encrypted_pxl;
}
