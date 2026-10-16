# Day 3 · Q18 — Print rm Commands for Duplicates  ·  [shell script]  ·  ⭐⭐⭐ · 10 min

Write a POSIX-compatible shell script `q18.sh` which takes zero or more filenames as
arguments and **prints** `rm` commands that would delete every file whose contents are
identical to an **earlier** file in the argument list.

It must print the commands, **not execute them**.

If no file can be removed, print `No duplicate files` instead.

```
./q18.sh file0.txt file1.txt file2.txt file3.txt file4.txt file5.txt file6.txt
rm file3.txt
rm file5.txt
rm file6.txt
./q18.sh file0.txt file1.txt file2.txt file4.txt file8.txt
No duplicate files
./q18.sh file2.txt file5.txt file7.txt
rm file5.txt
rm file7.txt
```

* Files contain arbitrary bytes and any number of lines.
* Filenames contain no whitespace and no slashes.
* Permitted external programs: `cat cmp cp diff echo grep head ls printf test wc`
* `#!/bin/dash`, POSIX only. No temporary files.

```sh
./test.sh          # then read WALKTHROUGH.md
```
