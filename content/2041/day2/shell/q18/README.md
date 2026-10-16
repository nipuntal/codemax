# Day 2 · Shell Q18 — Unused Header Files

**Difficulty:** ⭐⭐⭐⭐ (test level) · **Target:** 11 min · Format: **full script**

We want to find header files nobody is using.

Write a POSIX-compatible shell script `q18.sh` which is given one or more `.c`
filenames as arguments. It should print the name of every `.h` file **in the current
directory** that is **not** `#include`d by any of the given `.c` files.

Reminder: C include lines look like
```c
#include "file.h"
```
Do **not** consider includes with angle brackets, e.g. `#include <stdio.h>`.

Print one filename per line, in sorted order.

```
ls *.h
config.h  helper.h  orphan.h  shared.h  unused.h
./q18.sh a.c
config.h
orphan.h
unused.h
./q18.sh a.c b.c
orphan.h
unused.h
```

* You can assume filenames contain no whitespace or glob characters.

### Rules
* First line must be `#!/bin/dash`.
* You may use external programs such as `grep` and `sed`.
* POSIX only, must run under `/bin/dash`. No bash extensions.
* No Perl/C/Python.

Read `NOTES.md`.

```sh
./test.sh
```
