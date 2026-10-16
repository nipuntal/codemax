# Day 3 · Q20 — Tidy A File In Place  ·  [python]  ·  ⭐⭐⭐ · 9 min

Write a Python program `q20.py` which takes one argument, a filename, and tidies the
file **in place**:

* remove trailing whitespace from every line
* replace every run of two or more blank lines with a single blank line
* remove any blank lines at the very start and the very end of the file

The program must print **nothing** to stdout. Its only effect is to change the file.

```
cat -A messy.txt        (showing trailing spaces as they are)
hello   
world	

last line   

./q20.py messy.txt
cat messy.txt
hello
world

last line
./q20.py blanks.txt
cat blanks.txt
a

b
```

* Assume the file exists and fits in memory.
* Python only, no external programs.


> ⚠ **This question edits files in place.** Running the examples above really does rewrite
> `messy.txt` and `blanks.txt`. `./test.sh` restores the pristine data before every run and works on throwaway
> copies, so it is always safe. To restore by hand:
> ```sh
> ./test.sh reset
> ```

```sh
./test.sh          # then read WALKTHROUGH.md
```
