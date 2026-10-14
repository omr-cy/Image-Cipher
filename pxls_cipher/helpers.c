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

int get_pxls_number(char *pxls_txt)
{
    char *pixles = pxls_txt;
    int pxls_num = 1;
    for (int i = 0, slen = strlen(pixles); i < slen; i++)
    {
        if (pixles[i] == '/')
        {
            pxls_num += 1;
        }
    }
    return pxls_num;
}

pixle* parse_pxls(char *text, int pxls_num)
{
    // Loob to parse the pixles
    char *str_pxls[pxls_num];
    if (pxls_num > 1)
    {
        char *pxl = strtok(text, "/");
        for (int i = 0; i < pxls_num; i++)
        {
            str_pxls[i] = pxl;
            pxl = strtok(NULL, "/");
        }
    }
    else
    {
        str_pxls[0] = text;
    }
    // Convert the string pixles to a pixle type
    pixle *pxls = malloc(sizeof(pixle) * pxls_num);
    for (int i = 0; i < pxls_num; i++)
    {
        pxls[i] = str_to_pixle(str_pxls[i]);
    }
    return pxls;
}

char* concatenate_pxls(pixle pxls[], int pxls_num)
{
    char *output = malloc(sizeof(char) * 100);
    char pxl[20];
    for (int i = 0; i < pxls_num; i++)
    {
        if (i + 1 == pxls_num)
        {
            sprintf(pxl, "%i,%i,%i", pxls[i].red, pxls[i].green, pxls[i].blue);
            // printf("%s\n", pxl);
        }
        else
        {
            sprintf(pxl, "%i,%i,%i/", pxls[i].red, pxls[i].green, pxls[i].blue);
        }
        strcat(output, pxl);
    }
    return output;
}

void print_pxls_for_debugging(pixle pxls[], int pxls_num)
{
    // Printing the value for debugging
    char pxl[25];
    for (int i = 0; i < pxls_num; i++)
    {
        sprintf(pxl, "Pixle %i: %i,%i,%i", i, pxls[i].red, pxls[i].green, pxls[i].blue);
        printf("%s\n", pxl);
    }
}
