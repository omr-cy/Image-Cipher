#include "encryptor/pxls_encryptor.h"
#include "helpers.h"
// #include "decryptor/pxls_decryptor.h"

// The Main App
int main(int argc, char *argv[])
{
    if (argc != 4)
    {
        printf("Usage: pxls_cipher action pixles password\n");
        printf("Hint : pxls_cipher encrypt 56,95,69/56,245,69/123,255,233 pass123!!\n");
        return 1;
    }
    // Make const of action because it must be unchanged
    const char *action = argv[1];

    // Getting the number of the pixles
    int pxls_num = get_pxls_number(argv[2]);

    // Parsing text to get pixles
    pixle *pxls = parse_pxls(argv[2], pxls_num);

    // Generating the Key
    affkey key = generate_key(argv[2]);

    // If the action is Encrypt:
    if (strcmp(action, "encrypt") == 0 || strcmp(action, "e") == 0)
    {
        // Encrypt the pixles with the affin cipher
        pixle *encrypted_pxls = encrypt_pxls(pxls, pxls_num, key);

        // Free what i allocate with my self
        free(pxls);
        pxls = encrypted_pxls;
    }
    else if (strcmp(action, "decrypt") == 0 || strcmp(action, "d") == 0)
    {
        // Encrypt the pixles with the affin cipher
        // pixle *decrypted_pxls = decrypt_pxls(pxls, pxls_num, key);

        // Free what i allocate with my self
        free(pxls);
        // pxls = decrypted_pxls;
    }

    // Make output
    char *output = concatenate_pxls(pxls, pxls_num);

    // Print the output
    if (output != NULL)
    {
        printf("%s\n", output);
    }

    // Free what i allocate with my self
    free(output);
    free(pxls);
    return 0;
}
