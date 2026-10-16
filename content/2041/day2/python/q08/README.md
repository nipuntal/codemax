# Day 2 · Python Q8 — N Distinct Words

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 10 min

Write a Python program `q08.py` which, given a single positive integer `n` as a
command-line argument, reads lines from standard input until **n different words** have
been read. It should then print, exactly:

```
n distinct words seen after L lines read.
```
where L is the number of lines read so far, and stop reading input.

If end-of-input is reached first, print:
```
End of input reached after L lines read - n different words not seen.
```

Words are whitespace-separated and compared **ignoring case**.

```
./q08.py 3
the cat
the dog
3 distinct words seen after 2 lines read.
```
```
./q08.py 4
Hello World
hello world
HELLO there friend
4 distinct words seen after 3 lines read.
```
```
./q08.py 10
one two
three
End of input reached after 2 lines read - 10 different words not seen.
```
```
./q08.py 1
first line here
1 distinct words seen after 1 lines read.
```

* Assume `n` is a positive integer.
* Assume stdin is ASCII with every line terminated by `\n`.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md` — note the count is checked **per line**, not per word.

```sh
./test.sh
```
