#include "helpers/helpers.h"

// The pxls_cipher
char* pxls_cipher(char *pixles, char *passwd)
{
    // Getting the number of the pixles
    int pxls_len = get_pxls_len(pixles);

    // Parsing text to get pixles
    pixle *pxls = parse_pxls(pixles, pxls_len);

    // Generating the Key
    int *hex_keys = generate_hex_keys(passwd);

    // Encrypt/Decrypt the pixles with the xor cipher
    pixle *cipherd_pxls = pxls_xor_cipher(pxls, pxls_len, hex_keys);

    // Make output
    char *output = concatenate_pxls(cipherd_pxls, pxls_len);

    // Free what i allocate with my self
    free(pxls);
    free(hex_keys);
    free(cipherd_pxls);
    return output;
}

// // The Main App for CLI
// int main(int argc, char *argv[])
// {
//     // Checking the arguments
//     if (argc != 3)
//     {
//         printf("Usage: pxls_cipher pixles password\n");
//         printf("Hint : pxls_cipher 56,95,69/56,245,69/123,255,233 pass123!!\n");
//         return 1;
//     }
//
//     // Make output
//     char *output = pxls_cipher(argv[2], argv[3]);
//
//     // Print the output
//     printf("%s\n", output);
//
//     // Free what i allocate with my self
//     free(output);
//     return 0;
// }
