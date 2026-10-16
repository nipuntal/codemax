# Day 3 · Q16 — Print chmod Commands  ·  [shell script]  ·  ⭐⭐⭐ · 9 min

Scripts need to be executable. We want to check the commands before running them.

Write a POSIX-compatible shell script `q16.sh` which, given one or more filenames as
arguments, prints one line per file to stdout:

* If the file does **not** start with `#!`, print
  `# NAME is not a script`
* Else if the file is **already executable** by the owner, print
  `# NAME is already executable`
* Otherwise print the command `chmod 755 NAME`

`q16.sh` must **print** the commands, not execute them. It must not change any file.

```
./q16.sh run1 run2 notes.txt run3
chmod 755 run1
chmod 755 run2
# notes.txt is not a script
# run3 is already executable
```

* `#!/bin/dash`, POSIX only.
* Permitted external programs: `cat cut expr grep head ls sed sort tail test tr wc`
* Built-ins: `case cd echo exit for if read shift test while [`
* You may assume the files exist.

```sh
./test.sh          # then read WALKTHROUGH.md
```
