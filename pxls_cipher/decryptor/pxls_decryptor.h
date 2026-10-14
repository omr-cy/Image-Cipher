#ifndef PXLS_DECRYPTOR_H
#define PXLS_DECRYPTOR_H

#include "../helpers/helpers.h"

pixle decrypt_pxl(pixle pxl, int key);
pixle* decrypt_pxls(pixle pxls[], int pxls_len, int key);

#endif
