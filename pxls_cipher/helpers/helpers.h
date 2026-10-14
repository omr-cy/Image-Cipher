#ifndef HELPERS_H
#define HELPERS_H

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include "../sha256_c/sha256.h"

// Create a Pexle Structuer:
typedef struct {
    int red;
    int green;
    int blue;
} pixle;

// Create Affine Key Structuer
// typedef struct {
//     int a;
//     int b;
// } affkey;

// Define the Functions Prototypes
pixle str_to_pxl(char *rgb);
int generate_key(char *password);
int get_pxls_len(char *pxls_txt);
pixle* parse_pxls(char *text, int pxls_len);
char* concatenate_pxls(pixle pxls[], int pxls_len);
void print_pxls_for_debugging(pixle pxls[], int pxls_len);

#endif
