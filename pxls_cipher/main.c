#include "encryptor/pxls_encryptor.h"
// #include "decryptor/pxls_decryptor.h"

// The Main App
int main(int argc, char *argv[])
{
    if (argc != 4)
    {
        printf("Usage: pxls_cipher action pixles password\n");
        printf("Hint : pxls_cipher encrypt (56,255,69)(56,255,69)(56,255,69) pass123!!\n");
        return 1;
    }
    else if (strcmp(argv[1], "encrypt") == 0)
    {
        pixle pxl = str_to_pixle(argv[2]);
        affkey key = generate_key(argv[3]);
        pixle encrypted_pxl = encrypt_pxl(pxl, key);
    }
    else if (strcmp(argv[1], "decrypt") == 0)
    {
        pixle pxl = str_to_pixle(argv[2]);
        affkey key = generate_key(argv[3]);
        // pixle encrypted_pxl = encrypt_pxl(pxl, key);
    }
    else
    {
        printf("The available actions is (encrypt or decrypt).\n");
        return 1;
    }

    return 0;
}
