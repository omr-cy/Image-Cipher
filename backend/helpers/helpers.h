#ifndef HELPERS_H
#define HELPERS_H

#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include "./sha256_c/sha256.h"

// Create a Pexle Structuer:
typedef struct {
    int r; // red
    int g; // green
    int b; // blue
} pixle;

/*
    Define the Functions Prototypes
*/
// Helpers
pixle str_to_pxl(char *rgb);
int get_pxls_len(char *pxls_txt);
pixle* parse_pxls(char *text, int pxls_len);
char* concatenate_pxls(pixle pxls[], int pxls_len);;
// Ciphers
int* generate_hex_keys(char *passwd);
void pxls_xor_cipher(pixle *pxls, int pxls_len, int *hex_keys);
void crds_xor_shuffler(pixle *pxls, int pxls_len, int *hex_keys);


#endif
