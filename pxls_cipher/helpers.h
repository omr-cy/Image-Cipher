#ifndef HELPERS_H
#define HELPERS_H

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "sha256_c/sha256.h"

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

#endif
