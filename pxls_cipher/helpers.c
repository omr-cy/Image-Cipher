#include "helpers.h"


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
