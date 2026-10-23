#include "helpers/helpers.h"

// The pxls_cipher
void pxls_cipher(pixle *pxls, int pxls_len, char *passwd)
{
    // Generating the Key
    int *hex_keys = generate_hex_keys(passwd);

    // Encrypt/Decrypt the pixles with the xor cipher
    pxls_xor_cipher(pxls, pxls_len, hex_keys);

    // Free what i allocated with my self
    // free(pxls); // NOTE: Do not free this !! it's Allocated py python
    free(hex_keys);
    return;
}

// The Main App for CLI
int main(int argc, char *argv[])
{
    // Checking the arguments
    // argv[1] == pixles, argv[2] == password
    if (argc != 3)
    {
        printf("Usage: pxls_cipher pixles password\n");
        printf("Hint : pxls_cipher 56,95,69/56,245,69/123,255,233 pass123!!\n");
        return 1;
    }
    // get pxls len
    int pxls_len = get_pxls_len(argv[1]);

    // Parsing text to get pixles
    pixle *pxls = parse_pxls(argv[1], pxls_len);

    // Encrypt/Decrypt pxls
    pxls_cipher(pxls, pxls_len, argv[2]);

    // Make output
    char *output = concatenate_pxls(pxls, pxls_len);

    // Print the output
    printf("%s\n", output);

    // Free what i allocated with my self
    free(pxls);
    free(output);
    return 0;
}
