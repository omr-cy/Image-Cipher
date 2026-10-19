

## create a '`c` pixle structre' as a 'class in `python`
create a '`c` pixle structre' as a 'class in `python`' with 'ctypes' , 
this to make it eseier and more faster when sending and fetching pxls with `c` backend,
```c
// Pixle Structuer:
typedef struct {
    int r;
    int g;
    int b;
} pixle;
```
I think it's more faster to skipping the ('str to pxsl', 'pxsl to str', 'concatenate_pxls', 'parse_pxls' steps and sending the pxls with there type in `c` as a `*pixle`.
- currint commit '006190e'

> https://stackoverflow.com/questions/65901925/how-to-create-a-c-struct-from-python-using-ctypes


## اريد بناء دالة:
تاخذ مصفوفة مرتبة ومفتاح (رقم)
وبناء على الرقم تقوم الدالة بخلط العناصر وارجاعها في مصفوفة جديدة مخلوطة
واذا اعطيت الدالة المصفوفة المخلوطة بنفس المفتاح ترجع المصوفة لترتيبها الاصلي
