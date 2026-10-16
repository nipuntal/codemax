# Day 3 · Q17 — Add Filename Extensions  ·  [shell script]  ·  ⭐⭐⭐⭐ · 14 min · **8 marks**

> **This is Question 7 of the COMP2041 practice exam, verbatim.**

We have many executable scripts which we want to rename with an extension if possible.

Write a POSIX-compatible shell script `q17.sh` which, given one or more filenames as
command-line arguments, **prints shell commands** to add extensions to the filenames.
We need to check the commands before executing them, so `q17.sh` should print the
commands, **not execute them**.

For each filename, print one line to stdout:

* If the filename already has an extension (contains a `.`), print a line indicating this.
* If the file does not start with `#!`, print a line indicating this.
* If the `#!` line does not contain any of the strings `perl`, `python` or `sh`, print a
  line indicating this.
* If a file already exists with the new filename created by adding the appropriate
  extension, print a line indicating this.
* Otherwise, print a command to rename the file.

Match this output exactly:
```
./q17.sh script.rs
# script.rs already has an extension
./q17.sh script1
# script1 does not have a #! line
./q17.sh script2
# script2 no extension for #! line
./q17.sh script3
mv script3 script3.py
./q17.sh script1 script2 script3 script4 script5
# script1 does not have a #! line
# script2 no extension for #! line
mv script3 script3.py
mv script4 script4.pl
mv script5 script5.sh
```
and after `touch script4.pl`:
```
./q17.sh script4
# script4.pl already exists
```

* A `#!` line must be the **first** line in a file.
* Do not examine other lines in the files.
* Do not assume anything about the format of `#!` lines.
* `python` → `.py`, `perl` → `.pl`, `sh` → `.sh`
* Only add `.sh`, `.pl` and `.py`. Otherwise print the message.
* Your program must **not** rename the files.
* Assume the filenames given exist, and contain only letters, digits, `.` and `_`.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname expr false
  find grep head ls mkdir mv printf pwd rev rm rmdir sed seq sort stat strings tac tail
  tee test touch tr true uniq wc xargs`
* Built-ins: `cd echo exit for if case read shift while`
* `#!/bin/dash`, POSIX only. No Perl/C/Python/awk. No temporary files.

```sh
./test.sh          # then read WALKTHROUGH.md
```
