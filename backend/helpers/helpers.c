#include "helpers.h"
#include <alloca.h>
#include <stdint.h>
#include <stdlib.h>

// Convert the Input string to Pixle
pixle str_to_pxl(char *rgb)
{
    // atoi() // String to an Integer
    // strtok() // String Splitter
    pixle pxl;
    pxl.r = atoi(strtok(rgb, ","));
    pxl.g = atoi(strtok(NULL, ","));
    pxl.b = atoi(strtok(NULL, ","));
    return pxl;
}

int *generate_hex_keys(char *passwd)
{
    // Compute the sha256 of the passwd, from "sha256.c"
    char hex[SHA256_HEX_SIZE];
    sha256_hex(passwd, strlen(passwd), hex);

    // Allocate Memory
    int *hex_keys = malloc(sizeof(int)*65);

    for (int i = 0, x = 0, hex_len = strlen(hex); i < hex_len; i++, x++)
    {
        if (x < hex_len)
        {
            hex_keys[i] = (int) hex[x] + (int) hex[x+1];

            x++; // Important it must be base2 steps
        }
    }
    return hex_keys;
}

pixle* pxls_xor_cipher(pixle *pxls, int pxls_len, int *hex_keys)
{
    pixle *cipherd_pxls = malloc(sizeof(pixle) * pxls_len);
    int x = 0;

    for (int i = 0, kyes_len = 31; i < pxls_len; i++)
    {
        cipherd_pxls[i].r = pxls[i].r ^ ((hex_keys[x] * i) % 256);
        cipherd_pxls[i].g = pxls[i].g ^ ((hex_keys[x+1] * i) % 256);
        cipherd_pxls[i].b = pxls[i].b ^ ((hex_keys[x+2] * i) % 256);
        if (x <= kyes_len-1)
        {
            x+=3;
        }
        else
        {
            x = 0;
        }
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

    if (output == NULL)
    {
        exit(1);
    }

    // Cleaning the garbage values
    for (int i = 0; i < pxls_size; i++)
    {
        output[i] = '\0';
    }

    char pxl[20];
    for (int i = 0; i < pxls_len; i++)
    {
        if (i + 1 != pxls_len)
        {
            sprintf(pxl, "%i,%i,%i/", pxls[i].r, pxls[i].g, pxls[i].b);
        }
        else
        {
            sprintf(pxl, "%i,%i,%i", pxls[i].r, pxls[i].g, pxls[i].b);
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
        sprintf(pxl, "Pixle %i: %i,%i,%i", i, pxls[i].r, pxls[i].g, pxls[i].b);
        printf("%s\n", pxl);
    }
}
