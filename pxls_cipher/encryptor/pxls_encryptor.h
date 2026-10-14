#ifndef PXLS_ENCRYPTOR_H
#define PXLS_ENCRYPTOR_H

#include "../helpers/helpers.h"

pixle encrypt_pxl(pixle pxl, affkey key);
pixle* encrypt_pxls(pixle pxls[], int pxls_len, affkey key);

#endif
