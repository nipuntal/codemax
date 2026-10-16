# Day 3 · Q21 — Wrap Lines In Place  ·  [python]  ·  ⭐⭐⭐⭐ · 15 min · **8 marks**

> **This is Question 9 of the COMP2041 practice exam, verbatim.**

Write a Python program `q21.py` which takes two command-line arguments: a positive
integer `n` (a maximum desired line length) and the name of a file.

Your program should change the file in the following way:

* Lines containing **n characters or less**, not including the newline, should not be
  changed.
* Lines **not containing a space** character should not be changed.
* Lines containing more than n characters **with a space in the first n characters**
  should have the **last space in the first n characters** changed to a newline.
* Lines containing more than n characters **without a space in the first n characters**
  should have the **first space on the line** changed to a newline.

The above rules should also be applied to new lines as they are created.

Your program should print nothing to stdout. Its only effect is to change the file
in place.

```
echo hello there how are you today > hello.txt
./q21.py 80 hello.txt
cat hello.txt
hello there how are you today
./q21.py 23 hello.txt
cat hello.txt
hello there how are
you today
./q21.py 12 hello.txt
cat hello.txt
hello there
how are you
today
./q21.py 6 hello.txt
cat hello.txt
hello
there
how
are
you
today
```

* Assume the file exists and fits in memory.
* Print nothing to stdout.
* You may create temporary files.
* Python only. You may not run external programs.
* **You may not import or otherwise use the `textwrap` module.**

> ⚠ **This question edits files in place.** Running the examples above really does
> rewrite `hello.txt` and `frost.txt`. That's the point of the question — but it means
> the sample data is consumed after one run.
>
> `./test.sh` restores both files automatically before every run, and works on
> throwaway copies, so it is always safe. To restore by hand at any time:
> ```sh
> ./test.sh reset
> ```

```sh
./test.sh          # then read WALKTHROUGH.md
```
