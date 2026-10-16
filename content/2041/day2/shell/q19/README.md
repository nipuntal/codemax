# Day 2 · Shell Q19 — Uppercase a File In Place

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 9 min · Format: **full script**

Write a POSIX-compatible shell script `q19.sh` which takes one argument, the name of a
file, and converts every lowercase letter in that file to uppercase.

Your program should print **nothing** to stdout. The only thing it does is change the
file.

```
cat frost.txt
Two roads diverged in a wood, and I --
I took the one less traveled by,
./q19.sh frost.txt
cat frost.txt
TWO ROADS DIVERGED IN A WOOD, AND I --
I TOOK THE ONE LESS TRAVELED BY,
```

* You can assume the file exists.
* You are permitted to create temporary files.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname echo expr
  false find grep head ls mkdir mktemp mv printf pwd rev rm rmdir sed seq sort stat
  strings tac tail tee test touch tr true uniq wc xargs`
* First line must be `#!/bin/dash`. POSIX only. No Perl/C/Python.

Read `NOTES.md` — the "in place" part is the whole question.


> ⚠ **This question edits files in place.** Running the examples above really does rewrite
> `frost.txt`. `./test.sh` restores the pristine data before every run and works on throwaway
> copies, so it is always safe. To restore by hand:
> ```sh
> ./test.sh reset
> ```

```sh
./test.sh
```
