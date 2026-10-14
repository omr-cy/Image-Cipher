# This for CLI Usage in linux
gcc main.c\
    helpers/helpers.c\
    encryptor/pxls_encryptor.c\
    decryptor/pxls_decryptor.c\
    sha256_c/sha256.c\
    -o pxls_cipher

# This for Python Usage in Linux
gcc -FPIC -shared\
    main.c\
    helpers/helpers.c\
    encryptor/pxls_encryptor.c\
    decryptor/pxls_decryptor.c\
    sha256_c/sha256.c\
    -o pxls_cipher.so
