#include "helpers.h"
#include <stdint.h>
#include <stdlib.h>

// Convert the Input string to Pixle
pixle str_to_pxl(char *rgb)
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
int generate_key(char *password)
{
    // Allocate Memory and Compute SHA-256 sum. from "sha256.c"
    char hex[SHA256_HEX_SIZE];
    sha256_hex(password, strlen(password), hex);

    // Making an key from the password and the sha256 of the password
    int key = 0;
    for (int i = 0, len = strlen(password); i < len; i++)
    {
        key += password[i];
    }
    for (int i = 0, len = strlen(hex); i < len; i++)
    {
        key += hex[i];
    }
    // Check the 256
    key = key % 256;
    return key;
}

pixle* xor_cipher(pixle *pxls, int pxls_len, int key)
{
    pixle *cipherd_pxls = malloc(sizeof(pixle) * pxls_len);
    for (int i = 0; i < pxls_len; i++)
    {
        cipherd_pxls[i].red = key ^ pxls[i].red;
        cipherd_pxls[i].green = key ^ pxls[i].green;
        cipherd_pxls[i].blue = key ^ pxls[i].blue;
    }
    return cipherd_pxls;
}

int get_pxls_len(char *pxls_txt)
{
    int pxls_len = 1;
    for (int i = 0, slen = strlen(pxls_txt); i < slen; i++)
    {
        if (pxls_txt[i] == '/')
        {
            pxls_len += 1;
        }
    }
    // printf("Pixles len in C: %i\n", pxls_len);
    return pxls_len;
}

pixle* parse_pxls(char *pxls_txt, int pxls_len)
{
    // Loob to parse the pixles
    char *pxls_str[pxls_len];
    if (pxls_len > 1)
    {
        char *pxl = strtok(pxls_txt, "/");
        for (int i = 0; i < pxls_len; i++)
        {
            pxls_str[i] = pxl;
            pxl = strtok(NULL, "/");
        }
    }
    else
    {
        pxls_str[0] = pxls_txt;
    }
    // Convert the string pixles to a pixle type
    pixle *pxls = malloc(sizeof(pixle) * pxls_len);
    for (int i = 0; i < pxls_len; i++)
    {
        pxls[i] = str_to_pxl(pxls_str[i]);
    }
    return pxls;
}

char* concatenate_pxls(pixle pxls[], int pxls_len)
{
    // Calculate the real size of the output.
    int pxls_size = sizeof(pixle) * pxls_len; // The size of "str pixle, like '52,26,88/'" is 12 bytes.

    // Allocate enophe memory for the output
    char *output = malloc(pxls_size);

    // Cleaning the garbage values
    for (int i = 0; i < pxls_size; i++)
    {
        output[i] = '\0';
    }

    char pxl[12];
    for (int i = 0; i < pxls_len; i++)
    {
        if (i + 1 != pxls_len)
        {
            sprintf(pxl, "%i,%i,%i/", pxls[i].red, pxls[i].green, pxls[i].blue);
        }
        else
        {
            sprintf(pxl, "%i,%i,%i", pxls[i].red, pxls[i].green, pxls[i].blue);
        }
        strcat(output, pxl);
    }
    return output;
}

void print_pxls_for_debugging(pixle pxls[], int pxls_len)
{
    // Printing the value for debugging
    char pxl[25];
    for (int i = 0; i < pxls_len; i++)
    {
        sprintf(pxl, "Pixle %i: %i,%i,%i", i, pxls[i].red, pxls[i].green, pxls[i].blue);
        printf("%s\n", pxl);
    }
}
