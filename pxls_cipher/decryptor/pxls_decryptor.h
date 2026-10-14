#ifndef PXLS_DECRYPTOR_H
#define PXLS_DECRYPTOR_H

#include "../helpers/helpers.h"

pixle decrypt_pxl(pixle pxl, affkey key);
pixle* decrypt_pxls(pixle pxls[], int pxls_num, affkey key);

#endif
