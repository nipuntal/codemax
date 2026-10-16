# Day 3 · Q19 — Replace Duplicates With Symbolic Links  ·  [shell script]  ·  ⭐⭐⭐⭐ · 14 min · **8 marks**

> **This is Question 8 of the COMP2041 practice exam, verbatim.**

We wish to save disk space by replacing identical copies of files with symbolic links.

Write a POSIX-compatible shell script `q19.sh`, which takes 0 or more names of files as
arguments, and **prints commands** to replace some of the files with symbolic links.
We need to check the commands before executing them, so `q19.sh` should print the
commands, **not execute them**.

For each file specified as an argument, if the file has identical contents (bytes) to
any **previous** file specified as an argument, `q19.sh` should print a `ln` command
which would replace the file with a symbolic link to the previous file.

If none of the files can be replaced by symbolic links, print the message shown in the
last example.

```
./q19.sh file0.txt file1.txt file2.txt file3.txt file4.txt file5.txt file6.txt file7.txt file8.txt
ln -s file0.txt file3.txt
ln -s file1.txt file6.txt
ln -s file2.txt file5.txt
ln -s file2.txt file7.txt
./q19.sh file6.txt file4.txt file1.txt file2.txt file3.txt file5.txt file7.txt file8.txt file0.txt
ln -s file6.txt file1.txt
ln -s file2.txt file5.txt
ln -s file2.txt file7.txt
ln -s file3.txt file0.txt
./q19.sh file8.txt file7.txt file6.txt file5.txt file4.txt file3.txt file2.txt file1.txt file0.txt
ln -s file7.txt file5.txt
ln -s file7.txt file2.txt
ln -s file6.txt file1.txt
ln -s file3.txt file0.txt
./q19.sh file3.txt file0.txt file3.txt file0.txt file3.txt file0.txt
ln -s file3.txt file0.txt
./q19.sh file1.txt file2.txt file3.txt file4.txt
No files can be replaced by symbolic links
```

**A note on ordering.** Print the `ln` lines in the order the duplicates appear in the
argument list. The exam's *second* and *third* examples are unambiguously in argument
order; its first example happens to list the same four links grouped by target, which
is the only place the paper is inconsistent. `expected_output.txt` here uses argument
order throughout.

* Your program should not change any files or create any links.
* Assume the arguments are names of ordinary files.
* Filenames contain no whitespace and no slashes.
* Assume nothing about the contents of the files.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname echo expr
  false find grep head ls mkdir mv printf pwd rev rm rmdir sed seq sort stat strings tac
  tail tee test touch tr true uniq wc xargs`
* Built-ins: `case cd exit for if read shift while`
* `#!/bin/dash`, POSIX only. No Perl/C/Python/awk. No temporary files.

```sh
./test.sh          # then read WALKTHROUGH.md
```
