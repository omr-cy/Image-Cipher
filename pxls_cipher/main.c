#include "encryptor/pxls_encryptor.h"
// #include "decryptor/pxls_decryptor.h"

// The Main App for Python
char* pxls_cipher(const char *action, char *pixles, char *password)
{
    // Getting the number of the pixles
    int pxls_len = get_pxls_len(pixles);

    // Parsing text to get pixles
    pixle *pxls = parse_pxls(pixles, pxls_len);

    // Generating the Key
    int key = generate_key(password);

    // If the action is Encrypt:
    if (strcmp(action, "encrypt") == 0 || strcmp(action, "e") == 0)
    {
        // Encrypt the pixles with the affin cipher
        pixle *encrypted_pxls = encrypt_pxls(pxls, pxls_len, key);

        // Free what i allocate with my self
        free(pxls);
        pxls = encrypted_pxls;
    }
    // If the action is Decrypt:
    else if (strcmp(action, "decrypt") == 0 || strcmp(action, "d") == 0)
    {
        // Encrypt the pixles with the affin cipher
        // pixle *decrypted_pxls = decrypt_pxls(pxls, pxls_len, key);
        pixle *encrypted_pxls = encrypt_pxls(pxls, pxls_len, key);

        // Free what i allocate with my self
        free(pxls);
        // pxls = decrypted_pxls;
        pxls = encrypted_pxls;
    }

    // Make output
    char *output = concatenate_pxls(pxls, pxls_len);
    // char *output = "lol";

    // Print the output
    if (output == NULL)
    {
        // Free what i allocate with my self
        free(pxls);
    }

    // Free what i allocate with my self
    free(pxls);
    return output;
}

// The Main App for CLI
int main(int argc, char *argv[])
{
    if (argc != 5)
    {
        printf("Usage: pxls_cipher action pixles password\n");
        printf("Hint : pxls_cipher encrypt 56,95,69/56,245,69/123,255,233 pass123!!\n");
        return 1;
    }

    char *output = pxls_cipher(argv[1], argv[2], argv[3]);

    // Print the output
    printf("%s\n", output);

    // Free what i allocate with my self
    free(output);
    return 0;
}
