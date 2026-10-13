#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include "sha256.h"

// Create a Pexle Structuer:
typedef struct {
    int red;
    int green;
    int blue;
} pixle;

// Create Affine Key Structuer
typedef struct {
    long a;
    long b;
} affkey;

// Define the Functions Prototypes
pixle str_to_pixle(char *rgb);
affkey generate_key(char *password);
pixle encrypt_pxl(pixle pxl, affkey key);
// pixle decrypt_pxl(pixle pxl, affkey key);

// The Main Entry
int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        printf("Usage: enCipher pixle password\n");
        printf("Hint : enCipher 56,255,69 pass123!!\n");
        return 1;
    }
    pixle pxl = str_to_pixle(argv[1]);
    printf("%i,%i,%i \n", pxl.red, pxl.green, pxl.blue);

    affkey key = generate_key(argv[2]);
    printf("Key.a: %li\n", key.a);
    printf("Key.b: %li\n", key.b);

    pixle encrypted_pxl = encrypt_pxl(pxl, key);
    printf("%i,%i,%i \n", encrypted_pxl.red, encrypted_pxl.green, encrypted_pxl.blue);

    return 0;
}

// Convert the Input string to Pixle
pixle str_to_pixle(char *rgb)
{
    // atoi() // String to an Integer
    // strtok() // String Splitter
    pixle pxl;
    pxl.red = atoi(strtok(rgb, ","));
    pxl.green = atoi(strtok(NULL, ","));
    pxl.blue = atoi(strtok(NULL, ","));
    return pxl;
}

// Hash Password and Convert it to Long Integer Key
affkey generate_key(char *password)
{
    // Allocate Memory and Compute SHA-256 sum. from "sha256.c"
    char hex[SHA256_HEX_SIZE];
    sha256_hex(password, strlen(password), hex);
    // Compute SHA256
    long pure_key = 0;
    affkey key;
    for (int i = 0, len = strlen(password); i < len; i++)
    {
        pure_key += password[i];
    }
    for (int i = 0, len = strlen(hex); i < len; i++)
    {
        pure_key += hex[i];
    }
    // Check the order
    if (pure_key % 2 != 0)
    {
        pure_key += 1;
    }
    key.a = (pure_key + 1) - (pure_key / 2);
    key.b = pure_key - (pure_key / 2);
    return key;
}

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

// pixle decrypt_pxl(pixle pxl, affkey key)
// {
//     // Affine Cipher: for Decrypt
//     // X = ((a^-1) * (c-b)) mod 26
//     // ---------------------------
//     pixle decrypted_pxl; // Decrypted Pixle
//     decrypted_pxl.red = ((key.a^-1) * (pxl.red - key.b)) % 256;
//     decrypted_pxl.green = ((key.a^-1) * (pxl.green - key.b)) % 256;
//     decrypted_pxl.blue = ((key.a^-1) * (pxl.blue - key.b)) % 256;
//     return decrypted_pxl;
// }
