# Day 2 · Shell Q15 — Restore Backup Files

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 9 min · Format: **full script**

Our editor left `.bak` copies everywhere. We want them restored to their original
names.

Write a POSIX-compatible shell script `q15.sh` which renames every file with the
suffix `.bak` in the **current directory** to the same name without the `.bak`.

```
touch notes.txt.bak main.c.bak README.bak
ls
README.bak  main.c.bak  notes.txt.bak
./q15.sh
ls
README  main.c  notes.txt
```

If the target name **already exists**, your script must stop immediately with
**exactly** this error message on stdout and exit status **1**:
```
NAME exists
```
For example:
```
touch a.bak a
./q15.sh
a exists
echo $?
1
```

### Rules
* First line must be `#!/bin/dash`.
* You **may** use external programs such as `mv`.
* POSIX only, must run under `/bin/dash`. No bash extensions.
* No Perl/C/Python.
* No error checking other than described above.

Read `NOTES.md`.

```sh
./test.sh
```
